import { _decorator, Component, Node, Prefab, JsonAsset, SpriteAtlas, CCString, SpriteFrame } from 'cc';
import { Global } from '../Global';
const { ccclass, property } = _decorator;

@ccclass('MonsterMgr')
export class MonsterMgr extends Component {
    @property(SpriteAtlas)
    private monsterSheet!: SpriteAtlas;

    // @property([CCString])
    // private monsterNames: string[] = [];

    private animationMap: Map<string, Map<string, SpriteFrame[]>> = new Map();

    gunCfg!: {[key: string]: GunInfo};

    onLoad() {
        Global.monsterMgr = this;
        this.initAnimationMap();
    }

    initAnimationMap() {
        let spriteFrames = this.monsterSheet.getSpriteFrames();
        spriteFrames.forEach(sp => {
            let strs = sp!.name.split('/');
            let name = strs[0];
            let motion = strs[1].split('_')[0];
            if(!this.animationMap.has(name)) {
                this.animationMap.set(name, new Map());
            }
            let motionMap = this.animationMap.get(name)!;
            if(!motionMap.has(motion)) {
                motionMap.set(motion, []);
            }
            motionMap.get(motion)!.push(sp!);
        });
        this.animationMap.forEach(motionMap => {
            motionMap.forEach(sps => {
                sps.sort((a: SpriteFrame, b: SpriteFrame) => {
                    return Number(a.name.split('_')[1]) - Number(b.name.split('_')[1]);
                });
            });
        });
    }

    onDestroy() {
        Global.monsterMgr = null;
    }
}