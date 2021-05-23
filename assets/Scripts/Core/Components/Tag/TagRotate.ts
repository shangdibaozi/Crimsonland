import { ecs } from "../../../Libs/ECS";

@ecs.register('TagRotate')
export class TagRotate extends ecs.IComponent {

    speed: number = 300;

    reset() {
        this.speed = 300;
    }
}