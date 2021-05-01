import { ecs } from "../../../Libs/ECS";
import { AI } from "./AI";
import { MonsterFactory } from "./MonsterFactory";

export class Monster extends ecs.System {
    constructor() {
        super();
        this.add(new MonsterFactory());
        this.add(new AI());
    }
}