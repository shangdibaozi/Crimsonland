import { instantiate, v3, Vec3 } from "cc";
import { UI_EVENT } from "../../../Constants";
import { Global } from "../../../Global";
import { ecs } from "../../../Libs/ECS";
import { Util } from "../../../Util";
import { AvatarProperties } from "../../Components/AvatarProperties";
import { Collision } from "../../Components/Collision";
import { EnemyNode } from "../../Components/EnemyNode";
import { Movement } from "../../Components/Movement";
import { TagEnemy } from "../../Components/TagEnemy";
import { Transform } from "../../Components/Transform";
import { ObjPool } from "../../ObjPool";
import { EntityFactory } from "../EntityFactory";


@ecs.register('Timer')
class Timer extends ecs.IComponent {

    time: number = 0;

    reset() {

    }
}

export class MonsterFactory extends ecs.ComblockSystem {

    init() {
        Global.uiEvent.on(UI_EVENT.START_GAME, this.onStartGame, this);
    }

    filter(): ecs.IMatcher {
        return ecs.allOf(Timer);
    }

    update(entities: ecs.Entity[]): void {
        if(ecs.query(ecs.allOf(Transform, Collision, TagEnemy)).length >= 200) {
            return;
        }
        let time = entities[0].get(Timer).time -= this.dt;
        if(time <= 0) {
            entities[0].get(Timer).time = 200000000;
        
             let monsterNode = ObjPool.getMonster();
            monsterNode.parent = Global.gameWorld!.avatarLayer;
            monsterNode.setPosition(v3(Util.randomRange(-500, 500), Util.randomRange(-500, 500), 0));

            let enemyEnt = EntityFactory.createMonster();
            enemyEnt.get(EnemyNode).root = monsterNode;

            Vec3.copy(enemyEnt.get(Transform).position, monsterNode.position);

            enemyEnt.get(Collision).radius = 30;

            enemyEnt.get(Movement).speed = 30;

            // enemyEnt.get(Damage).val = 10;

            let prop = enemyEnt.get(AvatarProperties);
            prop.maxHealth = prop.health = 100000;
        }
    }

    onStartGame() {
        ecs.createEntityWithComp(Timer);
    }
}