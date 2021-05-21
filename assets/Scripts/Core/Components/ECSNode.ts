import { ecs } from "../../Libs/ECS";
import { Node, UITransform } from "cc";
import { ObjPool } from "../ObjPool";

@ecs.register('ECSNode')
export class ECSNode extends ecs.IComponent {
    private _val: Node | null = null;
    uiTransform: UITransform | null = null;

    set val(node: Node | null) {
        this._val = node;
        if(node) {
            this.uiTransform = node.getComponent(UITransform)!;
        }
    }

    get val() {
        return this._val!;
    }

    
    reset() {
        if(this.val) {
            ObjPool.putNode(this.val);
        }
        this.uiTransform = null;
        this._val = null;
    }
}