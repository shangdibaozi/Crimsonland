import { ecs } from "../../Libs/ECS";

@ecs.register('AvatarProperties')
export class AvatarProperties extends ecs.IComponent {
    damage: number = 0;

    maxHealth: number = 0;

    health: number = 0;

    weaponEid: number = -1;

    reset() { 
        this.damage = 0;
        this.health = 0;
        this.maxHealth = 0;
        this.weaponEid = -1;
    }
}