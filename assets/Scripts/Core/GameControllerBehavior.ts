
import { _decorator, Component, Node, Camera } from 'cc';
import { UI_EVENT } from '../Constants';
import { Global } from '../Global';
import { RootSystem } from './Systems/RootSystem';
const { ccclass, property } = _decorator;

@ccclass('GameControllerBehavior')
export class GameControllerBehavior extends Component {
    @property(Node)
    playerNode!: Node;

    rootSystem!: RootSystem;

    start () {
        this.rootSystem = new RootSystem();
        this.rootSystem.init();

        Global.uiEvent.emit(UI_EVENT.CREATE_PLAYER_ENT, this.playerNode);
        Global.uiEvent.emit(UI_EVENT.START_GAME);
    }

    update (deltaTime: number) {
        this.rootSystem.execute(deltaTime);
    }
}