import { ecs } from "../../../Libs/ECS";
import { BulletMoveSystem } from "./BulletMoveSystem";
import { CollisionSystem } from "./CollisionSystem";

export class BulletSystem extends ecs.System {

    constructor() {
        super();

        this.add(new BulletMoveSystem());
        this.add(new CollisionSystem());
    }
}