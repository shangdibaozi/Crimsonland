
import { _decorator, Component, Node, UITransform, Prefab, CameraComponent } from 'cc';
import { UI_EVENT } from '../Constants';
import { Global } from '../Global';
const { ccclass, property } = _decorator;

@ccclass('GameWorld')
export class GameWorld extends Component {

    @property(CameraComponent)
    camera!: CameraComponent;

    @property(Node)
    avatarLayer!: Node;;

    @property(Node)
    bulletLayer!: Node;

    @property(Prefab)
    monstersPrefab: Prefab[] = [];
 
    onLoad() {
        Global.gameWorld = this;

    }
}