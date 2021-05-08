
import { ecs } from '../../../Libs/ECS';
import { Movement } from '../../Components/Movement';
import { Transform } from '../../Components/Transform';
import { PlayerNode } from '../../Components/PlayerNode';
import { PlayerEnt } from '../EntityFactory';
import { Global } from '../../../Global';
import { UI_EVENT } from '../../../Constants';
import { Vec3 } from 'cc';



export class PlayerMoveSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    player!: PlayerEnt;
    movement!: Movement;


    init() {
        Global.uiEvent.on(UI_EVENT.PLAYER_MOVE, this.onPlayerMove, this);
        Global.uiEvent.on(UI_EVENT.PLAYER_STOP_MOVE, this.onPlayerStopMove, this);
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
    
    onPlayerMove(heading: Vec3) {
        Vec3.copy(this.player.Movement.heading, heading);
        this.player.Movement.speed = this.player.Movement.maxSeed;
    }

    onPlayerStopMove() {
        this.player.Movement.speed = 0;
    }
}