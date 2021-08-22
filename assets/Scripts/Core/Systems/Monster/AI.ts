import { log, v3, Vec3 } from "cc";
import { AI_STATE } from "../../../Constants";
import { ecs } from "../../../Libs/ECS";
import { Util } from "../../../Util";
import { AIComponent } from "../../Components/AIComponent";
import { ECSNode } from "../../Components/ECSNode";
import { ECSTag } from "../../Components/ECSTag";
import { EnemyNode } from "../../Components/EnemyNode";
import { Movement } from "../../Components/Movement";
import { PlayerNode } from "../../Components/PlayerNode";
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
        return ecs.allOf(ECSTag.Enemy, Transform, AIComponent, ECSNode);
    }

    update(entities: MonsterEnt[]): void {
        if(this.playerGroup.count > 0) {
            let playerEnt = this.playerGroup.entity;

            let playerPos = playerEnt.get(Transform).position;

            for(let e of entities) {
                this.attackCheck(e, playerPos);
                if(e.AI.curState != e.AI.targetState) {
                    this.switchTo(e, e.AI.targetState);
                }
                else {
                    switch(e.AI.curState) {
                        case AI_STATE.NONE: {
                            e.AI.targetState = AI_STATE.IDLE;
                            break;
                        }
                        case AI_STATE.TAKE_HIT: {
                            e.AI.targetState = AI_STATE.TAKE_HITING;
                            break;
                        }
                        case AI_STATE.TAKE_HIT_OVER: {
                            e.AI.targetState =  AI_STATE.FOLLOW;
                            break;
                        }
                        case AI_STATE.IDLE: {
                            e.AI.targetState = AI_STATE.FOLLOW;
                            break;
                        }
                        case AI_STATE.FOLLOW: {     // 一直跟踪角色
                            Vec3.add(pos, e.AI.offset, playerPos);
                            Vec3.subtract(pos, pos, e.Transform.position);
                            Vec3.normalize(e.get(Movement).heading, pos);
                            e.Transform.position.add(Vec3.multiplyScalar(pos, e.Movement.heading, this.dt * e.Movement.speed));
                            break;
                        }
                        case AI_STATE.WAIT: {
                            e.AI.waitTime -= this.dt;
                            if(e.AI.waitTime <= 0) {
                               e.AI.targetState = AI_STATE.IDLE;
                            }
                            continue;
                        }
                        case AI_STATE.ATTACK: {
                            e.AI.targetState = AI_STATE.ATTACK_ING;
                            break;
                        }
                        case AI_STATE.ATTACK_OVER: {
                            e.AI.targetState = AI_STATE.WAIT;
                            e.AI.waitTime = 0.5;
                            break;
                        }
                    }
                }
                
                // 不改变身体的缩放比
                e.EnemyNode.body!.getScale(scale);
                scale.x = (e.Movement.heading.x > 0 ? 1 : -1) * Math.abs(scale.x);
                e.EnemyNode.body!.setScale(scale);
            }
        }
    }

    attackCheck(ent: MonsterEnt, playerPos: Vec3) {
        if(ent.AI.curState === AI_STATE.ATTACK || ent.AI.curState === AI_STATE.ATTACK_ING) {
            return;
        }
        let dist = Vec3.distance(ent.Transform.position, playerPos);
        if(dist <= 30) {
            ent.AI.targetState = AI_STATE.ATTACK;
        }
    }

    switchTo(ent: MonsterEnt, targetState: AI_STATE) {
        if(targetState === AI_STATE.IDLE || targetState === AI_STATE.WAIT) {
            ent.EnemyNode.animation!.play('Idle');
        }
        else if(targetState === AI_STATE.ATTACK) {
            ent.EnemyNode.animation!.play('Attack');
        }
        else if(targetState === AI_STATE.FOLLOW) {
            ent.EnemyNode.animation!.play('Move');
        }
        else if(targetState === AI_STATE.TAKE_HIT && ent.AI.curState !== AI_STATE.TAKE_HITING) {
            ent.EnemyNode.animation!.play('Take Hit');
        }
        ent.AI.curState = targetState;
    }
}