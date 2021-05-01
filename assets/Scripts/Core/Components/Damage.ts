import { ecs } from "../../Libs/ECS";

@ecs.register('Damage')
export class Damage extends ecs.IComponent {

    val: number = 1;

    reset() {
        this.val = 1;
    }
}