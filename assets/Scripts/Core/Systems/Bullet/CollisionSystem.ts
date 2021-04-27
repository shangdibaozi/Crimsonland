import { v3, Vec3 } from "cc";
import { ecs } from "../../../Libs/ECS";
import { BulletNode } from "../../Components/BulletNode";
import { Collision } from "../../Components/Collision";
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
        
        for(let i = 0, _len = this.bulletGroup.matchEntities.length; i < _len; i++) {
            let bulletEnt = this.bulletGroup.matchEntities[i];
            let transformBullet = bulletEnt.get(Transform);
            let radiusBullet = bulletEnt.get(Collision).radius;
            for(let j = 0, len = entities.length; j < len; j++) {
                let enemyEnt = entities[j];
                let transformEnemy = enemyEnt.get(Transform);
                let radiusEnemy = enemyEnt.get(Collision).radius;
                let total = (radiusBullet + radiusEnemy) * 0.5;
                Vec3.subtract(tmp, transformBullet.position, transformEnemy.position);

                if(Math.abs(tmp.x) > total || Math.abs(tmp.y) > total) {
                    continue;
                }
                else {
                    bulletEnt.destroy();
                    enemyEnt.destroy();
                    this.bulletGroup.matchEntities.splice(i, 1);
                    i++;

                    entities.splice(j, 1);
                    j--;

                    break;
                }
            }
        }

    }

}