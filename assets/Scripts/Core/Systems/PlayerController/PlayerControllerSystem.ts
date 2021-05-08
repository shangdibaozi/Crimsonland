import { sys } from "cc";
import { ecs } from "../../../Libs/ECS";
import { AutoFire } from "./AutoFire";
import { CameraFollow } from "./CameraFollow";
import { KeyboardSystem } from "./KeyboardSystem";
import { PlayerMoveSystem } from "./PlayerMoveSystem";

export class PlayerControllerSystem extends ecs.System {

    constructor() {
        super();

        this.add(new KeyboardSystem());
        this.add(new PlayerMoveSystem());
        this.add(new CameraFollow());
        this.add(new AutoFire());
    }
}