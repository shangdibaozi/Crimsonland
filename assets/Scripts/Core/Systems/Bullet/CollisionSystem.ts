import { v3, Vec3, Animation, AnimationState, Contact2DType, PhysicsSystem2D, Collider2D, IPhysics2DContact } from "cc";
import { EntityLink } from "../../../CC/EntityLink";
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

        // 注册全局碰撞回调函数
        if (PhysicsSystem2D.instance) {
            PhysicsSystem2D.instance.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            PhysicsSystem2D.instance.on(Contact2DType.END_CONTACT, this.onEndContact, this);
            PhysicsSystem2D.instance.on(Contact2DType.PRE_SOLVE, this.onPreSolve, this);
            PhysicsSystem2D.instance.on(Contact2DType.POST_SOLVE, this.onPostSolve, this);
        }
    }
    
    filter(): ecs.IMatcher {
        return ecs.allOf(Transform, Collision, TagEnemy);
    }

    update(entities: MonsterEnt[]): void {
        return;
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

    onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 只在两个碰撞体开始接触时被调用一次
        console.log('onBeginContact');
        

        let selfEnt = selfCollider.getComponent(EntityLink)!.getEnt();
        let otherEnt = otherCollider.getComponent(EntityLink)!.getEnt();
        if(selfEnt && otherEnt) {
            let bulletEnt: BulletEnt;
            let monsterEnt: MonsterEnt;
            if(selfEnt.has(TagEnemy)) {
                monsterEnt = selfEnt as MonsterEnt;
                bulletEnt = otherEnt as BulletEnt;
            }
            else {
                monsterEnt = otherEnt as MonsterEnt;
                bulletEnt = selfEnt as BulletEnt;
            }

            let damage = bulletEnt.BulletBase.damage;
            let avatarProperties = monsterEnt.AvatarProperties;
            avatarProperties.health =  Math.max(0, avatarProperties.health - damage);
            monsterEnt.EnemyNode.hpBar!.progress = avatarProperties.health / avatarProperties.maxHealth;

            let explode = monsterEnt.ECSNode.val!.getChildByName('Explode');
            if(!explode) {
                explode = ObjPool.getNode('Explode');
                explode.parent = monsterEnt.ECSNode.val;
                explode.getComponent(Animation)!.on(Animation.EventType.FINISHED, (state: Animation.EventType, clip: AnimationState) => {
                    clip['_targetNode']!.active = false;
                }, explode);
            }
            else {
                explode.getComponent(Animation)!.play();
                explode.active = true;
            }
            Vec3.subtract(tmp, bulletEnt.Transform.position, monsterEnt.Transform.position);
            explode.setPosition(tmp);
            
            if(avatarProperties.health <= 0) {
                let monsterDeadComp = ecs.createEntityWithComp(MonsterDead);
                Vec3.copy(monsterDeadComp.pos, monsterEnt.Transform.position)
                monsterEnt.destroy();
            }
            else {
                // 子弹打中怪物后怪物击退效果
                Vec3.multiplyScalar(tmp, bulletEnt.get(Movement).heading, 5);
                monsterEnt.Transform.position.add(tmp);
            }
            bulletEnt.destroy();
        }
        
    }
    onEndContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 只在两个碰撞体结束接触时被调用一次
        console.log('onEndContact');
    }
    onPreSolve (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 每次将要处理碰撞体接触逻辑时被调用
        console.log('onPreSolve');
    }
    onPostSolve (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 每次处理完碰撞体接触逻辑时被调用
        console.log('onPostSolve');
    }
}