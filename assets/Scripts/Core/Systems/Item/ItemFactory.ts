import { instantiate } from "cc";
import { ITEM_COLLISION_RADIUS } from "../../../Constants";
import { Global } from "../../../Global";
import { ecs } from "../../../Libs/ECS";
import { Util } from "../../../Util";
import { MonsterDead } from "../../Components/MonsterDead";
import { TagGun } from "../../Components/Tag/TagGun.";
import { EntityFactory } from "../EntityFactory";

export class ItemFactory extends ecs.ComblockSystem {

    gunGroup!: ecs.Group;

    init() {
        this.gunGroup = ecs.createGroup(ecs.allOf(TagGun));
    }

    filter(): ecs.IMatcher {
        return ecs.allOf(MonsterDead);
    }

    update(entities: ecs.Entity[]): void {
        entities.forEach(ent => {
            let pos = ent.get(MonsterDead).pos;

            if(Math.random() <= 0.3 && this.gunGroup.count < 3) {
                let gunNode = instantiate(Util.randomChoice(Global.gunCfg!.gunInfos).gun);
                gunNode.parent = Global.gameWorld!.avatarLayer;
                gunNode.setPosition(pos);
    
                let itemEnt = EntityFactory.createItemEnt();
                itemEnt.ECSNode.val = gunNode;
                itemEnt.Lifetime.time = 40;

                itemEnt.Transform.position.set(pos);
                itemEnt.Collision.radius = ITEM_COLLISION_RADIUS;

                itemEnt.add(TagGun);
            }

            ent.destroy();
        });
    }
}