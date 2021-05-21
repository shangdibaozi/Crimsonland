import { Global } from "../../Global";
import { Keyboard } from "../Components/Keyboard";
import { EntityFactory, PlayerEnt } from "./EntityFactory";
import { instantiate, Node, UITransform, Vec3 } from "cc";
import { NODE_TYPE, ObjPool } from "../ObjPool";

export class SysUtil {

    static createPlayer(node: Node) {
        let player = EntityFactory.createPlayerEnt() as PlayerEnt;
        player.PlayerNode.root = node;
        player.PlayerNode.bodyNode = node.getChildByName('Body');
        player.PlayerNode.gunNode = node.getChildByName('GunPos');

        player.Movement.maxSpeed = 50;
        player.Movement.speed = 0;
        player.Movement.heading.x = 1;
        player.Movement.velocity.set(Vec3.ZERO);

        player.Collision.radius = 14;

        player.CameraFollow.camera = Global.gameWorld!.camera.node;
        

        // 游戏开始默认给玩家的是手枪
        let gunId = 10002;
        let gunCfg = Global.cfgMgr!.gunCfg[gunId];
        let gunNode = ObjPool.getNode(gunCfg.PrefabName);
        gunNode.active = true;
        gunNode.parent = player.PlayerNode.gunNode;
        gunNode.setPosition(Vec3.ZERO);
        let gunEnt = EntityFactory.createGunEnt();
        gunEnt.GunNode.root = gunNode;
        gunEnt.GunBase.init(gunCfg);
        player.AvatarProperties.weaponEid = gunEnt.eid;
    }
}