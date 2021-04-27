import { ecs } from "../../Libs/ECS";

@ecs.register('Lifetime')
export class Lifetime extends ecs.IComponent {
    time: number = 0;

    reset() {
        this.time = 0;    
    }
}