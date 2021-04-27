import { ecs } from "../../Libs/ECS";

@ecs.register('Collision')
export class Collision extends ecs.IComponent {
    radius: number = 0;

    reset() {
        this.radius = 0;
    }
}