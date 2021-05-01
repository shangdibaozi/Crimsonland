import { v3, Vec3 } from "cc";
import { ecs } from "../../../Libs/ECS";
import { AvatarProperties } from "../../Components/AvatarProperties";
import { BulletNode } from "../../Components/BulletNode";
import { Collision } from "../../Components/Collision";
import { Damage } from "../../Components/Damage";
import { Movement } from "../../Components/Movement";
import { TagEnemy } from "../../Components/TagEnemy";
import { Transform } from "../../Components/Transform";



let tmp = v3();

export class CollisionSystem extends ecs.ComblockSystem {
    bulletGroup!: ecs.Group;

    init() {

        this.bulletGroup = ecs.createGroup(ecs.allOf(Transform, Collision, BulletNode));
    }
    
    filter(): ecs.IMatcher {
        return ecs.allOf(Transform, Collision, TagEnemy);
    }

    update(entities: ecs.Entity[]): void {
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
                    let damage = bulletEnt.get(Damage).val;
                    let avatarProperties = enemyEnt.get(AvatarProperties);

                    avatarProperties.health =  Math.max(0, avatarProperties.health - damage);
                    if(avatarProperties.health <= 0) {
                        enemyEnt.destroy();
                        entities.splice(j, 1);
                    }
                    else {
                        // 子弹打中怪物后怪物击退效果
                        Vec3.multiplyScalar(tmp, bulletEnt.get(Movement).heading, 10);
                        transformEnemy.position.add(tmp);
                    }

                    bulletEnt.destroy();
                    break;
                }
            }
        }
    }
}