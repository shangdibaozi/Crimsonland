
import { _decorator, Component, Node } from 'cc';
import { ecs } from '../Libs/ECS';
const { ccclass, property } = _decorator;

@ccclass('EntityLink')
export class EntityLink extends Component {
    
    eid: number = -1;

    link(eid: number) {
        this.eid = eid;
    }

    unlink() {
        this.eid = -1;
    }
    
    getEnt<T extends ecs.Entity>() {
        if(this.eid === -1) {
            return null;
        }
        else {
            return ecs.getEntityByEid<T>(this.eid);
        }
    }
}