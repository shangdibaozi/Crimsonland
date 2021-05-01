import { ecs } from "../../../Libs/ECS";
import { ECSNode } from "../../Components/ECSNode";

class Ent extends ecs.Entity {
    ECSNode!: ECSNode;
}

export class ZIndexSystem extends ecs.ComblockSystem {



    init() {

    }

    filter(): ecs.IMatcher {
        return ecs.allOf(ECSNode);
    }

    update(entities: Ent[]): void {
        for(let e of entities) {
            e.ECSNode.uiTransform.priority = 1600 - (e.ECSNode.val.position.y - e.ECSNode.uiTransform.height * 0.5);
        }
    }

}