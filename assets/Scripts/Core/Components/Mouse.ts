import { ecs } from "../../Libs/ECS";
import { UITransform, Node, v3, Vec3, Camera } from "cc";

@ecs.register('Mouse')
export class Mouse extends ecs.IComponent {
    
    pos: Vec3 = v3(0, 0, 0);
    heading: Vec3 = v3(0, 0, 0);

    reset() {
        Vec3.zero(this.pos);
        Vec3.zero(this.heading);
    }
}