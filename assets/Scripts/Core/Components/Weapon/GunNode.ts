import { ecs } from "../../../Libs/ECS";
import { Node, UITransform, Animation, v3 } from "cc";
import { ECSNode } from "../ECSNode";

let pos = v3();
@ecs.register('GunNode')
export class GunNode extends ecs.IComponent {
    set root(node: Node) {
        if(node) {
            let body = node.getChildByName('Sprite')!;
            body.getPosition(pos);
            pos.y = 0;
            body.setPosition(pos);
            node.getComponent(Animation)!.stop();
            this.ent.add(ECSNode).val = node;
            this.shadow = node.getChildByName('Shadow');
            this.shadow!.active = false;
            this.gunPointUITransform = node.getChildByName('Muzzle')?.getComponent(UITransform)!; 
        }
    }

    get root() {
        return this.ent.get(ECSNode).val!;
    }

    shadow: Node | null = null;
    gunPointUITransform: UITransform | null = null;
    
    reset() {
        this.shadow = null;
        this.gunPointUITransform = null;
    }
}