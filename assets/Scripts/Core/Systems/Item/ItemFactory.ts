import { Animation, instantiate } from "cc";
import { Global } from "../../../Global";
import { ecs } from "../../../Libs/ECS";
import { Util } from "../../../Util";
import { MonsterDead } from "../../Components/MonsterDead";
import { TagGun } from "../../Components/Tag/TagGun.";
import { ObjPool } from "../../ObjPool";
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
                let gunTableId = Number(Util.randomChoice(Object.keys(Global.cfgMgr!.gunCfg)));
                let gunCfg = Global.cfgMgr!.gunCfg[gunTableId];

                let gunNode = ObjPool.getNode(gunCfg.PrefabName);
                gunNode.parent = Global.gameWorld!.avatarLayer;
                gunNode.setPosition(pos);
                gunNode.getComponent(Animation)!.play('GunSuspension');
                gunNode.getChildByName('Shadow')!.active = true;
    
                let itemEnt = EntityFactory.createItemEnt();
                itemEnt.ECSNode.val = gunNode;
                itemEnt.Lifetime.time = 40;

                itemEnt.Transform.position.set(pos);

                itemEnt.add(TagGun);

                // 
                itemEnt.TagItem.tableId = gunTableId;
            }

            ent.destroy();
        });
    }
}