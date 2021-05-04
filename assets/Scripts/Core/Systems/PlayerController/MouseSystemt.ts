import { Node, EventMouse, v3, Vec2, Vec3, macro, v2, instantiate, UITransform, systemEvent, SystemEventType } from "cc";
import { UI_EVENT } from "../../../Constants";
import { Global } from "../../../Global";
import { ecs } from "../../../Libs/ECS";
import { Mouse } from "../../Components/Mouse";
import { PlayerNode } from "../../Components/PlayerNode";
import { Transform } from "../../Components/Transform";

let touchPos = v2();
let lpos = v3();
let gunWorldPos = v3();

export class MouseSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    transform!: Transform;
    mouse!: Mouse;
    playerNode!: PlayerNode;

    init() {
        
    }

    filter(): ecs.IMatcher {
        return ecs.allOf(Mouse, PlayerNode);
    }

    entityEnter(entities: ecs.Entity[]) {
        this.transform = entities[0].get(Transform);
        this.mouse = entities[0].get(Mouse);
        this.playerNode = entities[0].get(PlayerNode);

        // TODO: 没有解绑事件
        systemEvent.on(SystemEventType.MOUSE_MOVE, this.onMouseMove, this);
        systemEvent.on(SystemEventType.MOUSE_DOWN, this.onMouseDown, this);
    }

    update(entities: ecs.Entity[]): void {
        
        Vec3.add(gunWorldPos, this.transform.position, this.playerNode.gunNode!.position);
        Vec3.subtract(lpos, this.mouse.pos, gunWorldPos);
        Vec3.normalize(this.mouse.heading, lpos);

        let angle = Math.atan2(this.mouse.heading.y, this.mouse.heading.x) * macro.DEG;

        if(this.mouse.heading.x < 0) {
            this.playerNode.bodyNode!.setScale(-1, 1, 1);
            this.playerNode.gunNode!.setScale(1, -1, 1);
        }
        else if(this.mouse.heading.x > 0) {
            this.playerNode.bodyNode!.setScale(1, 1, 1);
            this.playerNode.gunNode!.setScale(1, 1, 1);
        }
        this.playerNode.gunNode!.angle = angle;
    }
    
    onMouseMove(event: EventMouse) {
        event.getLocation(touchPos);
        lpos.x = touchPos.x;
        lpos.y = touchPos.y;
        lpos.z = 0;
        Global.gameWorld.camera.screenToWorld(lpos, lpos);
        Global.gameWorld.camera.convertToUINode(lpos, Global.gameWorld.avatarLayer, this.mouse.pos);
    }

    onMouseDown(event: EventMouse) {
        let gunNode = this.playerNode.gunNode!.children[0];
        gunNode.setPosition(-4, 0, 0);

        let gunPointNode = gunNode.children[0];

        gunPointNode.getComponent(UITransform)?.convertToWorldSpaceAR(Vec3.ZERO, lpos);
        let bulletPos = Global.gameWorld.avatarLayer.getComponent(UITransform)!.convertToNodeSpaceAR(lpos, lpos);
        Global.uiEvent.emit(UI_EVENT.CREATE_BULLET, this.mouse.heading, bulletPos);
    }
}