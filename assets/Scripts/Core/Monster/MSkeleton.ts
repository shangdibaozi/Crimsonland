
import { _decorator, Component, Node, Animation, Collider2D, Contact2DType, IPhysics2DContact, PhysicsSystem2D } from 'cc';
import { EntityLink } from '../../CC/EntityLink';
import { AI_STATE } from '../../Constants';
import { MonsterEnt } from '../Systems/EntityFactory';
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
    }

    start () {
        // [3]
    }

    onEnable() {
        this.playAnimation('Attack');
    }

    /**
     * 动画帧事件回调
     */
    onAttackAreaEnable() {
        this.attackArea.active = true;
        console.log(this.attackArea.active);
    }

    /**
     * 动画帧事件回调
     */
    onAttackAreaDisable() {
        this.attackArea.active = false;
        console.log(this.attackArea.active);
    }

    onTakeHitOver() {
        let monsterEnt = this.getComponent(EntityLink)!.getEnt() as MonsterEnt;
        monsterEnt.AI.aiState = AI_STATE.TAKE_HIT_OVER;
    }
    
    playAnimation(animationName: AnimationType) {
        this.animation.play(animationName);
    }
}