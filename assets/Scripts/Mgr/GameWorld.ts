
import { _decorator, Component, Node, UITransform, Prefab, CameraComponent } from 'cc';
import { UI_EVENT } from '../Constants';
import { SysUtil } from '../Core/Systems/SysUtil';
import { Global } from '../Global';
const { ccclass, property } = _decorator;

@ccclass('GameWorld')
export class GameWorld extends Component {

    @property(CameraComponent)
    camera!: CameraComponent;

    @property(Node)
    avatarLayer!: Node;

    @property(UITransform)
    avatarLayerUITransform!: UITransform;

    @property(Node)
    bulletLayer!: Node;

    @property(Node)
    playerNode!: Node;

    @property(Prefab)
    monstersPrefab: Prefab[] = [];
 
    onLoad() {
        Global.gameWorld = this;

        Global.uiEvent.on(UI_EVENT.START_GAME, this.onStartGame, this);
    }

    onStartGame() {
        SysUtil.createPlayer(this.playerNode);
    }

    onDestroy() {
        Global.uiEvent.targetOff(this);
        Global.gameWorld = null;
    }
}