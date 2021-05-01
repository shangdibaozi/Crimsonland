import { v3, Vec3 } from "cc";
import { AI_STATE } from "../../Constants";
import { ecs } from "../../Libs/ECS";

@ecs.register('AI')
export class AIComponent extends ecs.IComponent {

    aiState: AI_STATE = AI_STATE.IDLE;

    targetPos: Vec3 = v3();

    reset() {
        this.aiState = AI_STATE.IDLE;
    }
}