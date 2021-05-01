import { v3, Vec3 } from "cc";
import { AI_STATE } from "../../../Constants";
import { ecs } from "../../../Libs/ECS";
import { AIComponent } from "../../Components/AIComponent";
import { Collision } from "../../Components/Collision";
import { Movement } from "../../Components/Movement";
import { PlayerNode } from "../../Components/PlayerNode";
import { TagEnemy } from "../../Components/TagEnemy";
import { Transform } from "../../Components/Transform";

let pos = v3();

class MonsterEnt extends ecs.Entity {
    AI!: AIComponent;
    Movement!: Movement;
}

export class AI extends ecs.ComblockSystem {

    playerGroup!: ecs.Group;

    init() {
        this.playerGroup = ecs.createGroup(ecs.allOf(PlayerNode, Movement, Transform));
    }
    
    filter(): ecs.IMatcher {
        return ecs.allOf(TagEnemy, Transform, Collision, AIComponent);
    }

    update(entities: MonsterEnt[]): void {
        if(this.playerGroup.count > 0) {
            let playerEnt = this.playerGroup.entity;

            let playerPos = playerEnt.get(Transform).position;

            for(let e of entities) {
                switch(e.AI.aiState) {
                    case AI_STATE.IDLE: {
                        Vec3.copy(e.AI.targetPos, playerPos);
                        Vec3.subtract(pos, e.AI.targetPos, e.get(Transform).position);
                        Vec3.normalize(e.get(Movement).heading, pos);
                        e.AI.aiState = AI_STATE.MOVE_TO;
                        break;
                    }
                    case AI_STATE.MOVE_TO: {
                        e.get(Transform).position.add(Vec3.multiplyScalar(pos, e.Movement.heading, this.dt * e.Movement.speed));
                        break;
                    }
                }
                
            }
        }
    }
}