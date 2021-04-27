import { EventTarget } from "cc";
import { GameWorld } from "./Mgr/GameWorld";
import { GunConfig } from "./Mgr/GunConfig";

class UIEvent extends EventTarget {
    constructor() {
        super();
    }
}

export class Global {
    static uiEvent: UIEvent = new UIEvent();
    static gunCfg: GunConfig;
    static gameWorld: GameWorld;
}

