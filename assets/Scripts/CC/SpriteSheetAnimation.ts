
import { _decorator, Component, Animation, Sprite, SpriteFrame, CCInteger, CCFloat, CCBoolean, log, rect, AnimationClip, macro, misc } from 'cc';
const { ccclass, property, executeInEditMode, requireComponent } = _decorator;

@ccclass('SpriteSheetAnimation')
@requireComponent(Sprite)
@executeInEditMode
export class SpriteSheetAnimation extends Component {
    @property(SpriteFrame)
    spriteSheet!: SpriteFrame;

    @property(CCInteger)
    row: number = 1;

    @property(CCInteger)
    col: number = 1;

    @property(CCFloat)
    sample!: number;

    @property(CCBoolean)
    isLoop: boolean = false;

    spriteFrames!: SpriteFrame[];

    sprite!: Sprite;

    onLoad() {
        this.sprite = this.getComponent(Sprite)!;
        this.spriteFrames = new Array<SpriteFrame>(this.row * this.col);

        let width = this.spriteSheet.width / this.col;
        let height = this.spriteSheet.height / this.row;
        console.log(width, height);
        let sp: SpriteFrame;
        for(let i = 0, k = 0; i < this.col; i++) {
            for(let j = 0; j < this.row; j++) {
                sp = new SpriteFrame();
                sp.texture = this.spriteSheet.texture;
                sp.rect = rect(i * width, j * height, width, height);
                
                sp.offset.x = i * width;
                sp.offset.y = j * height
                this.spriteFrames[k++] = sp;
            }
        }
        
        this.sprite.spriteFrame = this.spriteFrames[0];

        let clip = AnimationClip.createWithSpriteFrames(this.spriteFrames, this.sample)!;
        clip.isDefault = true;
        clip.wrapMode = AnimationClip.WrapMode.Loop;
        
        let animation = this.node.addComponent(Animation);
        animation.createState(clip, 'attack');
        animation.play('attack');
        
    }

    update(dt: number) {

    }
}