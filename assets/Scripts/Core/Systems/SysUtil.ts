import { Global } from "../../Global";
import { Keyboard } from "../Components/Keyboard";
import { EntityFactory, PlayerEnt } from "./EntityFactory";
import { instantiate, Node, UITransform } from "cc";

export class SysUtil {

    static createPlayer(node: Node) {
        let player = EntityFactory.createPlayerEnt() as PlayerEnt;
        player.PlayerNode.root = node;
        player.PlayerNode.bodyNode = node.children[0];
        player.PlayerNode.gunNode = node.children[1];

        player.Movement.maxSeed = 50;
        player.Movement.speed = 0;
        player.Movement.heading.x = 1;

        player.Collision.radius = 14;

        player.CameraFollow.camera = Global.gameWorld!.camera.node;

        // 判断运行环境
        // player.add(Keyboard);

        let gunNode = instantiate(Global.gunCfg!.gunInfos[0].gun);
        gunNode.parent = player.PlayerNode.gunNode;
        let gunEnt = EntityFactory.createGunEnt();
        gunEnt.GunNode.root = gunNode;
        gunEnt.GunNode.gunPointUITransform = gunNode.getChildByName('ShootPoint')?.getComponent(UITransform)!; 
        gunEnt.GunBase.init(Global.cfgMgr!.gunCfg[10000]);
        player.AvatarProperties.weaponEid = gunEnt.eid;
    }
}