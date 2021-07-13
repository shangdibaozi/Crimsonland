import { v3, Vec3, Animation, AnimationState, Contact2DType, PhysicsSystem2D, Collider2D, IPhysics2DContact, Node, assert, Vec2 } from "cc";
import { EntityLink } from "../../../CC/EntityLink";
import { AI_STATE, PhysicsGroup } from "../../../Constants";
import { ecs } from "../../../Libs/ECS";
import { Util } from "../../../Util";
import { MonsterDead } from "../../Components/MonsterDead";
import { Movement } from "../../Components/Movement";
import { TagEnemy } from "../../Components/Tag/TagEnemy";
import { Transform } from "../../Components/Transform";
import { ObjPool } from "../../ObjPool";
import { BulletEnt, MonsterEnt, PlayerEnt } from "../EntityFactory";

let tmp = v3();

export class CollisionSystem extends ecs.ComblockSystem {

    hitedEnemies: number[] = [];

    init() {

        // 注册全局碰撞回调函数
        if (PhysicsSystem2D.instance) {
            PhysicsSystem2D.instance.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            PhysicsSystem2D.instance.on(Contact2DType.END_CONTACT, this.onEndContact, this);
            PhysicsSystem2D.instance.on(Contact2DType.PRE_SOLVE, this.onPreSolve, this);
            PhysicsSystem2D.instance.on(Contact2DType.POST_SOLVE, this.onPostSolve, this);
        }
    }
    
    filter(): ecs.IMatcher {
        return ecs.allOf(Transform, TagEnemy);
    }

    update(entities: MonsterEnt[]): void {
        
    }

    onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 只在两个碰撞体开始接触时被调用一次
        // console.log('onBeginContact');
        // let point = contact!.getWorldManifold().points[0];
        if(selfCollider.group == PhysicsGroup.Enemy_Attack) { // 怪物攻击玩家
            console.log('Enemy attack player');
            let enemyNode = selfCollider.node.parent!.parent;
            let playerNode = otherCollider.node.parent!.parent;
            this.enemyAttackPlayer(playerNode!, enemyNode!);
        }
        else if(otherCollider.group == PhysicsGroup.Player_Attack) { // 玩家攻击怪物
            console.log('Player attack enemy');
            let bulletNode = otherCollider.node;
            let enemyNode = selfCollider.node.parent!.parent!;
            this.playerAttackEnemy(bulletNode, enemyNode);
        }
    }

    playerAttackEnemy(bulletNode: Node, enemyNode: Node) {
        let bulletEnt = bulletNode.getComponent(EntityLink)!.getEnt()! as BulletEnt;
        let monsterEnt = enemyNode.getComponent(EntityLink)!.getEnt()! as MonsterEnt;
        // assert(bulletEnt != null, 'serlEnt is null');
        // assert(otherEnt != null, 'otherEnt is null');
        if(monsterEnt == null || bulletEnt == null) {
            return;
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
        explode.setPosition(0, Util.randomRange(14, 20), 0);
        
        if(avatarProperties.health <= 0) {
            let monsterDeadComp = ecs.createEntityWithComp(MonsterDead);
            Vec3.copy(monsterDeadComp.pos, monsterEnt.Transform.position);
            monsterEnt.destroy();
        }
        else {
            // 子弹打中怪物后怪物击退效果
            Vec3.multiplyScalar(tmp, bulletEnt.get(Movement).heading, 5);
            monsterEnt.Transform.position.add(tmp);
            monsterEnt.AI.aiState =  AI_STATE.TAKE_HIT;
        }
        bulletEnt.destroy();
    }

    enemyAttackPlayer(playerNode: Node, enemyNode: Node) {
        let selfEnt = playerNode.getComponent(EntityLink)!.getEnt()! as PlayerEnt;
        let otherEnt = enemyNode.getComponent(EntityLink)!.getEnt()! as MonsterEnt;
        selfEnt.AvatarProperties.health -= otherEnt.AvatarProperties.damage;
        if(selfEnt.AvatarProperties.health <= 0) {
            selfEnt.AvatarProperties.health = 0;
            console.log('player is dead');
        }
    }

    onEndContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 只在两个碰撞体结束接触时被调用一次
        // console.log('onEndContact');
    }

    onPreSolve (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 每次将要处理碰撞体接触逻辑时被调用
        // console.log('onPreSolve');
    }

    onPostSolve (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 每次处理完碰撞体接触逻辑时被调用
        // console.log('onPostSolve');
    }
}