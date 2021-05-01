import { ecs } from "../../../Libs/ECS";
import { SetPositionSystem } from "./SetPositionSystem";
import { ZIndexSystem } from "./ZIndexSystem";

export class Render extends ecs.System {
    
    constructor() {
        super();

        this.add(new SetPositionSystem());
        this.add(new ZIndexSystem());
    }
}