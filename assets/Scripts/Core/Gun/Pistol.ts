
import { _decorator, Component, Node, Prefab, CCInteger, CCFloat, instantiate, v3, Vec3, lerp, systemEvent, SystemEvent, EventMouse, Vec2, UITransform, macro } from 'cc';
import { UI_EVENT } from '../../Constants';
import { Global } from '../../Global';
import { ecs } from '../../Libs/ECS';
import { Util } from '../../Util';
import { ECSNode } from '../Components/ECSNode';
import { Lifetime } from '../Components/Lifetime';
import { Movement } from '../Components/Movement';
import { ObjPool } from '../ObjPool';
const { ccclass, property, executeInEditMode, playOnFocus } = _decorator;

let pos = v3();
let pos1 = v3();
let gHeading = v3(1, 0, 0);
let tmpHeading = v3();

@ccclass('Pistol')
// @executeInEditMode
// @playOnFocus
export class Pistol extends Component {
    @property(Node)
    layer!: Node;

    @property(Prefab)
    bullet!: Prefab;

    @property(Node)
    muzzle!: Node;

    @property({
        type: CCInteger,
        tooltip: '子弹速度'
    })
    speed: number = 250;

    @property({
        type: CCInteger,
        tooltip: '射击频率，即1s能射出多少发子弹'
    })
    rateOfFire: number = 2;

    @property({
        type: CCFloat,
        tooltip: '后坐力'
    })
    kickbackAmount: number = 1;

    @property({
        type: CCFloat,
        tooltip: '偏移角度'
    })
    angle: number = 3;

    private time = 0;
    
    private bulletGroup!: ecs.Group;

    onLoad() {
        this.bulletGroup = ecs.createGroup(ecs.allOf(ECSNode, Movement, Lifetime));

        systemEvent.on(SystemEvent.EventType.MOUSE_DOWN, (event: EventMouse) => {
            event.getLocation(pos as unknown as Vec2);
            this.layer.getComponent(UITransform)!.convertToNodeSpaceAR(pos, pos);

            Vec3.subtract(gHeading, pos, this.node.position);
            gHeading.normalize();

            let angle = Math.atan2(gHeading.y, gHeading.x) * macro.DEG;
            this.node.angle = angle;
        });
    }

    onDisable() {
        
    }

    createBullet(heading: Vec3) {
        let bulletNode = ObjPool.getNode(this.bullet.data.name, this.bullet);
        bulletNode.active = true;
        bulletNode.parent = this.layer;
        
        this.muzzle.getComponent(UITransform)!.convertToWorldSpaceAR(Vec3.ZERO, pos);
        this.layer.getComponent(UITransform)!.convertToNodeSpaceAR(pos, pos);
        bulletNode.setPosition(pos);

        let bulletEnt = ecs.createEntityWithComps(ECSNode, Movement, Lifetime);
        bulletEnt.get(ECSNode).val = bulletNode;
        let movement = bulletEnt.get(Movement);
        Vec3.multiplyScalar(movement.velocity, heading, this.speed);
        bulletEnt.get(Lifetime).time = 3;
    }

    update(dt: number) {
        this.time += this.rateOfFire * dt;
        if(this.time >= 1) {
            this.time -= 1;

            let angle = Math.atan2(gHeading.y, gHeading.x) * macro.DEG;
            angle += Util.randomRange(-this.angle, this.angle);
            let rad = angle * macro.RAD;
            tmpHeading.set(Math.cos(rad), Math.sin(rad), 0);
            this.createBullet(tmpHeading);

            this.node.setPosition(this.kickbackAmount, 0, 0);
        }

        this.bulletGroup.matchEntities.forEach(ent => {
            let node = ent.get(ECSNode).val!;
            let movement = ent.get(Movement);
            let lifeTime = ent.get(Lifetime);

            lifeTime.time -= dt;
            if(lifeTime.time <= 0) {
                ent.destroy();
                return;
            }

            Vec3.multiplyScalar(pos, movement.velocity, dt)
            node.getPosition(pos1);
            node?.setPosition(Vec3.add(pos, pos, pos1));
        });

        Vec3.lerp(pos, this.node.position, Vec3.ZERO, dt * 10);
        this.node.setPosition(pos);
    }

    buleltMove(ent: ecs.Entity) {
        
    }
}
