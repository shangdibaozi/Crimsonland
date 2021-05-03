import { sys } from "cc";
import { ecs } from "../../../Libs/ECS";
import { CameraFollow } from "./CameraFollow";
import { KeyboardSystem } from "./KeyboardSystem";
import { MouseSystem } from "./MouseSystemt";
import { PlayerMoveSystem } from "./PlayerMoveSystem";

export class PlayerControllerSystem extends ecs.System {

    constructor() {
        super();

        this.add(new KeyboardSystem());
        this.add(new MouseSystem());
        this.add(new PlayerMoveSystem());
        this.add(new CameraFollow());
    }
}