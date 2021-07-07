import { v3, Vec3 } from "cc";
import { ITEM_COLLISION_RADIUS } from "../../../Constants";
import { Global } from "../../../Global";
import { ecs } from "../../../Libs/ECS";
import { Collision } from "../../Components/Collision";
import { TagGun } from "../../Components/Tag/TagGun.";
import { TagItem } from "../../Components/Tag/TagItem";
import { TagPlayer } from "../../Components/Tag/TagPlayer";
import { Transform } from "../../Components/Transform";
import { ObjPool } from "../../ObjPool";
import { GunEnt, ItemEnt, PlayerEnt } from "../EntityFactory";

let tmpDelta = v3();

export class ItemCollisionSystem extends ecs.ComblockSystem {

    playerGroup!: ecs.Group<PlayerEnt>;

    init() {
        this.playerGroup = ecs.createGroup(ecs.allOf(TagPlayer));
    }

    filter(): ecs.IMatcher {
        return ecs.allOf(Transform, Collision, TagItem);
    }

    update(entities: ItemEnt[]): void {

        let playerPos = this.playerGroup.entity.Transform.position;
        entities.forEach(ent => {
            Vec3.subtract(tmpDelta, ent.Transform.position, playerPos);
            if(Math.abs(tmpDelta.x) <= ITEM_COLLISION_RADIUS && Math.abs(tmpDelta.y) <= ITEM_COLLISION_RADIUS) {
                if(ent.has(TagGun)) {
                    // 更换武器
                    let gunEnt = ecs.getEntityByEid<GunEnt>(this.playerGroup.entity.AvatarProperties.weaponEid);
                    gunEnt.GunNode.gunBase!.reset();
                    // 枪节点回收
                    ObjPool.putNode(gunEnt.GunNode.root!);
                    let newGunNode = ent.ECSNode.val!;
                    ent.ECSNode.val = null; // 实体销毁时会回收ECSNode组件中的节点，但是当前枪结点已经在使用，所以值为null不让回收
                    newGunNode.setPosition(Vec3.ZERO);
                    newGunNode.parent = this.playerGroup.entity.PlayerNode.gunNode;
                    gunEnt.GunNode.init(newGunNode, Global.gameWorld!.avatarLayer, Global.cfgMgr!.gunCfg[ent.TagItem.tableId]);
                }

                ent.destroy();
            }
        });
    }
}