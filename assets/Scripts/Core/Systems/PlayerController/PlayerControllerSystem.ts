import { sys } from "cc";
import { ecs } from "../../../Libs/ECS";
import { KeyboardSystem } from "./KeyboardSystem";
import { MouseSystem } from "./MouseSystemt";

export class PlayerControllerSystem extends ecs.System {

    constructor() {
        super();

        this.add(new KeyboardSystem());
        this.add(new MouseSystem());
    }
}