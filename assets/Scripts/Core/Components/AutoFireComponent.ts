import { ecs } from "../../Libs/ECS";


@ecs.register('AutoFire')
export class AutoFireComponent extends ecs.IComponent {
    searchMonster: number = -1;
    isLock: boolean = true;
    monsterEid: number = -1;
    /**
     * 是否射击过
     */
    isShooted: boolean = true;

    reset() {
        this.searchMonster = -1;
        this.monsterEid = -1;
        this.isLock = true;
        this.isShooted = true;
    }
}