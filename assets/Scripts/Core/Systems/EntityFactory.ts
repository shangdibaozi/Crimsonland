import { ecs } from "../../Libs/ECS";
import { AIComponent } from "../Components/AIComponent";
import { AvatarProperties } from "../Components/AvatarProperties";
import { CameraFollowComponent } from "../Components/CameraFollowComponent";
import { EnemyNode } from "../Components/EnemyNode";
import { Lifetime } from "../Components/Lifetime";
import { Movement } from "../Components/Movement";
import { PlayerNode } from "../Components/PlayerNode";
import { Transform } from "../Components/Transform";
import { BulletBase } from "../Components/Weapon/BulletBase";
import { GunNode } from "../Components/Weapon/GunNode";
import { ECSNode } from "../Components/ECSNode";
import { AutoFireComponent } from "../Components/AutoFireComponent";
import { TagItem } from "../Components/Tag/TagItem";
import { ECSTag } from "../Components/ECSTag";

export class EntityFactory {
    static createPlayerEnt() {
        return ecs.createEntityWithComps<PlayerEnt>(PlayerNode, Movement, Transform, AvatarProperties, CameraFollowComponent, AutoFireComponent, ECSTag.Player);
    }

    static createMonster() {
        return ecs.createEntityWithComps<MonsterEnt>(ECSTag.Enemy, Movement, EnemyNode, Transform, AIComponent, AvatarProperties);
    }

    static createBullet() {
        return ecs.createEntityWithComps<BulletEnt>(Movement, Transform, Lifetime, BulletBase);
    }

    static createGunEnt() {
        let ent = ecs.createEntityWithComps<GunEnt>(GunNode);

        return ent;
    }

    static createItemEnt() {
        let ent = ecs.createEntityWithComps<ItemEnt>(TagItem, Lifetime, ECSNode, Transform);

        return ent;
    }
}

export class PlayerEnt extends ecs.Entity {
    PlayerNode!: PlayerNode;
    Movement!: Movement;
    Transform!: Transform;
    CameraFollow!: CameraFollowComponent;
    AvatarProperties!: AvatarProperties;
    AutoFire!: AutoFireComponent;
}

export class MonsterEnt extends ecs.Entity {
    AI!: AIComponent;
    Movement!: Movement;
    Transform!: Transform;
    ECSNode!: ECSNode;
    AvatarProperties!: AvatarProperties;
    EnemyNode!: EnemyNode;
}

export class BulletEnt extends ecs.Entity {
    Movement!: Movement;
    Transform!: Transform;
    Lifetime!: Lifetime;
    BulletBase!: BulletBase;
    ECSNode!: ECSNode;
}

export class GunEnt extends ecs.Entity {
    GunNode!: GunNode;
}

export class ItemEnt extends ecs.Entity {
    TagItem!: TagItem;
    Lifetime!: Lifetime
    ECSNode!: ECSNode;
    Transform!: Transform;
}