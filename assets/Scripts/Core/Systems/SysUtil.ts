import { Global } from "../../Global";
import { EntityFactory, PlayerEnt } from "./EntityFactory";
import { Animation, Node, Vec3 } from "cc";
import { ObjPool } from "../ObjPool";
import { GunBase } from "../Gun/GunBase";

export class SysUtil {

    static createPlayer(node: Node) {
        let player = EntityFactory.createPlayerEnt() as PlayerEnt;
        player.PlayerNode.root = node;
        player.PlayerNode.bodyNode = node.getChildByName('Body');
        player.PlayerNode.gunNode = node.getChildByName('GunPos');
        player.PlayerNode.bodyAnim = player.PlayerNode.bodyNode!.getComponentInChildren(Animation);

        player.Movement.maxSpeed = 50;
        player.Movement.speed = 0;
        player.Movement.heading.x = 1;
        player.Movement.velocity.set(Vec3.ZERO);

        player.CameraFollow.camera = Global.gameWorld!.camera.node;
        

        // 游戏开始默认给玩家的是手枪
        let gunId = 10000;
        let gunCfg = Global.cfgMgr!.gunCfg[gunId];
        let gunNode = ObjPool.getNode(gunCfg.PrefabName);
        gunNode.active = true;
        gunNode.parent = player.PlayerNode.gunNode;
        gunNode.setPosition(Vec3.ZERO);
        let gunEnt = EntityFactory.createGunEnt();
        gunEnt.GunNode.init(gunNode, Global.gameWorld!.avatarLayer, gunCfg);
        player.AvatarProperties.weaponEid = gunEnt.eid;
    }
}