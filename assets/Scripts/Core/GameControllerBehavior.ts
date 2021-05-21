
import { _decorator, Component, Node, Camera, Contact2DType, PhysicsSystem2D, Collider2D, IPhysics2DContact } from 'cc';
import { UI_EVENT } from '../Constants';
import { Global } from '../Global';
import { ecs } from '../Libs/ECS';
import { ObjPool } from './ObjPool';
import { RootSystem } from './Systems/RootSystem';
import { SysUtil } from './Systems/SysUtil';
const { ccclass, property } = _decorator;

@ccclass('GameControllerBehavior')
export class GameControllerBehavior extends Component {
    rootSystem: RootSystem | null = null;

    async start () {
        this.rootSystem = new RootSystem();
        this.rootSystem.init();

        await ObjPool.loadPrefabs();
        Global.uiEvent.emit(UI_EVENT.START_GAME);

        // @ts-ignore
        window['ecs'] = ecs;
        // @ts-ignore
        window['ObjPool'] = ObjPool;

        
    }

    stopEcs() {
        ecs.clear();
        this.rootSystem!.clear();
        this.rootSystem = null;
    }

    update (deltaTime: number) {
        this.rootSystem!.execute(deltaTime);
    }

    
}