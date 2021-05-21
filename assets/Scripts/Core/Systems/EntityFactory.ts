import { ecs } from "../../Libs/ECS";
import { AIComponent } from "../Components/AIComponent";
import { AvatarProperties } from "../Components/AvatarProperties";
import { GunBase } from "../Components/Weapon/GunBase";
import { BulletNode } from "../Components/BulletNode";
import { CameraFollowComponent } from "../Components/CameraFollowComponent";
import { Collision } from "../Components/Collision";
import { EnemyNode } from "../Components/EnemyNode";
import { Lifetime } from "../Components/Lifetime";
import { Movement } from "../Components/Movement";
import { PlayerNode } from "../Components/PlayerNode";
import { TagEnemy } from "../Components/Tag/TagEnemy";
import { Transform } from "../Components/Transform";
import { BulletBase } from "../Components/Weapon/BulletBase";
import { GunNode } from "../Components/Weapon/GunNode";
import { ECSNode } from "../Components/ECSNode";
import { AutoFireComponent } from "../Components/AutoFireComponent";
import { TagItem } from "../Components/Tag/TagItem";
import { TagPlayer } from "../Components/Tag/TagPlayer";

export class EntityFactory {
    static createPlayerEnt() {
        return ecs.createEntityWithComps<PlayerEnt>(PlayerNode, Movement, Transform, Collision, AvatarProperties, CameraFollowComponent, AutoFireComponent, TagPlayer);
    }

    static createMonster() {
        return ecs.createEntityWithComps<MonsterEnt>(TagEnemy, Movement, EnemyNode, Transform, Collision, AIComponent, AvatarProperties);
    }

    static createBullet() {
        return ecs.createEntityWithComps<BulletEnt>(Movement, Transform, Lifetime, BulletNode, Collision, BulletBase);
    }

    static createGunEnt() {
        let ent = ecs.createEntityWithComps<GunEnt>(GunNode, GunBase);

        return ent;
    }

    static createItemEnt() {
        let ent = ecs.createEntityWithComps<ItemEnt>(TagItem, Lifetime, ECSNode, Transform, Collision);

        return ent;
    }
}

export class PlayerEnt extends ecs.Entity {
    PlayerNode!: PlayerNode;
    Movement!: Movement;
    Transform!: Transform;
    Collision!: Collision;
    CameraFollow!: CameraFollowComponent;
    AvatarProperties!: AvatarProperties;
    AutoFire!: AutoFireComponent;
}

export class MonsterEnt extends ecs.Entity {
    AI!: AIComponent;
    Movement!: Movement;
    Transform!: Transform;
    Collision!: Collision;
    ECSNode!: ECSNode;
    AvatarProperties!: AvatarProperties;
    EnemyNode!: EnemyNode;
}

export class BulletEnt extends ecs.Entity {
    Movement!: Movement;
    Transform!: Transform;
    Lifetime!: Lifetime;
    BulletNode!: BulletNode;
    Collision!: Collision;
    BulletBase!: BulletBase;
    ECSNode!: ECSNode;
}

export class GunEnt extends ecs.Entity {
    GunNode!: GunNode;
    GunBase!: GunBase;
}

export class ItemEnt extends ecs.Entity {
    TagItem!: TagItem;
    Lifetime!: Lifetime
    ECSNode!: ECSNode;
    Transform!: Transform;
    Collision!: Collision;
}