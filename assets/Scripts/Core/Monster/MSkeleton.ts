
import { _decorator, Component, Node, Animation } from 'cc';
const { ccclass, property } = _decorator;

type AnimationType = 'Attack' | 'Death' | 'Idle' | 'Move' | 'Shield' | 'Take Hit';

@ccclass('MSkeleton')
export class MSkeleton extends Component {
    @property(Node)
    hitArea!: Node;

    @property(Node)
    attackArea!: Node;

    private animation!: Animation;

    onLoad() {
        // 关闭攻击区域
        this.attackArea.active = false;

        this.animation = this.getComponent(Animation)!;

        // this.playAnimation('Attack');
    }

    start () {
        // [3]
    }

    onEnable() {
        this.playAnimation('Idle');
    }

    onAttackAreaEnable() {
        console.log(this.attackArea.active);
    }

    onAttackAreaDisable() {
        console.log(this.attackArea.active);
    }

    playAnimation(animationName: AnimationType) {
        this.animation.play(animationName);
    }
}