import { _decorator, Component, Node, SystemEventType, EventTouch, v3, Vec2, Vec3, UIOpacity, CCInteger } from 'cc';
import { UI_EVENT } from '../Constants';
import { Global } from '../Global';
const { ccclass, property } = _decorator;

let touchPos = v3();
let movePos = v3();
let tmpDelta = v3();

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

    isTouch = false;

    onLoad() {
        this.node.on(SystemEventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(SystemEventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(SystemEventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(SystemEventType.TOUCH_CANCEL, this.onTouchEnd, this);

        this.uiOpacity.opacity = 0;
    }

    onTouchStart(event: EventTouch) {
        event.getUILocation(touchPos as unknown as Vec2);
        touchPos.z = 0;

        this.ring.setWorldPosition(touchPos);
        this.dot.setPosition(Vec3.ZERO);

        this.uiOpacity.opacity = 255;
        this.isTouch = true;
    }

    onTouchMove(event: EventTouch) {
        event.getUILocation(movePos as unknown as Vec2);
        movePos.z = 0;

        Vec3.subtract(tmpDelta, movePos, touchPos);
        let distance = tmpDelta.length();
        
        if(distance === 0) {
            return;
        }

        if(this.radius > distance) {
            this.dot.setWorldPosition(movePos);
            Global.uiEvent.emit(UI_EVENT.PLAYER_MOVE, tmpDelta.multiplyScalar(1 / distance));
        }
        else {
            tmpDelta.multiplyScalar(1 / distance);
            Global.uiEvent.emit(UI_EVENT.PLAYER_MOVE, tmpDelta);
            tmpDelta.multiplyScalar(this.radius)
            this.dot.setPosition(tmpDelta);
        }

    }

    onTouchEnd(event: EventTouch) {
        this.dot.setPosition(Vec3.ZERO);
        this.uiOpacity.opacity = 0;
        Global.uiEvent.emit(UI_EVENT.PLAYER_STOP_MOVE);
    }
}