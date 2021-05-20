import { ecs } from "../../Libs/ECS";

import { error, Node, ProgressBar } from "cc";
import { ECSNode } from "./ECSNode";

@ecs.register('PlayerNode')
export class PlayerNode extends ecs.IComponent {
    set root(node: Node) {
        if(node) {
            this.ent.add(ECSNode).val = node;
            this.hpBar = node.getComponentInChildren(ProgressBar);
        }
        else { 
            error('根节点不能为null');
        }
    }

    bodyNode: Node | null = null;
    gunNode: Node | null = null;
    hpBar: ProgressBar | null = null;

    reset() {
        this.bodyNode = null;
        this.gunNode = null;
        this.hpBar = null;
    }
}