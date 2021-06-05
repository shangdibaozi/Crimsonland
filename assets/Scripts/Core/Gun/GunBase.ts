import { _decorator, Component, CCBoolean } from "cc";

const { ccclass, property } = _decorator;
@ccclass('GunBase')
export class GunBase extends Component {
    @property(CCBoolean)
    isDebug: boolean = false;
}