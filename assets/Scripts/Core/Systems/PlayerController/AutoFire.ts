import { macro, v3, Vec3, Node, log, Toggle } from "cc";
import { UI_EVENT } from "../../../Constants";
import { Global } from "../../../Global";
import { ecs } from "../../../Libs/ECS";
import { AutoFireComponent } from "../../Components/AutoFireComponent";
import { PlayerNode } from "../../Components/PlayerNode";
import { TagEnemy } from "../../Components/TagEnemy";
import { GunBase } from "../../Components/Weapon/GunBase";
import { GunNode } from "../../Components/Weapon/GunNode";
import { ObjPool } from "../../ObjPool";
import { BulletEnt, EntityFactory, GunEnt, MonsterEnt, PlayerEnt } from "../EntityFactory";

let pos = v3();
let heading = v3();
let tmpDelta = v3();

const NEAR = 1 << 0;
const LESS_BLOOD = 1 << 1;

const NEAR_LESS_BLOOD = NEAR | LESS_BLOOD;

export class AutoFire extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {

    monsterGroup!: ecs.Group<MonsterEnt>;

    playerEnt!: PlayerEnt;

    init() {
        this.monsterGroup = ecs.createGroup(ecs.allOf(TagEnemy));

        Global.uiEvent.on(UI_EVENT.SHOOT_NEAR, this.onShootNear, this);
        Global.uiEvent.on(UI_EVENT.SHOOT_LESS_BLOOD, this.onShootLessBlood, this);
        Global.uiEvent.on(UI_EVENT.SHOOT_LOCK, this.onShootLock, this);
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
        let gunInfo = gunEnt.GunBase;
        if(gunInfo.amount > 0) {
            gunInfo.curFT += this.dt * gunInfo.rateOfFire;

            if(gunInfo.curFT > 1) {
                gunInfo.curFT -= 1;

                this.shoot(gunInfo);
            }
        }
        else {
            gunInfo.curABT += this.dt;
            if(gunInfo.curABT >= gunInfo.timeOfAddBullet) {
                gunInfo.curABT = 0;
                gunInfo.amount = gunInfo.maxAmount;
            }
        }

        let gun = gunEnt.GunNode.root!;
        Vec3.lerp(pos, gun.position, Vec3.ZERO, this.dt * 10);
        gun.setPosition(pos);
    }

    shoot(gunBase: GunBase) {
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
            if(autoFire.isLock) {
                autoFire.monsterEid = monsterEnt.eid;
            }
        }

        if(monsterEnt == null) {
            return;
        }

        let gunNode = gunBase.ent.get(GunNode);
        gunNode.root!.setPosition(gunBase.kickbackAmount, 0, 0);
        gunNode.gunPointUITransform!.convertToWorldSpaceAR(Vec3.ZERO, pos);
        let bulletPos = Global.gameWorld!.avatarLayerUITransform.convertToNodeSpaceAR(pos, pos);

        Vec3.subtract(heading, monsterEnt!.Transform.position, bulletPos);
        Vec3.normalize(heading, heading);

        let angle = Math.atan2(heading.y, heading.x) * macro.DEG;

        let playerNode = this.playerEnt.PlayerNode;
        if(heading.x < 0) {
            playerNode.bodyNode!.setScale(-1, 1, 1);
            playerNode.gunNode!.setScale(1, -1, 1);
        }
        else if(heading.x > 0) {
            playerNode.bodyNode!.setScale(1, 1, 1);
            playerNode.gunNode!.setScale(1, 1, 1);
        }
        playerNode.gunNode!.angle = angle;

        gunBase.amount -= 1;
        let bulletNode = ObjPool.getBullet();
        bulletNode.parent = Global.gameWorld!.bulletLayer;
        bulletNode.setPosition(pos);
        bulletNode.angle = angle;
        
        let ent = EntityFactory.createBullet() as BulletEnt;
        ent.BulletNode.root = bulletNode;
        Vec3.copy(ent.Movement.heading, heading);
        ent.Movement.speed = gunBase.speed;

        Vec3.copy(ent.Transform.position, pos);

        ent.Lifetime.time = 30;

        ent.Collision.radius = 6;

        ent.BulletBase.damage = gunBase.damage;
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

    onShootLock() {
        this.playerEnt.AutoFire.isLock = !this.playerEnt.AutoFire.isLock;
    }
}
