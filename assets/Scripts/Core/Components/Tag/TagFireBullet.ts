import { v3, Vec3 } from "cc";
import { ecs } from "../../../Libs/ECS";

@ecs.register('TagFireBullet')
export class TagFireBullet extends ecs.IComponent {
    targetPoint: Vec3 = v3();

    reset() {
        this.targetPoint.set(Vec3.ZERO);
    }
}