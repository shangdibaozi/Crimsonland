import { ecs } from "../../../Libs/ECS";
import { ItemFactory } from "./ItemFactory";
import { ItemLifetimeSystem } from "./ItemLifetimeSystem";

export class ItemSystem extends ecs.System {
    constructor() {
        super();

        this.add(new ItemFactory());
        this.add(new ItemLifetimeSystem());
    }
}