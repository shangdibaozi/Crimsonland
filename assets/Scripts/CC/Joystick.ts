import { _decorator, Component, Node, UITransform, Prefab, CameraComponent, SystemEventType, EventTouch, v3, Vec2, Vec3, UIOpacity, CCInteger } from 'cc';
import { UI_EVENT } from '../Constants';
import { Global } from '../Global';
const { ccclass, property } = _decorator;

let pos = v3();

@ccclass('Joystick')
export class Joystick extends Component {
    @property(Node)
    dot!: Node;

    @property(Node)
    ring!: Node;

    @property(UIOpacity)
    uiOpacity!: UIOpacity;

    @property(CCInteger)
    radius: number = 5;

    onLoad() {
        this.node.on(SystemEventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(SystemEventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(SystemEventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(SystemEventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onTouchStart(event: EventTouch) {
        event.getLocation(pos as unknown as Vec2);
        pos.z = 0;

        this.ring.setPosition(pos);
        this.dot.setPosition(0, 0, 0);

        this.uiOpacity.opacity = 255;
    }

    onTouchMove(event: EventTouch) {
        event.getUILocation(pos as unknown as Vec2);
        pos.z = 0;

        Vec3.subtract(pos, pos, this.ring.position);
        let distance = pos.length();

        if(this.radius > distance) {
            this.dot.setPosition(pos);
            Global.uiEvent.emit(UI_EVENT.PLAYER_MOVE, pos.multiplyScalar(1 / distance));
        }
        else {
            pos.multiplyScalar(1 / distance);
            Global.uiEvent.emit(UI_EVENT.PLAYER_MOVE, pos);
            this.dot.setPosition(pos.multiplyScalar(this.radius));
        }

    }

    onTouchEnd(event: EventTouch) {
        this.dot.setPosition(Vec3.ZERO);
        this.uiOpacity.opacity = 0;
        Global.uiEvent.emit(UI_EVENT.PLAYER_STOP_MOVE);
    }
}