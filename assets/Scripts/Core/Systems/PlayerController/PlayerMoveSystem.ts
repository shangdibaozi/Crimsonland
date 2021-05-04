
import { macro, misc, Node, UITransform, v3, Vec3 } from 'cc';
import { ecs } from '../../../Libs/ECS';
import { Movement } from '../../Components/Movement';
import { Transform } from '../../Components/Transform';
import { Global } from '../../../Global';
import { UI_EVENT } from '../../../Constants';
import { Keyboard } from '../../Components/Keyboard';
import { Mouse } from '../../Components/Mouse';
import { PlayerNode } from '../../Components/PlayerNode';
import { Collision } from '../../Components/Collision';
import { EntityFactory, PlayerEnt } from '../EntityFactory';

let pos = v3();

export class PlayerMoveSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    player!: PlayerEnt;
    movement!: Movement;
    init() {
        Global.uiEvent.on(UI_EVENT.CREATE_PLAYER_ENT, this.createPlayer, this);
    }

    filter(): ecs.IMatcher {
        return ecs.allOf(PlayerNode, Movement, Transform);
    }

    entityEnter(entities: PlayerEnt[]): void {
        this.player = entities[0];
        this.movement = entities[0].get(Movement);
    }

    update(entities: PlayerEnt[]): void {
        this.player.Transform.position.x += this.movement.heading.x * this.dt * this.movement.speed;
        this.player.Transform.position.y += this.movement.heading.y * this.dt * this.movement.speed;

        let gun = this.player.PlayerNode.gunNode!.children[0];
        Vec3.lerp(pos, gun.position, Vec3.ZERO, this.dt * 10);
        gun.setPosition(pos);
    }

    createPlayer(node: Node) {
        let player = EntityFactory.createPlayer() as PlayerEnt;
        player.PlayerNode.root = node;
        player.PlayerNode.bodyNode = node.children[0];
        player.PlayerNode.gunNode = node.children[1];

        player.Movement.speed = 50;

        player.Collision.radius = 14;

        player.CameraFollow.camera = Global.gameWorld.camera.node;

        // 判断运行环境
        player.add(Keyboard);
        player.add(Mouse);

    }
}