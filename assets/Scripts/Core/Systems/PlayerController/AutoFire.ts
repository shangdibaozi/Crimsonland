import { macro, v3, Vec3, Node } from "cc";
import { Global } from "../../../Global";
import { ecs } from "../../../Libs/ECS";
import { PlayerNode } from "../../Components/PlayerNode";
import { TagEnemy } from "../../Components/TagEnemy";
import { GunBase } from "../../Components/Weapon/GunBase";
import { GunNode } from "../../Components/Weapon/GunNode";
import { ObjPool } from "../../ObjPool";
import { BulletEnt, EntityFactory, GunEnt, MonsterEnt, PlayerEnt } from "../EntityFactory";

let pos = v3();
let heading = v3();

export class AutoFire extends ecs.ComblockSystem {

    monsterGroup!: ecs.Group<MonsterEnt>;

    init() {
        this.monsterGroup = ecs.createGroup(ecs.allOf(TagEnemy));
    }

    filter(): ecs.IMatcher {
        return ecs.allOf(PlayerNode);
    }

    update(entities: PlayerEnt[]): void {
        
        for(let playerEnt of entities) {
            let weid = playerEnt.AvatarProperties.weaponEid;
            let gunEnt = ecs.getEntityByEid<GunEnt>(weid);
            let gunInfo = gunEnt.GunBase;
            if(gunInfo.amount > 0) {
                gunInfo.curFT += this.dt * gunInfo.rateOfFire;
    
                if(gunInfo.curFT > 1) {
                    gunInfo.curFT -= 1;
    
                    this.shoot(gunInfo, playerEnt.PlayerNode);
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
    }


    shoot(gunBase: GunBase, playerNode: PlayerNode) {
        if(this.monsterGroup.count === 0) {
            return;
        }
        let monsterEnt = this.monsterGroup.matchEntities[0];

        let gunNode = gunBase.ent.get(GunNode);
        gunNode.root!.setPosition(gunBase.kickbackAmount, 0, 0);
        gunNode.gunPointUITransform!.convertToWorldSpaceAR(Vec3.ZERO, pos);
        let bulletPos = Global.gameWorld!.avatarLayerUITransform.convertToNodeSpaceAR(pos, pos);

        Vec3.subtract(heading, monsterEnt.Transform.position, bulletPos);
        Vec3.normalize(heading, heading);

        let angle = Math.atan2(heading.y, heading.x) * macro.DEG;

        if(heading.x < 0) {
            playerNode.bodyNode!.setScale(-1, 1, 1);
            playerNode.gunNode!.setScale(1, -1, 1);
        }
        else if(heading.x > 0) {
            playerNode.bodyNode!.setScale(1, 1, 1);
            playerNode.gunNode!.setScale(1, 1, 1);
        }
        playerNode.gunNode!.angle = angle;

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
}