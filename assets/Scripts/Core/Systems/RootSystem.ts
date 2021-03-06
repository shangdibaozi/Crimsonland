import { ecs } from "../../Libs/ECS";
import { BulletSystem } from "./Bullet/BulletSystem";
import { Monster } from "./Monster/Monster";
import { PlayerControllerSystem } from "./PlayerController/PlayerControllerSystem";
import { Render } from "./Render/Render";
import { ItemSystem } from "./Item/ItemSystem";

export class RootSystem extends ecs.RootSystem {
    
    constructor() {
        super();
        
        this.add(new PlayerControllerSystem());
        this.add(new ItemSystem());
        this.add(new BulletSystem());
        this.add(new Monster());
        this.add(new Render());
    }
}