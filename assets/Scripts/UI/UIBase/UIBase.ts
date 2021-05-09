
import { _decorator, Component, Node, view } from 'cc';
import { UIHelper } from './UIHelper';
const { ccclass, property } = _decorator;

@ccclass('UIBase')
export class UIBase extends Component {
    private static uiHelper = new UIHelper();
    private static perfectScale = -1;

    private _hasBindUI : boolean = false;
    
    protected adapterSize() {
        if(UIBase.perfectScale === -1) {
            let resolutionSize = view.getDesignResolutionSize();
            let frameSize = view.getFrameSize();
            UIBase.perfectScale = (resolutionSize.width / resolutionSize.height) / (frameSize.width / frameSize.height);
            if (UIBase.perfectScale > 1) {
                UIBase.perfectScale = 1 / UIBase.perfectScale;
            }
            else {
                UIBase.perfectScale = 1;
            }
        }
        this.node.setScale(UIBase.perfectScale, UIBase.perfectScale, 1);
    }

    __preload() {
        this.bindUI();
    }

    bindUI() {
        if(!this._hasBindUI) {
            this._hasBindUI = true;
            UIBase.uiHelper.bindUI(this.node, this);
        }
    }

    show(...arg : any[]) {
        this.node.active = true;
    }
}
