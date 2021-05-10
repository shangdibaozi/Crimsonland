import { v3, Vec3 } from "cc";
import { ecs } from "../../Libs/ECS";

@ecs.register('MonsterDead')
export class MonsterDead extends ecs.IComponent {
    pos: Vec3 = v3();

    reset() {

    }
}