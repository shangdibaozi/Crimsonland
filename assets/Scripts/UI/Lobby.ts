
import { _decorator, Component, Node, log, Label } from 'cc';
import { UI_EVENT } from '../Constants';
import { Global } from '../Global';
import { UIBase } from './UIBase/UIBase';
const { ccclass, property } = _decorator;

@ccclass('Lobby')
export class Lobby extends UIBase {
    _toggleNearest!: Node;
    _toggleLessBlood!: Node;
    _btnStopShoot!: Node;

    isStopShoot: boolean = false;

    onLoad() {
        this._toggleNearest.$Toggle.isChecked = true;
        this._toggleLessBlood.$Toggle.isChecked = false;

        this._toggleLessBlood.active = false; // 吃了可以看见血量的buff后才显示
    }

    start () {
        
    }
    
    on_toggleNearest() {
        log('on_btnNear');
        Global.uiEvent.emit(UI_EVENT.SHOOT_NEAR, this._toggleNearest.$Toggle);
    }

    on_toggleLessBlood() {
        log('on_btnLessBlood');
        Global.uiEvent.emit(UI_EVENT.SHOOT_LESS_BLOOD, this._toggleLessBlood.$Toggle);
    }

    on_btnChangeTarget() {
        log('on_btnChangeTarget');
        Global.uiEvent.emit(UI_EVENT.SHOOT_CHANGE_TARGET);
    }

    on_btnStopShoot() {
        this.isStopShoot = !this.isStopShoot;
        this._btnStopShoot.getComponentInChildren(Label)!.string = this.isStopShoot ? "开启设计" : "停止射击";
        Global.uiEvent.emit(UI_EVENT.SHOOT_STOP, this.isStopShoot);
    }
}