import { ecs } from "../../Libs/ECS";
import { Node, UITransform } from "cc";
import { ObjPool } from "../ObjPool";
import { EntityLink } from "../../CC/EntityLink";

@ecs.register('ECSNode')
export class ECSNode extends ecs.IComponent {
    private _val: Node | null = null;
    uiTransform: UITransform | null = null;

    set val(node: Node | null) {
        this._val = node;
        if(node) {
            this.uiTransform = node.getComponent(UITransform)!;

            let linkComp = node.getComponent(EntityLink);
            if(!linkComp) {
                linkComp = node.addComponent(EntityLink);
            }
            linkComp.link(this.ent.eid);
        }
    }

    get val() {
        return this._val!;
    }

    
    reset() {
        if(this._val) {
            ObjPool.putNode(this._val);
            this._val.getComponent(EntityLink)?.unlink();
        }

        this.uiTransform = null;
        this._val = null;
    }
}