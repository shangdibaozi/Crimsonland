
import { _decorator, v3, Vec3, systemEvent, SystemEvent, EventMouse, Vec2, UITransform, macro } from 'cc';
import { ecs } from '../../Libs/ECS';
import { Util } from '../../Util';
import { ECSNode } from '../Components/ECSNode';
import { Lifetime } from '../Components/Lifetime';
import { Movement } from '../Components/Movement';
import { TagRotate } from '../Components/Tag/TagRotate';
import { BulletBase } from '../Components/Weapon/BulletBase';
import { ObjPool } from '../ObjPool';
import { GunBase } from './GunBase';
const { ccclass, property, executeInEditMode, playOnFocus } = _decorator;

let pos = v3();
let pos1 = v3();
let gHeading = v3(1, 0, 0);
let tmpHeading = v3();

@ccclass('Cannon')
export class Cannon extends GunBase {
    private bulletGroup!: ecs.Group;

    private compLst: ecs.ComponentConstructor[] = [ECSNode, Movement, Lifetime, TagRotate, BulletBase];

    onLoad() {
        this.bulletGroup = ecs.createGroup(ecs.allOf(...this.compLst));
    }

    onDisable() {
        
    }

    createBullet(heading: Vec3) {
        let bulletNode = ObjPool.getNode(this.bullet.data.name, this.bullet);
        bulletNode.active = true;
        bulletNode.parent = this.parentLayer;
        
        this.muzzle.getComponent(UITransform)!.convertToWorldSpaceAR(Vec3.ZERO, pos);
        this.parentLayer.getComponent(UITransform)!.convertToNodeSpaceAR(pos, pos);
        bulletNode.setPosition(pos);

        let bulletEnt = ecs.createEntityWithComps(...this.compLst);
        bulletEnt.get(ECSNode).val = bulletNode;
        let movement = bulletEnt.get(Movement);
        Vec3.multiplyScalar(movement.velocity, heading, this.speed);
        bulletEnt.get(Lifetime).time = 3;

        bulletEnt.get(TagRotate).speed = 300;
        bulletEnt.get(BulletBase).damage = this.damage;
    }

    shoot() {
        if(!this.canShoot) {
            return; 
        }
        this.canShoot = false;

        let angle = Math.atan2(this.shootHeading.y, this.shootHeading.x) * macro.DEG;
        angle += Util.randomRange(-this.angle, this.angle);
        let rad = angle * macro.RAD;
        tmpHeading.set(Math.cos(rad), Math.sin(rad), 0);
        this.createBullet(tmpHeading);

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
            node?.setPosition(Vec3.add(pos, pos, pos1));

            let angle = node.angle + ent.get(TagRotate).speed * dt;
            node.angle = angle % 360;
        });
    }
}
