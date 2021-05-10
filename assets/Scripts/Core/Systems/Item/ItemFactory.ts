import { instantiate } from "cc";
import { Global } from "../../../Global";
import { ecs } from "../../../Libs/ECS";
import { Util } from "../../../Util";
import { MonsterDead } from "../../Components/MonsterDead";
import { EntityFactory } from "../EntityFactory";

export class ItemFactory extends ecs.ComblockSystem {

    filter(): ecs.IMatcher {
        return ecs.allOf(MonsterDead);
    }

    update(entities: ecs.Entity[]): void {
        entities.forEach(ent => {
            let pos = ent.get(MonsterDead).pos;

            let gunNode = instantiate(Util.randomChoice(Global.gunCfg!.gunInfos).gun);
            gunNode.parent = Global.gameWorld!.avatarLayer;
            gunNode.setPosition(pos);

            let itemEnt = EntityFactory.createItemEnt();
            itemEnt.ECSNode.val = gunNode;
            itemEnt.Lifetime.time = 10;

            ent.destroy();
        });
    }
}