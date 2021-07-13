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
                    case AI_STATE.NONE: {
                        this.switchTo(e, AI_STATE.IDLE);
                        break;
                    }
                    case AI_STATE.TAKE_HIT: {
                        this.switchTo(e, AI_STATE.TAKE_HITING);
                        break;
                    }
                    case AI_STATE.TAKE_HIT_OVER: {
                        this.switchTo(e, AI_STATE.MOVE_TO);
                        break;
                    }
                    case AI_STATE.IDLE: {
                        if(Math.random() < -0.3) {
                            // 防止怪物都聚集到一起
                            e.AI.offset.x = Util.randomRange(-20, 20);
                            e.AI.offset.y = Util.randomRange(-20, 20);
                            this.switchTo(e, AI_STATE.FOLLOW);
                        }
                        else {
                            e.AI.offset.x = Util.randomRange(-100, 100);
                            e.AI.offset.y = Util.randomRange(-100, 100);
                            e.AI.offset.z = 0;
                            this.switchTo(e, AI_STATE.MOVE_TO);
                        }
                        break;
                    }
                    case AI_STATE.MOVE_TO: {    // 移动到指定坐标点然后进行下一步
                        Vec3.add(e.AI.targetPos, playerPos, e.AI.offset);
                        Vec3.subtract(pos, e.AI.targetPos, e.Transform.position);
                        Vec3.normalize(e.get(Movement).heading, pos);
                        e.Transform.position.add(Vec3.multiplyScalar(pos, e.Movement.heading, this.dt * e.Movement.speed));

                        if(Vec3.subtract(pos, e.AI.targetPos, e.Transform.position).lengthSqr() <= 10000) {
                            if(Math.random() < 0.5) {
                                this.switchTo(e, AI_STATE.FOLLOW);
                            }
                            else {
                                this.switchTo(e, AI_STATE.WAIT);
                                e.AI.waitTime = Util.randomRange(0.5, 1);
                            }
                        }

                        break;
                    }
                    case AI_STATE.FOLLOW: {     // 一直跟踪角色
                        Vec3.add(pos, e.AI.offset, playerPos);
                        Vec3.subtract(pos, pos, e.Transform.position);
                        Vec3.normalize(e.get(Movement).heading, pos);
                        e.Transform.position.add(Vec3.multiplyScalar(pos, e.Movement.heading, this.dt * e.Movement.speed));

                        if(Vec3.subtract(pos, e.AI.targetPos, e.Transform.position).lengthSqr() <= 100) {
                            this.switchTo(e, AI_STATE.IDLE);
                        }
                        break;
                    }
                    case AI_STATE.WAIT: {
                        e.AI.waitTime -= this.dt;
                        if(e.AI.waitTime <= 0) {
                            this.switchTo(e, AI_STATE.IDLE);
                        }
                        continue;
                    }
                }
                
                // 不改变身体的缩放比
                e.EnemyNode.body!.getScale(scale);
                scale.x = (e.Movement.heading.x > 0 ? 1 : -1) * Math.abs(scale.x);
                e.EnemyNode.body!.setScale(scale);
            }
        }
    }

    switchTo(ent: MonsterEnt, targetState: AI_STATE) {
        if(targetState === AI_STATE.IDLE || targetState === AI_STATE.WAIT) {
            ent.EnemyNode.animation!.play('Idle');
        }
        else if(targetState === AI_STATE.ATTACK) {
            ent.EnemyNode.animation!.play('Attack');
        }
        else if(targetState === AI_STATE.FOLLOW || targetState === AI_STATE.MOVE_TO) {
            ent.EnemyNode.animation!.play('Move');
        }
        else if(targetState === AI_STATE.TAKE_HITING) {
            ent.EnemyNode.animation!.play('Take Hit');
        }
        ent.AI.aiState = targetState;
    }
}