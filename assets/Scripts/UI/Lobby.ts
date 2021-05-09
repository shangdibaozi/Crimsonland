
import { _decorator, Component, Node, log } from 'cc';
import { UI_EVENT } from '../Constants';
import { Global } from '../Global';
import { UIBase } from './UIBase/UIBase';
const { ccclass, property } = _decorator;

@ccclass('Lobby')
export class Lobby extends UIBase {
    _toggleNearest!: Node;
    _toggleLessBlood!: Node;
    _toggleLock!: Node;

    onLoad() {
        this._toggleNearest.$Toggle.isChecked = true;
        this._toggleLessBlood.$Toggle.isChecked = false;
        this._toggleLock.$Toggle.isChecked = false;
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

    on_toggleLock() {
        log('on_btnNearAndLessBlood');
        Global.uiEvent.emit(UI_EVENT.SHOOT_LOCK);
    }
}