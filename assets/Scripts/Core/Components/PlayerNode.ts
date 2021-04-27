import { ecs } from "../../Libs/ECS";

import { Node } from "cc";

@ecs.register('PlayerNode')
export class PlayerNode extends ecs.IComponent {
    root: Node | null = null;
    bodyNode: Node | null = null;
    gunNode: Node | null = null;

    reset() {
        this.root = null;
        this.bodyNode = null;
        this.gunNode = null;
    }
}