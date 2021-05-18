import { v3, Vec3 } from "cc";
import { ecs } from "../../Libs/ECS";

@ecs.register('Movement')
export class Movement extends ecs.IComponent {
    /**
     * 朝向
     */
    heading: Vec3 = v3(0, 0, 0);
    /**
     * 速度值
     */
    speed: number = 0;
    /**
     * 最大速度
     */
    private _maxSpeed: number = 0;
    get maxSpeed() {
        return this._maxSpeed;
    }

    set maxSpeed(val: number) {
        this._maxSpeed = val;
    }
    /**
     * 加速度
     */
    acceleration: Vec3 = v3(0, 0, 0);
    /**
     * 速度
     */
    velocity: Vec3 = v3(0, 0, 0);

    reset() {
        Vec3.zero(this.heading);
        this.speed = 0;
        this._maxSpeed = 0;
        Vec3.zero(this.acceleration);
        Vec3.zero(this.velocity);
    }
}