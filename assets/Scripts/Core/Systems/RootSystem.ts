import { ecs } from "../../Libs/ECS";
import { BulletSystem } from "./Bullet/BulletSystem";
import { Monster } from "./Monster/Monster";
import { PlayerControllerSystem } from "./PlayerController/PlayerControllerSystem";
import { PlayerMoveSystem } from "./PlayerMoveSystem";
import { Render } from "./Render/Render";

export class RootSystem extends ecs.RootSystem {
    
    constructor() {
        super();

        this.add(new PlayerControllerSystem());
        this.add(new PlayerMoveSystem());
        this.add(new BulletSystem());
        this.add(new Monster());
        this.add(new Render());
    }
}