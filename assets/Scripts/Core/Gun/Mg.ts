
import { _decorator, macro, UITransform, Vec3, v3 } from 'cc';
import { ecs } from '../../Libs/ECS';
import { Util } from '../../Util';
import { ECSNode } from '../Components/ECSNode';
import { Lifetime } from '../Components/Lifetime';
import { Movement } from '../Components/Movement';
import { TagMgBullet } from '../Components/Tag/TagMgBullet';
import { BulletBase } from '../Components/Weapon/BulletBase';
import { ObjPool } from '../ObjPool';
import { GunBase } from './GunBase';

let pos = v3();
let pos1 = v3();
let tmpHeading = v3();

const { ccclass, property } = _decorator;
@ccclass('Mg')
export class Mg extends GunBase {

    private compLst: ecs.ComponentConstructor[] = [ECSNode, BulletBase, Movement, Lifetime, TagMgBullet];
    
    private bulletGroup!: ecs.Group;

    onLoad() {
        this.bulletGroup = ecs.createGroup(ecs.allOf(...this.compLst));

        
    }

    createBullet(heading: Vec3, angle: number) {
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
        bulletEnt.get(Lifetime).time = 3;

        bulletEnt.get(BulletBase).damage = this.damage;
    }

    shoot() {
        if(!this.canShoot) {
            return;
        }
        this.canShoot = true;

        let baseRad = Math.atan2(this.shootHeading.y, this.shootHeading.x)
            let baseAngle = baseRad * macro.DEG;

            let angle = baseAngle + Util.randomRange(-this.angle, this.angle);
            let rad = angle * macro.RAD;
            tmpHeading.set(Math.cos(rad), Math.sin(rad), 0);
            this.createBullet(tmpHeading, angle);

            this.node.setPosition(this.kickbackAmount, 0, 0);
    }

    update(dt: number) {
        super.update(dt);

        this.bulletGroup.matchEntities.forEach(ent => {
            let node = ent.get(ECSNode).val!;
            let movement = ent.get(Movement);
            let lifeTime = ent.get(Lifetime);

            lifeTime.time -= dt;
            if(lifeTime.time <= 0) {
                ent.destroy();
                return;
            }

            Vec3.multiplyScalar(pos, movement.velocity, dt)
            node.getPosition(pos1);
            node!.setPosition(Vec3.add(pos, pos, pos1));
        });
    }

    reset() {
        this.bulletGroup.matchEntities.forEach(ent => {
            ent.destroy();
        });
        this.isOnTheGround = true;
    }
}
