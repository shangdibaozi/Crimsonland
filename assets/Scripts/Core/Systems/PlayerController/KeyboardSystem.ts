import { EventKeyboard, macro, systemEvent, SystemEventType, Vec3 } from "cc";
import { ecs } from "../../../Libs/ECS";
import { Keyboard } from "../../Components/Keyboard";
import { Movement } from "../../Components/Movement";

export class KeyboardSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    
    keyboard!: Keyboard;
    movement!: Movement;

    init() {
        systemEvent.on(SystemEventType.KEY_DOWN, this.onKeyDown, this);
        systemEvent.on(SystemEventType.KEY_UP, this.onKeyUp, this);

    }

    filter(): ecs.IMatcher {
        return ecs.allOf(Keyboard);
    }

    entityEnter(entities: ecs.Entity[]): void {
        this.keyboard = entities[0].get(Keyboard);
        this.movement = entities[0].get(Movement);
    }

    update(entities: ecs.Entity[]): void {
        Vec3.copy(this.movement.heading, this.keyboard.getHeading());
    }

    onKeyDown(event: EventKeyboard) {
        switch(event.keyCode) {
            case macro.KEY.a: {
                this.keyboard.isADown = true;
                break;
            }
            case macro.KEY.d: {
                this.keyboard.isDDown = true;
                break;
            }
            case macro.KEY.w: {
                this.keyboard.isWDown = true;
                break;
            }
            case macro.KEY.s: {
                this.keyboard.isSDown = true;
                break;
            }
        }
    }

    onKeyUp(event: EventKeyboard) {
        switch(event.keyCode) {
            case macro.KEY.a: {
                this.keyboard.isADown = false;
                break;
            }
            case macro.KEY.d: {
                this.keyboard.isDDown = false;
                break;
            }
            case macro.KEY.w: {
                this.keyboard.isWDown = false;
                break;
            }
            case macro.KEY.s: {
                this.keyboard.isSDown = false;
                break;
            }
        }
    }
}