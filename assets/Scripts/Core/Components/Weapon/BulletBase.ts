import { ecs } from "../../../Libs/ECS";

@ecs.register('BulletBase')
export class BulletBase extends ecs.IComponent {
    damage: number = 0;
    /**
     * 子弹爆炸半径
     */
    explosionRadius: number = 0;

    reset() {
        this.damage = 0;
        this.explosionRadius = 0;
    }
}