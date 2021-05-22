import { v3, Vec3, Animation, AnimationState, Contact2DType, PhysicsSystem2D, Collider2D, IPhysics2DContact } from "cc";
import { EntityLink } from "../../../CC/EntityLink";
import { ecs } from "../../../Libs/ECS";
import { Util } from "../../../Util";
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
            explode.setPosition(0, Util.randomRange(14, 20), 0);
            
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