import { Global } from "../../../Global";
import { ecs } from "../../../Libs/ECS";
import { ECSNode } from "../../Components/ECSNode";
import { Transform } from "../../Components/Transform";
import { Node } from "cc";

class Ent extends ecs.Entity {
    Transform!: Transform;
    ECSNode!: ECSNode;
}

export class SetPositionSystem extends ecs.ComblockSystem {

    flag = true;

    filter(): ecs.IMatcher {
        return ecs.allOf(Transform, ECSNode);
    }

    update(entities: Ent[]): void {
        entities.forEach(e => e.ECSNode.val!.setPosition(e.Transform.position));
        if(this.flag) {
            // 更新渲染层级
            // 从大到小排序，意味着y值大的渲染在下层，y值小的覆盖y值大的。
            Global.gameWorld?.avatarLayer.children.sort((a: Node, b: Node) => {
                return b.position.y - a.position.y;
            });
            Global.gameWorld?.avatarLayer._updateSiblingIndex();

            // node的setSiblingIndex存在性能问题
        }
        this.flag = !this.flag;
    }

}