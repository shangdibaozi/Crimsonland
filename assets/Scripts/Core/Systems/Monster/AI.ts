import { log, v3, Vec3 } from "cc";
import { AI_STATE } from "../../../Constants";
import { ecs } from "../../../Libs/ECS";
import { Util } from "../../../Util";
import { AIComponent } from "../../Components/AIComponent";
import { Collision } from "../../Components/Collision";
import { ECSNode } from "../../Components/ECSNode";
import { EnemyNode } from "../../Components/EnemyNode";
import { Movement } from "../../Components/Movement";
import { PlayerNode } from "../../Components/PlayerNode";
import { TagEnemy } from "../../Components/Tag/TagEnemy";
import { Transform } from "../../Components/Transform";
import { MonsterEnt } from "../EntityFactory";

let pos = v3();
let scale = v3();

export class AI extends ecs.ComblockSystem {

    playerGroup!: ecs.Group;

    init() {
        this.playerGroup = ecs.createGroup(ecs.allOf(PlayerNode, Movement, Transform));
    }
    
    filter(): ecs.IMatcher {
        return ecs.allOf(TagEnemy, Transform, Collision, AIComponent, ECSNode);
    }

    update(entities: MonsterEnt[]): void {
        if(this.playerGroup.count > 0) {
            let playerEnt = this.playerGroup.entity;

            let playerPos = playerEnt.get(Transform).position;

            for(let e of entities) {
                switch(e.AI.aiState) {
                    case AI_STATE.IDLE: {
                        if(Math.random() < -0.3) {
                            // 防止怪物都聚集到一起
                            e.AI.offset.x = Util.randomRange(-20, 20);
                            e.AI.offset.y = Util.randomRange(-20, 20);
                            e.AI.aiState = AI_STATE.FOLLOW;
                        }
                        else {
                            e.AI.offset.x = Util.randomRange(-100, 100);
                            e.AI.offset.y = Util.randomRange(-100, 100);
                            e.AI.offset.z = 0;
                            // pos.x = Util.randomRange(-100, 100);
                            // pos.y = Util.randomRange(-100, 100);
                            // pos.z = 0;
                            
                            // Vec3.add(e.AI.targetPos, pos, playerPos);
                            
                            e.AI.aiState = AI_STATE.MOVE_TO;
                        }
                        break;
                    }
                    case AI_STATE.MOVE_TO: {    // 移动到指定坐标点然后进行下一步
                        Vec3.add(e.AI.targetPos, playerPos, e.AI.offset);
                        Vec3.subtract(pos, e.AI.targetPos, e.Transform.position);
                        Vec3.normalize(e.get(Movement).heading, pos);
                        e.Transform.position.add(Vec3.multiplyScalar(pos, e.Movement.heading, this.dt * e.Movement.speed));

                        if(Vec3.subtract(pos, e.AI.targetPos, e.Transform.position).lengthSqr() <= 10000) {
                            e.AI.aiState = AI_STATE.FOLLOW;
                        }

                        break;
                    }
                    case AI_STATE.FOLLOW: {     // 一直跟踪角色
                        Vec3.add(pos, e.AI.offset, playerPos);
                        Vec3.subtract(pos, pos, e.Transform.position);
                        Vec3.normalize(e.get(Movement).heading, pos);
                        e.Transform.position.add(Vec3.multiplyScalar(pos, e.Movement.heading, this.dt * e.Movement.speed));

                        if(Vec3.subtract(pos, e.AI.targetPos, e.Transform.position).lengthSqr() <= 100) {
                            e.AI.aiState = AI_STATE.IDLE;
                        }
                        break;
                    }
                }
                
                // 不改变身体的缩放比
                e.EnemyNode.body!.getScale(scale);
                scale.x = (e.Movement.heading.x > 0 ? 1 : -1) * Math.abs(scale.x);
                e.EnemyNode.body!.setScale(scale);
            }
        }
    }
}