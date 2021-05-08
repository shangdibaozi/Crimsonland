import { EventTarget } from "cc";
import { ConfigMgr } from "./Mgr/ConfigMgr";
import { GameWorld } from "./Mgr/GameWorld";
import { GunConfig } from "./Mgr/GunConfig";

class UIEvent extends EventTarget {
    constructor() {
        super();
    }
}

export class Global {
    static uiEvent: UIEvent = new UIEvent();
    static gunCfg: GunConfig | null;
    static gameWorld: GameWorld | null;
    static cfgMgr: ConfigMgr | null;
}

