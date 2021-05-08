
import { ecs } from '../../../Libs/ECS';
import { Movement } from '../../Components/Movement';
import { Transform } from '../../Components/Transform';
import { PlayerNode } from '../../Components/PlayerNode';
import { PlayerEnt } from '../EntityFactory';



export class PlayerMoveSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    player!: PlayerEnt;
    movement!: Movement;
    init() {
        
    }

    filter(): ecs.IMatcher {
        return ecs.allOf(PlayerNode, Movement, Transform);
    }

    entityEnter(entities: PlayerEnt[]): void {
        this.player = entities[0];
        this.movement = entities[0].get(Movement);
    }

    update(entities: PlayerEnt[]): void {
        this.player.Transform.position.x += this.movement.heading.x * this.dt * this.movement.speed;
        this.player.Transform.position.y += this.movement.heading.y * this.dt * this.movement.speed;
    }
    
}