import { v3, Vec3, Animation, AnimationState } from "cc";
import { ecs } from "../../../Libs/ECS";
import { AvatarProperties } from "../../Components/AvatarProperties";
import { BulletNode } from "../../Components/BulletNode";
import { Collision } from "../../Components/Collision";
import { MonsterDead } from "../../Components/MonsterDead";
import { Movement } from "../../Components/Movement";
import { TagEnemy } from "../../Components/Tag/TagEnemy";
import { Transform } from "../../Components/Transform";
import { ObjPool } from "../../ObjPool";
import { BulletEnt, MonsterEnt } from "../EntityFactory";



let tmp = v3();

export class CollisionSystem extends ecs.ComblockSystem {
    bulletGroup!: ecs.Group<BulletEnt>;

    hitedEnemies: number[] = [];

    init() {
        this.bulletGroup = ecs.createGroup(ecs.allOf(Transform, Collision, BulletNode));
    }
    
    filter(): ecs.IMatcher {
        return ecs.allOf(Transform, Collision, TagEnemy);
    }

    update(entities: MonsterEnt[]): void {
        let bulletEnties = this.bulletGroup.matchEntities;
        for(let i = 0, len = bulletEnties.length; i < len; i++) {
            let bulletEnt = bulletEnties[i];
            for(let j = entities.length - 1; j >= 0; j--) {
                let enemyEnt = entities[j];
                let collisionMaxDist = (bulletEnt.Collision.radius + enemyEnt.Collision.radius);
                // 求圆心距离
                Vec3.subtract(tmp, bulletEnt.Transform.position, enemyEnt.Transform.position);

                if(Math.abs(tmp.x) > collisionMaxDist || Math.abs(tmp.y) > collisionMaxDist) {
                    continue;
                }
                else {
                    this.hitedEnemies.push(j);
                }
            }

            // 一般来说，在先攻击范围内显示在最上层的敌人应该是最先被攻击到的。
            if(this.hitedEnemies.length > 0) {
                let selIdx = 0;

                this.hitedEnemies.forEach(idx => {
                    if(entities[idx].ECSNode.val!.getSiblingIndex() > entities[selIdx].ECSNode.val!.getSiblingIndex()) {
                        selIdx = idx;
                    }
                });

                let enemyEnt: MonsterEnt = entities[selIdx];
                let damage = bulletEnt.BulletBase.damage;
                let avatarProperties = enemyEnt.AvatarProperties;
                avatarProperties.health =  Math.max(0, avatarProperties.health - damage);
                enemyEnt.EnemyNode.hpBar!.progress = avatarProperties.health / avatarProperties.maxHealth;

                let explode = enemyEnt.ECSNode.val!.getChildByName('Explode');
                if(!explode) {
                    explode = ObjPool.getNode('Explode');
                    explode.parent = enemyEnt.ECSNode.val;
                    explode.getComponent(Animation)!.on(Animation.EventType.FINISHED, (state: Animation.EventType, clip: AnimationState) => {
                        clip['_targetNode']!.active = false;
                    }, explode);
                }
                else {
                    explode.getComponent(Animation)!.play();
                    explode.active = true;
                }
                Vec3.subtract(tmp, bulletEnt.Transform.position, enemyEnt.Transform.position);
                explode.setPosition(tmp);
                
                if(avatarProperties.health <= 0) {
                    let monsterDeadComp = ecs.createEntityWithComp(MonsterDead);
                    Vec3.copy(monsterDeadComp.pos, enemyEnt.Transform.position)
                    enemyEnt.destroy();
                    entities.splice(selIdx, 1);
                }
                else {
                    // 子弹打中怪物后怪物击退效果
                    Vec3.multiplyScalar(tmp, bulletEnt.get(Movement).heading, 5);
                    enemyEnt.Transform.position.add(tmp);
                }
                bulletEnt.destroy();
                this.hitedEnemies.length = 0;
            }
        }
    }
}