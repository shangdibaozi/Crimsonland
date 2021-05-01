import { ecs } from "../../Libs/ECS";

@ecs.register('AvatarProperties')
export class AvatarProperties extends ecs.IComponent {
    maxHealth: number = 0;

    health: number = 0;

    reset() { 
        this.health = 0;
        this.maxHealth = 0;
    }
}