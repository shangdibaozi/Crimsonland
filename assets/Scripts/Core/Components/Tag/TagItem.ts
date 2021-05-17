import { ecs } from "../../../Libs/ECS";

@ecs.register('TagItem')
export class TagItem extends ecs.IComponent {
    tableId: number = -1;

    reset() {
        this.tableId = -1;        
    }
}