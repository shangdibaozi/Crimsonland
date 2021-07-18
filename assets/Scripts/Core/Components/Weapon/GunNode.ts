import { ecs } from "../../../Libs/ECS";
import { Node, UITransform, Animation, v3, Collider2D } from "cc";
import { ECSNode } from "../ECSNode";
import { GunBase } from "../../Gun/GunBase";

let pos = v3();
@ecs.register('GunNode')
export class GunNode extends ecs.IComponent {

    get root() {
        return this.ent.get(ECSNode).val!;
    }

    init(node: Node, parentLayer: Node, cfg: GunInfo) {
        let body = node.getChildByName('Sprite')!;
        body.getPosition(pos);
        pos.y = 0;
        body.setPosition(pos);
        node.getComponent(Animation)!.stop();

        let bc2d = body.getComponent(Collider2D)!;
        bc2d.enabled = false;
        
        this.shadow = node.getChildByName('Shadow');
        this.shadow!.active = false;
        
        this.gunPointUITransform = node.getChildByName('Muzzle')!.getComponent(UITransform)!;
        
        if(!this.ent.has(ECSNode)) {
            this.ent.add(ECSNode);
        }
        this.ent.get(ECSNode).val = node;
        this.gunBase = node.getComponent(cfg.ComponentName) as GunBase;
        this.gunBase.init(cfg, parentLayer);
        this.gunBase.isOnTheGround = false;
    }

    shadow: Node | null = null;
    gunPointUITransform: UITransform | null = null;
    gunBase: GunBase | null = null;

    reset() {
        this.shadow = null;
        this.gunPointUITransform = null;
        this.gunBase!.reset();
        this.gunBase = null;
    }
}