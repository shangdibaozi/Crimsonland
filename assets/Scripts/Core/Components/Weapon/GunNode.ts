import { ecs } from "../../../Libs/ECS";
import { Node, UITransform } from "cc";

@ecs.register('GunNode')
export class GunNode extends ecs.IComponent {
    root: Node | null = null;
    gunPointUITransform: UITransform | null = null;
    
    reset() {
        this.root = null;
        this.gunPointUITransform = null;
    }
}