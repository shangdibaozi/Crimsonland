import { ecs } from "../../Libs/ECS";
import { Node, UITransform } from "cc";

@ecs.register('ECSNode')
export class ECSNode extends ecs.IComponent {
    private _val: Node | null = null;
    uiTransform!: UITransform;

    set val(node: Node) {
        this._val = node;
        this.uiTransform = node.getComponent(UITransform)!;
    }

    get val() {
        return this._val!;
    }

    

    reset() {
        this._val = null;
    }
}