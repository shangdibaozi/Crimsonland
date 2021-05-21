import { ecs } from "../../../Libs/ECS";
import { BulletNode } from "../../Components/BulletNode";
import { Lifetime } from "../../Components/Lifetime";
import { Movement } from "../../Components/Movement";
import { Transform } from "../../Components/Transform";
import { BulletEnt } from "../EntityFactory";

export class BulletMoveSystem extends ecs.ComblockSystem {

    init() {
        
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
}