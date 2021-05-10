import { v3, Vec3 } from "cc";
import { ecs } from "../../../Libs/ECS";
import { AvatarProperties } from "../../Components/AvatarProperties";
import { BulletNode } from "../../Components/BulletNode";
import { Collision } from "../../Components/Collision";
import { MonsterDead } from "../../Components/MonsterDead";
import { Movement } from "../../Components/Movement";
import { TagEnemy } from "../../Components/Tag/TagEnemy";
import { Transform } from "../../Components/Transform";
import { BulletEnt, MonsterEnt } from "../EntityFactory";



let tmp = v3();

export class CollisionSystem extends ecs.ComblockSystem {
    bulletGroup!: ecs.Group<BulletEnt>;

    init() {

        this.bulletGroup = ecs.createGroup(ecs.allOf(Transform, Collision, BulletNode));
    }
    
    filter(): ecs.IMatcher {
        return ecs.allOf(Transform, Collision, TagEnemy);
    }

    update(entities: MonsterEnt[]): void {
        for(let i = this.bulletGroup.matchEntities.length - 1; i >= 0; i--) {
            let bulletEnt = this.bulletGroup.matchEntities[i];
            let transformBullet = bulletEnt.get(Transform);
            let radiusBullet = bulletEnt.get(Collision).radius;
            for(let j = entities.length - 1; j >= 0; j--) {
                let enemyEnt = entities[j];
                let transformEnemy = enemyEnt.get(Transform);
                let radiusEnemy = enemyEnt.get(Collision).radius;
                let total = (radiusBullet + radiusEnemy) * 0.5;
                Vec3.subtract(tmp, transformBullet.position, transformEnemy.position);

                if(Math.abs(tmp.x) > total || Math.abs(tmp.y) > total) {
                    continue;
                }
                else {
                    let damage = bulletEnt.BulletBase.damage;
                    let avatarProperties = enemyEnt.get(AvatarProperties);

                    avatarProperties.health =  Math.max(0, avatarProperties.health - damage);
                    if(avatarProperties.health <= 0) {
                        let monsterDeadComp = ecs.createEntityWithComp(MonsterDead);
                        Vec3.copy(monsterDeadComp.pos, enemyEnt.Transform.position)
                        enemyEnt.destroy();
                        entities.splice(j, 1);
                    }
                    else {
                        // 子弹打中怪物后怪物击退效果
                        Vec3.multiplyScalar(tmp, bulletEnt.get(Movement).heading, 5);
                        transformEnemy.position.add(tmp);
                    }

                    bulletEnt.destroy();
                    break;
                }
            }
        }
    }
}