import { v3, Vec3, } from "cc";
import { ecs } from "../../Libs/ECS";

@ecs.register('Transform')
export class Transform extends ecs.IComponent {
    position: Vec3 = v3(0, 0, 0);
    angle: number = 0;

    reset() {
        Vec3.zero(this.position);
        this.angle = 0;
    }
}