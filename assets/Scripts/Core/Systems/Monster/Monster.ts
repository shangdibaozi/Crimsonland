import { ecs } from "../../../Libs/ECS";
import { MonsterFactory } from "./MonsterFactory";

export class Monster extends ecs.System {
    constructor() {
        super();
        this.add(new MonsterFactory());
    }
}