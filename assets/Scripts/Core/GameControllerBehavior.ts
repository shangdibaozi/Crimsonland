
import { _decorator, Component, Node, Camera } from 'cc';
import { UI_EVENT } from '../Constants';
import { Global } from '../Global';
import { ecs } from '../Libs/ECS';
import { RootSystem } from './Systems/RootSystem';
import { SysUtil } from './Systems/SysUtil';
const { ccclass, property } = _decorator;

@ccclass('GameControllerBehavior')
export class GameControllerBehavior extends Component {
    rootSystem: RootSystem | null = null;

    start () {
        this.rootSystem = new RootSystem();
        this.rootSystem.init();

        Global.uiEvent.emit(UI_EVENT.START_GAME);
    }

    stopEcs() {
        ecs.clear();
        this.rootSystem!.clear();
        this.rootSystem = null;
    }

    update (deltaTime: number) {
        this.rootSystem!.execute(deltaTime);
    }
}