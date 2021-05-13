import { ecs } from "../../../Libs/ECS";
import { BulletMoveSystem } from "./BulletMoveSystem";
import { CollisionSystem } from "./CollisionSystem";
import { RocketSystem } from "./RocketSystem";

export class BulletSystem extends ecs.System {

    constructor() {
        super();

        this.add(new BulletMoveSystem());
        // this.add(new RocketSystem());
        this.add(new CollisionSystem());
    }
}