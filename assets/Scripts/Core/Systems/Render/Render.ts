import { ecs } from "../../../Libs/ECS";
import { SetPositionSystem } from "./SetPositionSystem";

export class Render extends ecs.System {
    
    constructor() {
        super();

        this.add(new SetPositionSystem());
    }
}