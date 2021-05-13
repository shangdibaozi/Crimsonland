import { v3, Vec3 } from "cc";
import { ecs } from "../../../Libs/ECS";

@ecs.register('GunBase')
export class GunBase extends ecs.IComponent {
    /**
     * 射击计时器
     */
    curFT: number = 0;
    /**
     * 装弹计时器
     */
    curABT: number = 0;
    /**
     * 伤害
     */
    damage: number = 0;
    /**
     * 射击频率
     */
    rateOfFire: number = 1;
    /**
     * 子弹速度
     */
    speed: number = 0;
    /**
     * 每次射出的子弹数量
     */
    numberPerShoot: number = 1;
    /**
     * 当前弹夹子弹总数
     */
    amount: number = 0;
    /**
     * 弹夹最大子弹数
     */
    maxAmount: number = 0;
    /**
     * 射击后坐力导致枪反向移动距离
     */
    kickbackAmount: number = -3;
    /**
     * 装满弹夹需要的时间
     */
    timeOfAddBullet: number = 1;

    bulletName: string = '';

    init(cfg: GunInfo) {
        this.damage = cfg.Damage;
        this.rateOfFire = cfg.RateOfFire;
        this.speed = cfg.Speed;
        this.numberPerShoot = cfg.NumberPerShoot;
        this.maxAmount = this.amount = cfg.MaxAmount;
        this.kickbackAmount = cfg.KickbackAmount;
        this.timeOfAddBullet = cfg.TimeOfAddBullet;
        this.bulletName = cfg.BulletName;
    }

    reset() {
        this.curFT = 0;
        this.curABT = 0;
        this.damage = 0;
        this.rateOfFire = 1;
        this.speed = 0;
        this.numberPerShoot = 1;
        this.amount = 0;
        this.maxAmount = 0;
        this.kickbackAmount = -3;
        this.timeOfAddBullet = 1;
        this.bulletName = '';
    }
}