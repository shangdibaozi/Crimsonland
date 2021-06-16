
import { _decorator, EventMouse, macro, systemEvent, SystemEvent, UITransform, Vec2, Vec3, v3 } from 'cc';
import { ecs } from '../../Libs/ECS';
import { ECSNode } from '../Components/ECSNode';
import { Lifetime } from '../Components/Lifetime';
import { Movement } from '../Components/Movement';
import { TagFireBullet } from '../Components/Tag/TagFireBullet';
import { BulletBase } from '../Components/Weapon/BulletBase';
import { ObjPool } from '../ObjPool';
import { GunBase } from './GunBase';

let pos = v3();
let pos1 = v3();
let gHeading = v3(1, 0, 0);
let gHeading1 = v3()
let tmpHeading = v3();

const { ccclass, property } = _decorator;
@ccclass('FlameThrower')
export class FlameThrower extends GunBase {
    private compLst: ecs.ComponentConstructor[] = [ECSNode, BulletBase, Movement, Lifetime, TagFireBullet];

    // 火焰长度
    fireLength: number = 100;

    private bulletGroup!: ecs.Group;

    onLoad() {
        this.bulletGroup = ecs.createGroup(ecs.allOf(...this.compLst));
        
        this.fireLength = 100 + (this.speed - 40) / (100 - 40) * (300 - 100); // 火焰长度最小100最大300
    }

    createBullet(heading: Vec3, lineHeading: Vec3, angle: number) {
        let bulletNode = ObjPool.getNode(this.bullet.data.name, this.bullet);
        bulletNode.active = true;
        bulletNode.parent = this.parentLayer;
        bulletNode.angle = angle;
        
        this.muzzle.getComponent(UITransform)!.convertToWorldSpaceAR(Vec3.ZERO, pos);
        this.parentLayer.getComponent(UITransform)!.convertToNodeSpaceAR(pos, pos);
        bulletNode.setPosition(pos);

        let bulletEnt = ecs.createEntityWithComps(...this.compLst);
        bulletEnt.get(ECSNode).val = bulletNode;
        let movement = bulletEnt.get(Movement);
        Vec3.multiplyScalar(movement.velocity, heading, this.speed);
        bulletEnt.get(Lifetime).time = 6;

        pos.x += lineHeading.x * this.fireLength;
        pos.y += lineHeading.y * this.fireLength;

        bulletEnt.get(TagFireBullet).targetPoint.set(pos);
        bulletEnt.get(BulletBase).damage = this.damage;
    }

    shoot() {
        if(!this.canShoot) {
            return;
        }
        this.canShoot = false;
        
        let baseRad = Math.atan2(this.shootHeading.y, this.shootHeading.x);
        let baseAngle = baseRad * macro.DEG;

        
        this.flag = (this.flag + 1) % 3;

        let angle = baseAngle;
        angle += this.angle * (this.flag === 1 ? 1 : (this.flag === 0) ? 0 : -1);
        let rad = angle * macro.RAD;
        tmpHeading.set(Math.cos(rad), Math.sin(rad), 0);
        
        this.createBullet(tmpHeading, this.shootHeading, angle);
    }

    flag = 0;
    update(dt: number) {
        super.update(dt);
        this.bulletGroup.matchEntities.forEach(ent => {
            let node = ent.get(ECSNode).val!;
            let movement = ent.get(Movement);
            let lifeTime = ent.get(Lifetime);
            let targetPoint = ent.get(TagFireBullet).targetPoint;

            lifeTime.time -= dt;
            if(lifeTime.time <= 0) {
                ent.destroy();
                return;
            }

            Vec3.subtract(gHeading, targetPoint, node.position);
            gHeading.normalize().multiplyScalar(this.speed);

            Vec3.subtract(tmpHeading, gHeading, movement.velocity);
            tmpHeading.normalize().multiplyScalar(this.speed);
            
            movement.acceleration.set(tmpHeading);

            Vec3.multiplyScalar(tmpHeading, movement.acceleration, dt);

            Vec3.add(movement.velocity, movement.velocity, tmpHeading);
            let dist = movement.velocity.length();
            if(dist > this.speed) {
                movement.velocity.multiplyScalar(this.speed / dist);
            }

            Vec3.multiplyScalar(pos, movement.velocity, dt);
            movement.acceleration.set(Vec3.ZERO);
            node.getPosition(pos1);
            node!.setPosition(Vec3.add(pos, pos, pos1));

            node.angle = Math.atan2(movement.velocity.y, movement.velocity.x) * macro.DEG;

            if(Vec3.subtract(tmpHeading, node.position, targetPoint).length() <= 2) {
                ent.destroy();
            }
        });
    }
}
