
import { _decorator, Component, Node, EventMouse, macro, Prefab, systemEvent, SystemEvent, UITransform, Vec2, Vec3, CCFloat, CCInteger, v3 } from 'cc';
import { ecs } from '../../Libs/ECS';
import { Util } from '../../Util';
import { ECSNode } from '../Components/ECSNode';
import { Lifetime } from '../Components/Lifetime';
import { Movement } from '../Components/Movement';
import { TagFireBullet } from '../Components/Tag/TagFireBullet';
import { ObjPool } from '../ObjPool';

let pos = v3();
let pos1 = v3();
let gHeading = v3(1, 0, 0);
let gHeading1 = v3()
let tmpHeading = v3();

const { ccclass, property } = _decorator;
@ccclass('FlameThrower')
export class FlameThrower extends Component {
    @property(Node)
    layer!: Node;

    @property(Prefab)
    bullet!: Prefab;

    @property(Node)
    muzzle!: Node;

    @property({
        type: CCInteger,
        tooltip: '子弹速度（速度越大，火焰长度越长）'
    })
    speed: number = 250;
    
    @property({
        type: CCInteger,
        tooltip: '射击频率，即1s能射出多少发子弹'
    })
    rateOfFire: number = 40;

    @property({
        type: CCFloat,
        tooltip: '后坐力'
    })
    kickbackAmount: number = 0;

    @property({
        type: CCFloat,
        tooltip: '偏移角度'
    })
    angle: number = 3;
    
    // 火焰长度
    fireLength: number = 100;

    private time = 0;
    
    private bulletGroup!: ecs.Group;

    onLoad() {
        this.bulletGroup = ecs.createGroup(ecs.allOf(ECSNode, Movement, Lifetime, TagFireBullet));

        systemEvent.on(SystemEvent.EventType.MOUSE_DOWN, (event: EventMouse) => {
            event.getLocation(pos as unknown as Vec2);
            this.layer.getComponent(UITransform)!.convertToNodeSpaceAR(pos, pos);

            Vec3.subtract(gHeading, pos, this.node.position);
            gHeading.normalize();

            let angle = Math.atan2(gHeading.y, gHeading.x) * macro.DEG;
            this.node.angle = angle;
        });

        
        this.fireLength = 100 + (this.speed - 40) / (100 - 40) * (300 - 100); // 火焰长度最小100最大300
    }

    createBullet(heading: Vec3, lineHeading: Vec3, angle: number) {
        let bulletNode = ObjPool.getNode(this.bullet.data.name, this.bullet);
        bulletNode.active = true;
        bulletNode.parent = this.layer;
        bulletNode.angle = angle;
        
        this.muzzle.getComponent(UITransform)!.convertToWorldSpaceAR(Vec3.ZERO, pos);
        this.layer.getComponent(UITransform)!.convertToNodeSpaceAR(pos, pos);
        bulletNode.setPosition(pos);

        let bulletEnt = ecs.createEntityWithComps(ECSNode, Movement, Lifetime, TagFireBullet);
        bulletEnt.get(ECSNode).val = bulletNode;
        let movement = bulletEnt.get(Movement);
        Vec3.multiplyScalar(movement.velocity, heading, this.speed);
        bulletEnt.get(Lifetime).time = 3;

        pos.x += lineHeading.x * this.fireLength;
        pos.y += lineHeading.y * this.fireLength;

        bulletEnt.get(TagFireBullet).targetPoint.set(pos);
    }

    flag = 0;
    update(dt: number) {
        this.time += this.rateOfFire * dt;
        if(this.time >= 1) {
            this.time -= 1;

            let baseRad = Math.atan2(gHeading.y, gHeading.x)
            let baseAngle = baseRad * macro.DEG;

            
            this.flag = (this.flag + 1) % 3;

            let angle = baseAngle;
            angle += this.angle * (this.flag === 1 ? 1 : (this.flag === 0) ? 0 : -1);
            let rad = angle * macro.RAD;
            tmpHeading.set(Math.cos(rad), Math.sin(rad), 0);
            gHeading1.set(Math.cos(baseRad), Math.sin(baseRad), 0);
            this.createBullet(tmpHeading, gHeading1, angle);
        }

        this.bulletGroup.matchEntities.forEach(ent => {
            let node = ent.get(ECSNode).val!;
            let movement = ent.get(Movement);
            let lifeTime = ent.get(Lifetime);
            let targetPoint = ent.get(TagFireBullet).targetPoint;

            lifeTime.time -= dt;
            if(lifeTime.time <= 0) {
                ent.destroy();
                return;
            }

            Vec3.subtract(gHeading, targetPoint, node.position);
            gHeading.normalize().multiplyScalar(this.speed * 0.5);

            Vec3.add(movement.velocity, movement.velocity, gHeading);

            let length = movement.velocity.length();
            if(length > this.speed * 10) {
                movement.velocity.multiplyScalar(1 / length * this.speed * 10);
            }

            Vec3.multiplyScalar(pos, movement.velocity, dt)
            node.getPosition(pos1);
            node!.setPosition(Vec3.add(pos, pos, pos1));
        });
    }

}
