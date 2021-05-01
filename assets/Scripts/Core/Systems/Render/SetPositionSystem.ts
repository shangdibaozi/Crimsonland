import { ecs } from "../../../Libs/ECS";
import { ECSNode } from "../../Components/ECSNode";
import { Transform } from "../../Components/Transform";

class Ent extends ecs.Entity {
    Transform!: Transform;
    ECSNode!: ECSNode;
}

export class SetPositionSystem extends ecs.ComblockSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(Transform, ECSNode);
    }

    update(entities: Ent[]): void {
        for(let e of entities) {
            e.ECSNode.val.setPosition(e.Transform.position);
        }
    }

}