import { EventTarget } from "cc";
import { ConfigMgr } from "./Mgr/ConfigMgr";
import { GameWorld } from "./Mgr/GameWorld";

class UIEvent extends EventTarget {
    constructor() {
        super();
    }
}

export class Global {
    static uiEvent: UIEvent = new UIEvent();
    static gameWorld: GameWorld | null;
    static cfgMgr: ConfigMgr | null;
}

