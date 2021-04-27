import { instantiate, v3, Vec3 } from "cc";
import { UI_EVENT } from "../../../Constants";
import { Global } from "../../../Global";
import { ecs } from "../../../Libs/ECS";
import { Util } from "../../../Util";
import { Collision } from "../../Components/Collision";
import { EnemyNode } from "../../Components/EnemyNode";
import { TagEnemy } from "../../Components/TagEnemy";
import { Transform } from "../../Components/Transform";


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
        let time = entities[0].get(Timer).time -= this.dt;
        if(time <= 0) {
            entities[0].get(Timer).time = 5;

            let monsterNode = instantiate(Util.randomChoice(Global.gameWorld.monstersPrefab));
            monsterNode.parent = Global.gameWorld.avatarLayer;
            monsterNode.setPosition(v3(Util.randomRange(-50, 50), Util.randomRange(-50, 50), 0));

            let enemyEnt = ecs.createEntityWithComps(TagEnemy, EnemyNode, Transform, Collision);
            enemyEnt.get(EnemyNode).root = monsterNode;

            Vec3.copy(enemyEnt.get(Transform).position, monsterNode.position);

            enemyEnt.get(Collision).radius = 30;
        }
    }

    onStartGame() {
        ecs.createEntityWithComp(Timer);
    }
}