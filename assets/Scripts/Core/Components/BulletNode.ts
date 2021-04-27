import { ecs } from "../../Libs/ECS";
import { Node } from "cc";

@ecs.register('BulletNode')
export class BulletNode extends ecs.IComponent {
    root: Node | null = null;

    reset() {
        this.root?.destroy();
        this.root = null;
    }
}