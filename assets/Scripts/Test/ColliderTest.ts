
import { _decorator, Component, Node, Contact2DType, PhysicsSystem2D, Collider2D, IPhysics2DContact } from 'cc';
import { PhysicsGroup } from '../Constants';
const { ccclass, property } = _decorator;

@ccclass('ColliderTest')
export class ColliderTest extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;
    // @property(PhysicsGroup)

    start () {
        PhysicsSystem2D.instance.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if(selfCollider.group == PhysicsGroup.Enemy_Attack) {
            console.log('Enemy attack player');
        }
        else if(otherCollider.group == PhysicsGroup.Player_Attack) {
            console.log('Player attack enemy');
        }
        console.log(selfCollider.group, otherCollider.group);
        console.log(selfCollider.node.name, otherCollider.node.name);
    }
}