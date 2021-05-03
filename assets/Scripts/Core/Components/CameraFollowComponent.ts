import { Node } from "cc";
import { ecs } from "../../Libs/ECS";

@ecs.register('CameraFollow')
export class CameraFollowComponent extends ecs.IComponent {
    camera: Node | null = null;

    smoothTime = 2.2;
    xVelocity: number = 0;
    yVelocity: number = 0;

    reset() {
        this.camera = null;
        this.smoothTime = 0.2;
        this.xVelocity = 0;
        this.yVelocity = 0;
    }

    
}