import { v3, Vec3, Animation, AnimationState, Contact2DType, PhysicsSystem2D, Collider2D, IPhysics2DContact, Node, assert, Vec2 } from "cc";
import { EntityLink } from "../../../CC/EntityLink";
import { AI_STATE, PhysicsGroup } from "../../../Constants";
import { Global } from "../../../Global";
import { ecs } from "../../../Libs/ECS";
import { Util } from "../../../Util";
import { MonsterDead } from "../../Components/MonsterDead";
import { Movement } from "../../Components/Movement";
import { TagEnemy } from "../../Components/Tag/TagEnemy";
import { TagPlayer } from "../../Components/Tag/TagPlayer";
import { Transform } from "../../Components/Transform";
import { BulletBase } from "../../Components/Weapon/BulletBase";
import { ObjPool } from "../../ObjPool";
import { BulletEnt, GunEnt, ItemEnt, MonsterEnt, PlayerEnt } from "../EntityFactory";

let tmp = v3();

let Enemy_Attack_Player = PhysicsGroup.Enemy_Attack | PhysicsGroup.Player_Body;
let Player_Attack_Enemy = PhysicsGroup.Player_Attack | PhysicsGroup.Enemy_Body;
let Player_Item = PhysicsGroup.Player_Body | PhysicsGroup.Ground_Item;

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

    // 只在两个碰撞体开始接触时被调用一次
    onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        let mask = selfCollider.group | otherCollider.group;
        switch(mask) {
            case Enemy_Attack_Player: {
                this.enemyAttackPlayer(selfCollider.node, otherCollider.node);
                break;
            }
            case Player_Attack_Enemy: {
                this.playerAttackEnemy(selfCollider.node, otherCollider.node);
                break;
            }
            case Player_Item: {
                this.playerPickUpGun(selfCollider.node, otherCollider.node);
                break;
            }
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

    playerAttackEnemy(colliderNodeA: Node, colliderNodeB: Node) {
        let entA = colliderNodeA.parent!.getComponent(EntityLink)!.getEnt()!;
        let entB = colliderNodeB.parent!.getComponent(EntityLink)!.getEnt()!;
        if(entA == null || entB == null) {
            debugger;
        }
        let bulletEnt: BulletEnt;
        let monsterEnt: MonsterEnt;
        if(entA.has(BulletBase)) {
            bulletEnt = entA as BulletEnt;
            monsterEnt = entB as MonsterEnt;
        }
        else {
            bulletEnt = entB as BulletEnt;
            monsterEnt = entA as MonsterEnt;
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

    enemyAttackPlayer(colliderNodeA: Node, colliderNodeB: Node) {
        let entA = colliderNodeA.parent!.getComponent(EntityLink)!.getEnt()!;
        let entB = colliderNodeB.parent!.getComponent(EntityLink)!.getEnt()!;
        if(entA == null || entB == null) {
            debugger;
        }
        let playerEnt: PlayerEnt;
        let monsterEnt: MonsterEnt;
        if(entA.has(TagPlayer)) {
            playerEnt = entA as PlayerEnt;
            monsterEnt = entB as MonsterEnt;
        }
        else {
            playerEnt = entB as PlayerEnt;
            monsterEnt = entA as MonsterEnt;
        }

        playerEnt.AvatarProperties.health -= monsterEnt.AvatarProperties.damage;
        if(playerEnt.AvatarProperties.health <= 0) {
            playerEnt.AvatarProperties.health = 0;
            console.log('player is dead');
        }
    }

    playerPickUpGun(colliderNodeA: Node, colliderNodeB: Node) {
        let entA = colliderNodeA.parent!.getComponent(EntityLink)!.getEnt()!;
        let entB = colliderNodeB.parent!.getComponent(EntityLink)!.getEnt()!;
        if(entA == null || entB == null) {
            debugger;
        }
        let playerEnt: PlayerEnt;
        let itemEnt: ItemEnt;
        if(entA.has(TagPlayer)) {
            playerEnt = entA as PlayerEnt;
            itemEnt = entB as ItemEnt;
        }
        else {
            playerEnt = entB as PlayerEnt;
            itemEnt = entA as ItemEnt;
        }
        let gunEnt = ecs.getEntityByEid<GunEnt>(playerEnt.AvatarProperties.weaponEid);
        // 更换武器
        gunEnt.GunNode.gunBase!.reset();
        // 枪节点回收
        ObjPool.putNode(gunEnt.GunNode.root!);
        let newGunNode = itemEnt.ECSNode.val!;
        itemEnt.ECSNode.val = null; // 实体销毁时会回收ECSNode组件中的节点，但是当前枪结点已经在使用，所以值为null不让回收
        newGunNode.setPosition(Vec3.ZERO);
        newGunNode.parent = playerEnt.PlayerNode.gunNode;
        gunEnt.GunNode.init(newGunNode, Global.gameWorld!.avatarLayer, Global.cfgMgr!.gunCfg[itemEnt.TagItem.tableId]);
    }
}