import { v3, Vec3 } from "cc";
import { ecs } from "../../Libs/ECS";

@ecs.register('Movement')
export class Movement extends ecs.IComponent {
    heading: Vec3 = v3(0, 0, 0);
    speed: number = 0;

    reset() {
        Vec3.zero(this.heading);
        this.speed = 0;
    }
}