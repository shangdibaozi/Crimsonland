import { ecs } from "../../../Libs/ECS";
import { ECSNode } from "../../Components/ECSNode";
import { Lifetime } from "../../Components/Lifetime";
import { TagItem } from "../../Components/Tag/TagItem";

export class ItemLifetimeSystem extends ecs.ComblockSystem {

    filter(): ecs.IMatcher {
        return ecs.allOf(TagItem, Lifetime, ECSNode);
    }

    update(entities: ecs.Entity[]): void {
        for(let e of entities) {
            if((e.get(Lifetime).time -= this.dt) <= 0) {
                e.destroy();
            }
        }
    }
}