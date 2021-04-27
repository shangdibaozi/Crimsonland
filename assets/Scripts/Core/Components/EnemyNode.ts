import { ecs } from "../../Libs/ECS";
import { Node } from "cc";

@ecs.register('EnemyNode')
export class EnemyNode extends ecs.IComponent {
    root: Node | null = null;

    reset() {
        this.root?.destroy();
        this.root = null;
    }
}