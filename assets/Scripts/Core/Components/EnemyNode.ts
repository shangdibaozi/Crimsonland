import { ecs } from "../../Libs/ECS";
import { error, Node, ProgressBar, Animation } from "cc";
import { ECSNode } from "./ECSNode";

@ecs.register('EnemyNode')
export class EnemyNode extends ecs.IComponent {
    set root(node: Node) {
        if(node) {
            this.ent.add(ECSNode).val = node;
            this.body = node.getChildByName('Body');
            this.hpBar = node.getComponentInChildren(ProgressBar);
            this.animation = node.getComponent(Animation);
        }
        else { 
            error('根节点不能为null');
        }
    }

    body: Node | null = null;
    hpBar: ProgressBar | null = null;
    animation: Animation | null = null;

    reset() {
        this.body = null;
        this.hpBar = null;
        this.animation = null;
    }
}