import { _decorator, Component, CCBoolean, CCInteger, CCFloat, Prefab, Node, Vec3, v3, EventMouse, macro, systemEvent, SystemEvent, UITransform, Vec2 } from "cc";
import { UI_EVENT } from "../../Constants";
import { Global } from "../../Global";
import { ecs } from "../../Libs/ECS";


let tmpPos = v3();


const { ccclass, property } = _decorator;
@ccclass('GunBase')
export abstract class GunBase extends Component {
    @property(CCBoolean)
    isDebug: boolean = false;

    @property({
        type: Node,
        visible() { return (this as GunBase).isDebug; },
        tooltip: '子弹的父节点',
    })
    parentLayer!: Node;

    @property({
        type: Node,
        tooltip: '枪口位置'
    })
    muzzle!: Node;

    @property({
        type: Prefab,
        tooltip: '子弹预制体'
    })
    bullet!: Prefab;

    @property({
        type: CCFloat,
        visible() { return (this as GunBase).isDebug; },
        tooltip: '后坐力'
    })
    kickbackAmount: number = 0;

    @property({
        type: CCFloat,
        visible() { return (this as GunBase).isDebug; },
        tooltip: '偏移角度'
    })
    angle: number = 3;

    @property({
        type: CCInteger,
        visible() { return (this as GunBase).isDebug; },
        tooltip: '射击频率，即1s能射出多少发子弹'
    })
    rateOfFire: number = 40;

    @property({
        type: CCInteger,
        visible() { return (this as GunBase).isDebug; },
        tooltip: '没次射出子弹的数量'
    })
    numberPerShoot: number = 1;

    @property({
        type: CCInteger,
        visible() { return (this as GunBase).isDebug; },
        tooltip: '弹夹最大装弹数量'
    })
    maxAmount: number = 10;
    amount: number = 0;

    @property({
        type: CCFloat,
        visible() { return (this as GunBase).isDebug; },
        tooltip: '装弹时间'
    })
    timeOfAddBullet: number = 1;

    @property({
        type: CCInteger,
        visible() { return (this as GunBase).isDebug; },
        tooltip: '子弹速度（速度越大，火焰长度越长）'
    })
    speed: number = 250;

    damage: number = 0;

    canShoot: boolean = true;
    isStopShoot: boolean = false;

    private shootTime = 0;

    public shootHeading: Vec3 = v3(1, 0, 0);

    public isOnTheGround = true;

    onLoad() {
        if(this.isDebug) {
            systemEvent.on(SystemEvent.EventType.MOUSE_DOWN, (event: EventMouse) => {
                event.getLocation(tmpPos as unknown as Vec2);
                this.parentLayer.getComponent(UITransform)!.convertToNodeSpaceAR(tmpPos, tmpPos);
    
                Vec3.subtract(this.shootHeading, tmpPos, this.node.position);
                this.shootHeading.normalize();
    
                let angle = Math.atan2(this.shootHeading.y, this.shootHeading.x) * macro.DEG;
                this.node.angle = angle;
            });
        }
        else {
            
        }

        Global.uiEvent.on(UI_EVENT.SHOOT_STOP, this.onStopShoot, this);
    }

    init(cfg: GunInfo, parentLayer: Node) {
        this.damage = cfg.Damage;
        this.rateOfFire = cfg.RateOfFire;
        this.speed = cfg.Speed;
        this.numberPerShoot = cfg.NumberPerShoot;
        this.maxAmount = this.amount = cfg.MaxAmount;
        this.kickbackAmount = cfg.KickbackAmount;
        this.timeOfAddBullet = cfg.TimeOfAddBullet;
        this.angle = cfg.Angle;

        this.parentLayer = parentLayer;
    }

    abstract shoot(): void;
    abstract reset(): void;

    update(dt: number) {
        if(this.isOnTheGround || this.isStopShoot) {
            return;
        }
        if(!this.canShoot) {
            this.shootTime += this.rateOfFire * dt;
            if(this.shootTime >= 1) {
                this.shootTime -= 1;
                this.canShoot = true;
            }
        }

        if(this.isDebug) {
            this.shoot();
        }

        Vec3.lerp(tmpPos, this.node.position, Vec3.ZERO, dt * 10);
        this.node.setPosition(tmpPos);
    }

    onStopShoot(flag: boolean) {
        this.isStopShoot = flag;
    }
}