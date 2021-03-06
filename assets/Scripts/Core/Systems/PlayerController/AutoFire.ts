import { macro, v3, Vec3, log, Toggle, lerp } from "cc";
import { UI_EVENT } from "../../../Constants";
import { Global } from "../../../Global";
import { ecs } from "../../../Libs/ECS";
import { AutoFireComponent } from "../../Components/AutoFireComponent";
import { ECSTag } from "../../Components/ECSTag";
import { GunEnt, MonsterEnt, PlayerEnt } from "../EntityFactory";

let pos = v3();
let pos1 = v3();
let heading = v3();
let heading1 = v3();
let tmpDelta = v3();
let outV3 = v3();

const NEAR = 1 << 0;
const LESS_BLOOD = 1 << 1;
const NEAR_LESS_BLOOD = NEAR | LESS_BLOOD;

// 允许射击的角度误差，该值不能太小，否则会一直插值，导致射击间隔过长
const CAN_FIRE_ANGLE = 2;

export class AutoFire extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {

    monsterGroup!: ecs.Group<MonsterEnt>;

    playerEnt!: PlayerEnt;

    init() {
        this.monsterGroup = ecs.createGroup(ecs.allOf(ECSTag.Enemy));

        Global.uiEvent.on(UI_EVENT.SHOOT_NEAR, this.onShootNear, this);
        Global.uiEvent.on(UI_EVENT.SHOOT_LESS_BLOOD, this.onShootLessBlood, this);
        Global.uiEvent.on(UI_EVENT.SHOOT_CHANGE_TARGET, this.onShootChangeTarget, this);
    }

    onDestroy() {
        Global.uiEvent.targetOff(this);
    }

    filter(): ecs.IMatcher {
        return ecs.allOf(AutoFireComponent);
    }

    entityEnter(entities: PlayerEnt[]): void {
        this.playerEnt = entities[0];
        this.playerEnt.AutoFire.searchMonster = NEAR;
    }

    update(entities: PlayerEnt[]): void {
        let weid = this.playerEnt.AvatarProperties.weaponEid;
        let gunEnt = ecs.getEntityByEid<GunEnt>(weid);

        let monsterEnt = ecs.getEntityByEid<MonsterEnt>(this.playerEnt.AutoFire.monsterEid);
        if(monsterEnt) {
            let playerNode = this.playerEnt.PlayerNode;
            // 计算握枪点的坐标
            Vec3.add(pos, playerNode.root.position, playerNode.gunNode!.position);
            // 计算敌人身体中心点坐标
            Vec3.add(pos1, monsterEnt!.Transform.position, monsterEnt.EnemyNode.body!.position);
            Vec3.subtract(heading, pos1, pos);
            Vec3.normalize(heading, heading);
            
            if(heading.x < 0) {
                playerNode.bodyNode!.setScale(-1, 1, 1);
                playerNode.gunNode!.setScale(1, -1, 1);
            }
            else if(heading.x > 0) {
                playerNode.bodyNode!.setScale(1, 1, 1);
                playerNode.gunNode!.setScale(1, 1, 1);
            }
    
            // 对枪的朝向进行插值，确保每次都是按最小角度进行旋转
            let gunNode = this.playerEnt.PlayerNode!.gunNode;
            let gunNodeRad = gunNode!.angle * macro.RAD;
            heading1.set(Math.cos(gunNodeRad), Math.sin(gunNodeRad), 0);
            let val = Math.floor(heading1.dot(heading) * 10000) * 0.0001;
            // Math.acos(1.0000000000000002) = NaN
            let detalAngle = Math.acos(val) * macro.DEG;  // 当前枪朝向向量和要对准的怪物朝向向量间的夹角
            Vec3.cross(outV3, heading1, heading);
            detalAngle *= outV3.z > 0 ? 1 : -1;
            let angle = gunNode!.angle + detalAngle;
            // ..\3.1.0\resources\resources\3d\engine\cocos\core\math\utils.ts
            /**
             * export function lerp (from: number, to: number, ratio: number) {
            *      return from + (to - from) * ratio;
                * }
                */
            gunNode!.angle = lerp(gunNode!.angle, angle, this.dt * 20);
            
            if(Math.abs(gunNode!.angle - angle) <= CAN_FIRE_ANGLE) {
                gunEnt.GunNode.gunBase!.shootHeading.set(heading);
                gunEnt.GunNode.gunBase!.shoot();
            }
        }
        else {
            this.getMonster();
        }

        // if(gunBase.amount > 0 && autoFire.isShooted) {
        //     gunBase.curFT += this.dt * gunBase.rateOfFire;
        //     if(gunBase.curFT > 1) {
        //         gunBase.curFT -= 1;
        //         autoFire.isShooted = false;
        //     }
        // }
        // else {
        //     gunBase.curABT += this.dt;
        //     if(gunBase.curABT >= gunBase.timeOfAddBullet) {
        //         gunBase.curABT = 0;
        //         gunBase.amount = gunBase.maxAmount;
        //     }
        // }
    }

    

    // shoot(gunEnt: GunEnt, angle: number, heading: Vec3) {
    //     let gunBase = gunEnt.GunBase;
    //     // 后坐力
    //     let gunNode = gunBase.ent.get(GunNode);
    //     gunNode.root!.setPosition(gunBase.kickbackAmount, 0, 0);
        
