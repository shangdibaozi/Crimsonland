
import { ecs } from '../../../Libs/ECS';
import { Movement } from '../../Components/Movement';
import { Transform } from '../../Components/Transform';
import { PlayerNode } from '../../Components/PlayerNode';
import { PlayerEnt } from '../EntityFactory';
import { Global } from '../../../Global';
import { UI_EVENT } from '../../../Constants';
import { clamp, v3, Vec3 } from 'cc';

let tmpV3 = v3();
let length = 0;

export class PlayerMoveSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    player!: PlayerEnt;
    movement!: Movement;

    isAcccelerate: boolean = false;
    isDecelerate: boolean = false;

    init() {
        Global.uiEvent.on(UI_EVENT.PLAYER_MOVE, this.onPlayerMove, this);
        Global.uiEvent.on(UI_EVENT.PLAYER_STOP_MOVE, this.onPlayerStopMove, this);
    }

    onDestroy() {
        Global.uiEvent.targetOff(this);
    }

    filter(): ecs.IMatcher {
        return ecs.allOf(PlayerNode, Movement, Transform);
    }

    entityEnter(entities: PlayerEnt[]): void {
        this.player = entities[0];
        this.movement = entities[0].get(Movement);
    }

    update(entities: PlayerEnt[]): void {
        Vec3.add(tmpV3, this.movement.velocity, Vec3.multiplyScalar(tmpV3, this.movement.acceleration, this.dt));
        length = Vec3.len(tmpV3);
        if(length > this.movement.maxSpeed) {
            Vec3.multiplyScalar(this.movement.velocity, tmpV3, 1 / length * this.movement.maxSpeed);
        }
        else {
            if(this.isDecelerate && length <= 1) {
                this.movement.velocity.set(Vec3.ZERO);
                this.movement.acceleration.set(Vec3.ZERO);
            }
            else {
                this.movement.velocity.set(tmpV3);
            }
        }
        this.player.Transform.position.x += this.movement.velocity.x * this.dt;
        this.player.Transform.position.y += this.movement.velocity.y * this.dt;
    }
    
    /**
     * @param heading 可以看做控制玩家运动合力的方向
     */
    onPlayerMove(heading: Vec3) {
        Vec3.multiplyScalar(this.player.Movement.acceleration, heading, this.player.Movement.maxSpeed);
        this.isAcccelerate = true;
        this.isDecelerate = false;
    }

    onPlayerStopMove() {
        // this.player.Movement.speed = 0;
        length = Vec3.len(this.movement.velocity);
        Vec3.multiplyScalar(this.movement.acceleration, this.movement.velocity, -1 / length * this.movement.maxSpeed);
        this.isAcccelerate = false;
        this.isDecelerate = true;
    }
}