
import { _decorator, Component, Node, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIBase')
export class UIBase extends Component {

    private static perfectScale = -1;
    
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
}
