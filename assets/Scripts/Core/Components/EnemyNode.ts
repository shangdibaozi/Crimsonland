import { ecs } from "../../Libs/ECS";
import { error, Node } from "cc";
import { ECSNode } from "./ECSNode";
import { ObjPool } from "../ObjPool";

@ecs.register('EnemyNode')
export class EnemyNode extends ecs.IComponent {
    set root(node: Node) {
        if(node) {
            this.ent.add(ECSNode).val = node;
        }
        else { 
            error('根节点不能为null');
        }
    }

    reset() {
        let node = this.ent.get(ECSNode).val;
        if(node) {
            ObjPool.putNode(node);
        }
    }
}