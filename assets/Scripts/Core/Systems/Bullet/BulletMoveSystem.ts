import { instantiate, macro, Vec3 } from "cc";
import { UI_EVENT } from "../../../Constants";
import { Global } from "../../../Global";
import { ecs } from "../../../Libs/ECS";
import { BulletNode } from "../../Components/BulletNode";
import { Collision } from "../../Components/Collision";
import { Lifetime } from "../../Components/Lifetime";
import { Movement } from "../../Components/Movement";
import { Transform } from "../../Components/Transform";
import { ObjPool } from "../../ObjPool";
import { BulletEnt, EntityFactory } from "../EntityFactory";

export class BulletMoveSystem extends ecs.ComblockSystem {

    init() {
        // Global.uiEvent.on(UI_EVENT.CREATE_BULLET, this.onCreateBullet, this);
    }

    filter(): ecs.IMatcher {
        return ecs.allOf(Movement, Transform, Lifetime, BulletNode);
    }

    update(entities: BulletEnt[]): void {
        for(let bulletEnt of entities) {
            bulletEnt.Lifetime.time -= this.dt;
            if(bulletEnt.Lifetime.time <= 0) {
                bulletEnt.destroy();
            }
            else {
                bulletEnt.Transform.position.x += bulletEnt.Movement.heading.x * this.dt * bulletEnt.Movement.speed;
                bulletEnt.Transform.position.y += bulletEnt.Movement.heading.y * this.dt * bulletEnt.Movement.speed;
            }
        }
    }

    onCreateBullet(heading: Vec3, pos: Vec3) {
        let bulletNode = ObjPool.getBullet();
        bulletNode.parent = Global.gameWorld!.bulletLayer;
        bulletNode.setPosition(pos);
        bulletNode.angle = Math.atan2(heading.y, heading.x) * macro.DEG;
        
        let ent = EntityFactory.createBullet() as BulletEnt;
        ent.BulletNode.root = bulletNode;
        Vec3.copy(ent.Movement.heading, heading);
        ent.Movement.speed = 300;

        Vec3.copy(ent.Transform.position, pos);

        ent.Lifetime.time = 30;

        ent.Collision.radius = 6;

        ent.BulletBase.damage = 5;
    }
}