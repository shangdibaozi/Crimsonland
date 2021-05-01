import { ecs } from "../../Libs/ECS";
import { AIComponent } from "../Components/AIComponent";
import { AvatarProperties } from "../Components/AvatarProperties";
import { BulletNode } from "../Components/BulletNode";
import { Collision } from "../Components/Collision";
import { Damage } from "../Components/Damage";
import { EnemyNode } from "../Components/EnemyNode";
import { Lifetime } from "../Components/Lifetime";
import { Movement } from "../Components/Movement";
import { PlayerNode } from "../Components/PlayerNode";
import { TagEnemy } from "../Components/TagEnemy";
import { Transform } from "../Components/Transform";

export class EntityFactory {
    static createPlayer() {
        return ecs.createEntityWithComps(PlayerNode, Movement, Transform, Collision, AvatarProperties);
    }

    static createMonster() {
        return ecs.createEntityWithComps(TagEnemy, Movement, EnemyNode, Transform, Collision, AIComponent, AvatarProperties, Damage);
    }

    static createBullet() {
        return ecs.createEntityWithComps(Movement, Transform, Lifetime, BulletNode, Collision, Damage);
    }
}