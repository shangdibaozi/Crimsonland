import { ecs } from "../../Libs/ECS";

import { error, Node } from "cc";
import { ECSNode } from "./ECSNode";

@ecs.register('PlayerNode')
export class PlayerNode extends ecs.IComponent {
    set root(node: Node) {
        if(node) {
            this.ent.add(ECSNode).val = node;
        }
        else { 
            error('根节点不能为null');
        }
    }

    bodyNode: Node | null = null;
    gunNode: Node | null = null;

    reset() {
        this.bodyNode = null;
        this.gunNode = null;
    }
}