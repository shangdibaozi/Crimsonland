import { instantiate, v3, Vec3 } from "cc";
import { AI_STATE, UI_EVENT } from "../../../Constants";
import { Global } from "../../../Global";
import { ecs } from "../../../Libs/ECS";
import { Util } from "../../../Util";
import { AvatarProperties } from "../../Components/AvatarProperties";
import { Collision } from "../../Components/Collision";
import { EnemyNode } from "../../Components/EnemyNode";
import { Movement } from "../../Components/Movement";
import { TagEnemy } from "../../Components/Tag/TagEnemy";
import { Transform } from "../../Components/Transform";
import { NODE_TYPE, ObjPool } from "../../ObjPool";
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

    onDestroy() {
        Global.uiEvent.targetOff(this);
    }

    filter(): ecs.IMatcher {
        return ecs.allOf(Timer);
    }

    update(entities: ecs.Entity[]): void {
        if(ecs.query(ecs.allOf(Transform, Collision, TagEnemy)).length >= 4) {
            return;
        }
        let time = entities[0].get(Timer).time -= this.dt;
        if(time <= 0) {
            entities[0].get(Timer).time = 2;
        
            for(let i = 0; i < 3; i++) {
                this.generateMonster();
            }
        }
    }

    generateMonster() {
        let monsterNode = ObjPool.getNode(NODE_TYPE.MONSTER);
        monsterNode.active = true;
        monsterNode.parent = Global.gameWorld!.avatarLayer;
        monsterNode.setPosition(v3(Util.randomRange(-500, 500), Util.randomRange(-500, 500), 0));

        let enemyEnt = EntityFactory.createMonster();
        enemyEnt.EnemyNode.root = monsterNode;

        Vec3.copy(enemyEnt.get(Transform).position, monsterNode.position);

        enemyEnt.get(Collision).radius = 15;

        enemyEnt.get(Movement).speed = 30;

        // enemyEnt.get(Damage).val = 10;

        let prop = enemyEnt.get(AvatarProperties);
        prop.maxHealth = prop.health = 100;
        enemyEnt.EnemyNode.hpBar!.progress = 1;

        enemyEnt.AI.aiState = AI_STATE.NONE;
    }

    onStartGame() {
        ecs.createEntityWithComp(Timer);
    }
}