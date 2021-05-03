import { v3 } from "cc";
import { ecs } from "../../../Libs/ECS";
import { CameraFollowComponent } from "../../Components/CameraFOllowComponent";
import { Transform } from "../../Components/Transform";
import { PlayerEnt } from "../EntityFactory";

let tmp = {
    output: 0,
    velocity: 0
};

let pos = v3();

export class CameraFollow extends ecs.ComblockSystem {
    
    filter(): ecs.IMatcher {
        return ecs.allOf(CameraFollowComponent, Transform);
    }

    update(entities: PlayerEnt[]): void {
        let transform = entities[0].Transform;
        let cameraComp = entities[0].CameraFollow;
        this.smoothDamp(cameraComp.camera!.position.x, transform.position.x, cameraComp.xVelocity, cameraComp.smoothTime);
        pos.x = tmp.output;
        cameraComp.xVelocity = tmp.velocity;

        this.smoothDamp(cameraComp.camera!.position.y, transform.position.y, cameraComp.yVelocity, cameraComp.smoothTime);
        pos.y = tmp.output;
        cameraComp.yVelocity = tmp.velocity;

        pos.z = 1000;

        cameraComp.camera!.setPosition(pos);
    }

    /**
     * 
     * @param current 当前坐标点（相机）
     * @param target 目标点（跟随者）
     * @param currentVelocity 移动速度
     * @param smoothTime Approximately the time it will take to reach the target. A smaller value will reach the target faster.
     * @returns 
     */
    smoothDamp(current: number, target: number, currentVelocity: number, smoothTime: number) {
        smoothTime = Math.max(0.0001, smoothTime);

        let maxSpeed = Number.MAX_VALUE;
        let omega = 2 / smoothTime;
        let deltaTime = this.dt;
        let x = omega * deltaTime;
        let exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
        let change = current - target;
        let originalTo = target;

        // Clamp maximum speed
        let maxChange = maxSpeed * smoothTime;
        change = this.clamp(change, -maxChange, maxChange);
        target = current - change;

        let temp = (currentVelocity + omega * change) * deltaTime;
        currentVelocity = (currentVelocity - omega * temp) * exp;
        let output = target + (change + temp) * exp;

        // Prevent overshooting
        if (originalTo - current > 0.0 == output > originalTo) {
            output = originalTo;
            currentVelocity = (output - originalTo) / deltaTime;
        }

        tmp.output = output;
        tmp.velocity = currentVelocity;
        return tmp;
    }

    clamp(value: number, min: number, max: number) {
        if (value < min) {
            value = min;
        }
        else if (value > max) {
            value = max;
        }
        return value;
    }
}