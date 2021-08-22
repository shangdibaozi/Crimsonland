
import { _decorator, v3, Vec3, UITransform, macro } from 'cc';
import { ecs } from '../../Libs/ECS';
import { Util } from '../../Util';
import { ECSNode } from '../Components/ECSNode';
import { ECSTag } from '../Components/ECSTag';
import { Lifetime } from '../Components/Lifetime';
import { Movement } from '../Components/Movement';
import { BulletBase } from '../Components/Weapon/BulletBase';
import { ObjPool } from '../ObjPool';
import { BulletEnt } from '../Systems/EntityFactory';
import { GunBase } from './GunBase';
const { ccclass, property, executeInEditMode, playOnFocus } = _decorator;

let pos = v3();
let pos1 = v3();
let gHeading = v3(1, 0, 0);
let tmpHeading = v3();


@ccclass('Pistol')
export class Pistol extends GunBase {
    private compLst: ecs.ComponentType[] = [ECSNode, BulletBase, Movement, Lifetime, ECSTag.PistolBullet];
    private bulletGroup!: ecs.Group;

    onLoad() {
        super.onLoad();
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

        let bulletEnt = ecs.createEntityWithComps<BulletEnt>(...this.compLst);
        bulletEnt.get(ECSNode).val = bulletNode;
        let movement = bulletEnt.get(Movement);
        Vec3.multiplyScalar(movement.velocity, heading, this.speed);
        bulletEnt.get(Lifetime).time = 3;
        bulletEnt.BulletBase.damage = this.damage;
        console.log('bullet create:', bulletNode.uuid);
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
