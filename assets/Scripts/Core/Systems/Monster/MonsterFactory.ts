import { director, game, v3, Vec3, view } from "cc";
import { AI_STATE, UI_EVENT } from "../../../Constants";
import { Global } from "../../../Global";
import { ecs } from "../../../Libs/ECS";
import { Util } from "../../../Util";
import { AvatarProperties } from "../../Components/AvatarProperties";
import { ECSTag } from "../../Components/ECSTag";
import { Movement } from "../../Components/Movement";
import { Transform } from "../../Components/Transform";
import { NODE_TYPE, ObjPool } from "../../ObjPool";
import { EntityFactory } from "../EntityFactory";


@ecs.register('MonsterFactory')
class MonsterFactoryComponent extends ecs.IComponent {
    maxCnt: number = 10;
    time: number = 0;

    reset() {

    }
}

class MonsterFactoryEnt extends ecs.Entity {
    MonsterFactory!: MonsterFactoryComponent;
}

export class MonsterFactory extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {

    mFactory: MonsterFactoryEnt | null = null;

    entityEnter(entities: MonsterFactoryEnt[]): void {
        this.mFactory = entities[0];
    }

    init() {
        Global.uiEvent.on(UI_EVENT.START_GAME, this.onStartGame, this);
    }

    onDestroy() {
        this.mFactory = null;
        Global.uiEvent.targetOff(this);
    }

    filter(): ecs.IMatcher {
        return ecs.allOf(MonsterFactoryComponent);
    }

    update(entities: MonsterFactoryEnt[]): void {
        if(ecs.query(ecs.allOf(Transform, ECSTag.Enemy)).length >= this.mFactory!.MonsterFactory.maxCnt) {
            return;
        }
        let time = this.mFactory!.MonsterFactory.time -= this.dt;
        if(time <= 0) {
            this.mFactory!.MonsterFactory.time = 2;
        
            for(let i = this.mFactory!.MonsterFactory.maxCnt; i > 0; i--) {
                this.generateMonster();
            }
        }
    }

    generateMonster() {
        let monsterNode = ObjPool.getNode(NODE_TYPE.MONSTER);
        monsterNode.active = true;
        monsterNode.parent = Global.gameWorld!.avatarLayer;
        let offset = 100
        let size = view.getCanvasSize();
        monsterNode.setPosition(v3(Util.randomRange(-size.width / 2 - offset, size.width / 2 + offset), Util.randomRange(-size.height / 2 - offset, size.height / 2 + offset), 0));

        let enemyEnt = EntityFactory.createMonster();
        enemyEnt.EnemyNode.root = monsterNode;

        Vec3.copy(enemyEnt.get(Transform).position, monsterNode.position);

        enemyEnt.get(Movement).speed = 30;

        // enemyEnt.get(Damage).val = 10;

        let prop = enemyEnt.get(AvatarProperties);
        prop.maxHealth = prop.health = 10;
        enemyEnt.EnemyNode.hpBar!.progress = 1;

        enemyEnt.AI.targetState = AI_STATE.NONE;
    }

    onStartGame() {
        ecs.getSingleton(MonsterFactoryComponent);
    }
}