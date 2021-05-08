import { instantiate, Node } from "cc";
import { Global } from "../Global";
import { Util } from "../Util";

export class ObjPool {
    private static bulletPool: Node[] = [];

    private static monsterPool: Node[] = [];

    static getBullet() {
        let node = this.bulletPool.pop() || instantiate(Global.gunCfg!.gunInfos[0].bullet);
        node.active = true;
        return node;
    }

    static putBullet(bullet: Node) {
        bullet.active = false;
        this.bulletPool.push(bullet);
    }

    static getMonster() {
        let node = this.monsterPool.pop() || instantiate(Util.randomChoice(Global.gameWorld!.monstersPrefab));
        node.active = true;
        return node;
    }

    static putMonster(monster: Node) {
        monster.active = false;
        this.monsterPool.push(monster);
    }
}