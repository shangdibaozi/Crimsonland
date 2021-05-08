
import { _decorator, Component, Node, Prefab } from 'cc';
import { Global } from '../Global';
const { ccclass, property } = _decorator;

@ccclass('GunInfo')
class GunInfo {
    @property(Prefab)
    gun!: Prefab;

    @property(Prefab)
    bullet!: Prefab;
}

@ccclass('GunConfig')
export class GunConfig extends Component {
    @property(GunInfo)
    gunInfos: GunInfo[] = [];

    onLoad() {
        Global.gunCfg = this;
    }

    onDestroy() {
        Global.gunCfg = null;
    }
}