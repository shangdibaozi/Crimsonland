
import { _decorator, Component, Node, Camera, Contact2DType, PhysicsSystem2D, Collider2D, IPhysics2DContact } from 'cc';
import { UI_EVENT } from '../Constants';
import { Global } from '../Global';
import { ecs } from '../Libs/ECS';
import { ObjPool } from './ObjPool';
import { RootSystem } from './Systems/RootSystem';
import { SysUtil } from './Systems/SysUtil';
const { ccclass, property } = _decorator;

let start = 11;

function f(key: string): any {
    console.log("key: ", key)
    return function(e: any, b:any, c:any) {
        
        for(let k in e) {
            e[k] = start++;
            console.log(k);
        }
        // e[b] = start++;
        console.log(e[b])
    }
}

@f('T')
class Test {
    // @f('A')
    static A: number;
    // @f('B')
    static B: number;
}

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

        console.log(Test.A);
        console.log(Test.B);
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