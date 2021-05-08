
import { _decorator, Component, Node, Camera } from 'cc';
import { UI_EVENT } from '../Constants';
import { Global } from '../Global';
import { RootSystem } from './Systems/RootSystem';
import { SysUtil } from './Systems/SysUtil';
const { ccclass, property } = _decorator;

@ccclass('GameControllerBehavior')
export class GameControllerBehavior extends Component {
    rootSystem!: RootSystem;

    start () {
        this.rootSystem = new RootSystem();
        this.rootSystem.init();

        Global.uiEvent.emit(UI_EVENT.START_GAME);
    }

    

    update (deltaTime: number) {
        this.rootSystem.execute(deltaTime);
    }
}