    //     gunBase.amount -= 1;
    //     let bulletNode = ObjPool.getNode(gunBase.bulletName);
    //     bulletNode.active = true;
    //     bulletNode.parent = Global.gameWorld!.avatarLayer;

    //     let xDist = gunEnt.GunNode.gunPointUITransform!.node.position.x;
    //     let rad = angle * macro.RAD;
    //     pos.x += xDist * Math.cos(rad);
    //     pos.y += xDist * Math.sin(rad);
    //     bulletNode.setPosition(pos);
    //     bulletNode.angle = angle;
        
    //     let ent = EntityFactory.createBullet() as BulletEnt;
    //     Vec3.copy(ent.Movement.heading, heading);
    //     ent.Movement.speed = gunBase.speed;

    //     Vec3.copy(ent.Transform.position, pos);

    //     ent.Lifetime.time = 30;

    //     ent.Collision.radius = bulletNode.getComponent(UITransform)!.width * 0.5;

    //     ent.BulletBase.damage = gunBase.damage;
    // }

    getMonster() {
        if(this.monsterGroup.count === 0) {
            return;
        }
        let monsterEnt: MonsterEnt | null = null!;

        let autoFire = this.playerEnt.AutoFire;
        if(autoFire.isLock) {
            monsterEnt = ecs.getEntityByEid<MonsterEnt>(autoFire.monsterEid);
        }
        
        if(monsterEnt == null) {
            if(autoFire.searchMonster === NEAR) {
                monsterEnt = this.getNearestMonster(this.playerEnt.Transform.position);
            }
            else if(autoFire.searchMonster === LESS_BLOOD) {
                monsterEnt = this.getLessBloodMonster();
            }
            else if(autoFire.searchMonster === NEAR_LESS_BLOOD) {
                monsterEnt = this.getNearLessBloodMonster(this.playerEnt.Transform.position);
            }
        }
        
        if(monsterEnt == null) {
            autoFire.monsterEid = -1;
            return;
        }

        autoFire.monsterEid = monsterEnt.eid;
    }

    getNearestMonster(playerPos: Vec3) {
        let monsterEnts = this.monsterGroup.matchEntities;
        let minDistance = Number.MAX_SAFE_INTEGER;
        let tmpDist = 0;
        let monsterEnt: MonsterEnt | null = null!;
        for(let i = 0; i < this.monsterGroup.count; i++) {
            Vec3.subtract(tmpDelta, monsterEnts[i].Transform.position, playerPos);
            tmpDist = Math.abs(tmpDelta.x) + Math.abs(tmpDelta.y);
            if(tmpDist < minDistance) {
                minDistance = tmpDist;
                monsterEnt = monsterEnts[i];
            }
        }
        return monsterEnt;
    }

    getLessBloodMonster() {
        let monsterEnts = this.monsterGroup.matchEntities;
        let monsterEnt: MonsterEnt | null = null!;
        let minBlood = Number.MAX_SAFE_INTEGER;
        let tmpBlood = 0;
        for(let i = 0; i < this.monsterGroup.count; i++) {
            tmpBlood = monsterEnts[i].AvatarProperties.health;
            if(tmpBlood > 0 && tmpBlood < minBlood) {
                minBlood = tmpBlood;
                monsterEnt = monsterEnts[i];
            }
        }
        return monsterEnt;
    }

    getNearLessBloodMonster(playerPos: Vec3) {
        let monsterEnts = this.monsterGroup.matchEntities;
        let minDistance = Number.MAX_SAFE_INTEGER;
        let tmpDist = 0;
        let minBlood = Number.MAX_SAFE_INTEGER;
        let tmpBlood = 0;
        let monsterEnt: MonsterEnt | null = null!;
        for(let i = 0; i < this.monsterGroup.count; i++) {
            Vec3.subtract(tmpDelta, monsterEnts[i].Transform.position, playerPos);
            tmpDist = Math.abs(tmpDelta.x) + Math.abs(tmpDelta.y);
            tmpBlood = monsterEnts[i].AvatarProperties.health;
            if(tmpBlood > 0 && tmpBlood < minBlood && tmpDist < minDistance) {
                minBlood = tmpBlood;
                minDistance = tmpDist;
                monsterEnt = monsterEnts[i];
            }
        }
        return monsterEnt;
    }

    onShootNear(toggle: Toggle) {
        if(this.playerEnt.AutoFire.searchMonster === NEAR) {
            toggle.isChecked = true;
            return;
        }
        this.playerEnt.AutoFire.searchMonster ^= NEAR;
        log('searchMonster > ', this.playerEnt.AutoFire.searchMonster);
    }

    onShootLessBlood(toggle: Toggle) {
        if(this.playerEnt.AutoFire.searchMonster === LESS_BLOOD) {
            toggle.isChecked = true;
            return;
        }
        this.playerEnt.AutoFire.searchMonster ^= LESS_BLOOD;
        log('searchMonster > ', this.playerEnt.AutoFire.searchMonster);
    }

    onShootChangeTarget() {
        let weid = this.playerEnt.AvatarProperties.weaponEid;
        let gunEnt = ecs.getEntityByEid<GunEnt>(weid);
        this.playerEnt.AutoFire.monsterEid = -1;
        this.getMonster();
    }
}
