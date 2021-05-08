import { v3, Vec3, } from "cc";
import { ecs } from "../../Libs/ECS";

const A_DOWN = 1 << 0;
const D_DOWN = 1 << 1;
const W_DOWN = 1 << 2;
const S_DOWN = 1 << 3;

const LEFT = v3(-1, 0, 0);
const RIGHT = v3(1, 0, 0);
const UP = v3(0, 1, 0);
const DOWN = v3(0, -1, 0);
const LEFT_UP = v3(-Math.SQRT1_2, Math.SQRT1_2, 0);
const RIGHT_UP = v3(Math.SQRT1_2, Math.SQRT1_2, 0);
const LEFT_DOWN = v3(-Math.SQRT1_2, -Math.SQRT1_2, 0);
const RIGHT_DOWN = v3(Math.SQRT1_2, -Math.SQRT1_2, 0);

const DIR2HEADING: {[key: string]: Vec3} = {
    1: LEFT,
    2: RIGHT,
    4: UP,
    8: DOWN,
    5: LEFT_UP,
    9: LEFT_DOWN,
    6: RIGHT_UP,
    10: RIGHT_DOWN
};

@ecs.register('Keyboard')
export class Keyboard extends ecs.IComponent {
    state: number = 0;
    private lastState: number = 0;

    get isADown() {
        return !!(this.state & 1);
    }
    set isADown(val: boolean) {
        if(val) {
            this.state |= A_DOWN;
        }
        else { 
            this.state &= ~A_DOWN;
        }
    }
    
    get isDDown() {
        return !!(this.state & 1);
    }
    set isDDown(val: boolean) {
        if(val) {
            this.state |= D_DOWN;
        }
        else { 
            this.state &= ~D_DOWN;
        }
    }

    get isWDown() {
        return !!(this.state & 1);
    }
    set isWDown(val: boolean) {
        if(val) {
            this.state |= W_DOWN;
        }
        else { 
            this.state &= ~W_DOWN;
        }
    }

    get isSDown() {
        return !!(this.state & 1);
    }
    set isSDown(val: boolean) {
        if(val) {
            this.state |= S_DOWN;
        }
        else { 
            this.state &= ~S_DOWN;
        }
    }

    getHeading(): Vec3 {
        if(this.state in DIR2HEADING) {
            this.lastState = this.state;
            return DIR2HEADING[this.state];
        }
        else if(this.lastState in DIR2HEADING) {
            return DIR2HEADING[this.lastState];
        }
        return Vec3.ZERO;
    }

    reset() {
        this.lastState = 0;
        this.state = 0;
    }
}