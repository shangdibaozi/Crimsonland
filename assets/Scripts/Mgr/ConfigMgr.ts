import { _decorator, Component, Node, Prefab, JsonAsset } from 'cc';
import { Global } from '../Global';
const { ccclass, property } = _decorator;

@ccclass('ConfigMgr')
export class ConfigMgr extends Component {
    @property(JsonAsset)
    private gunJson!: JsonAsset;


    gunCfg!: {[key: string]: GunInfo};

    onLoad() {
        Global.cfgMgr = this;

        this.gunCfg = this.gunJson.json as {[key: string]: GunInfo};
    }

    onDestroy() {
        Global.cfgMgr = null;
    }
}