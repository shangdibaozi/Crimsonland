
import { _decorator, Component, Node, lerp, systemEvent, SystemEventType, EventTouch, Event, v3, Vec3, macro } from 'cc';
const { ccclass, property } = _decorator;

let heading = v3();

@ccclass('Typescript')
export class Typescript extends Component {
    @property(Node)
    touch!: Node;


    targetAngle: number = 0;

    start () {
        // @ts-ignore
        systemEvent.on(SystemEventType.TOUCH_START, this.touchStart, this);
    }

    touchStart(event: EventTouch) {
        let loc = event.getUILocation();
        this.touch.setWorldPosition(loc.x, loc.y, 0);

        heading.set(this.touch.position);
        heading.normalize();
        
        // heading.x = 0;
        // heading.y = 1;

        let rad = this.node.angle * macro.RAD;
        let heading1 = v3(Math.cos(rad), Math.sin(rad), 0);
        
        let deltaAngle = Math.acos(heading1.dot(heading)) * macro.DEG;

        heading1.cross(heading);

        deltaAngle *= heading1.z > 0 ? 1 : -1;


        this.targetAngle = this.node.angle + deltaAngle;
    }

    update (deltaTime: number) {
        this.node.angle = lerp(this.node.angle, this.targetAngle, deltaTime);
    }
}
