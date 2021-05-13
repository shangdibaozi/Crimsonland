import { ecs } from "../../../Libs/ECS";

export class RocketSystem extends ecs.ComblockSystem {
    filter(): ecs.IMatcher {
        throw new Error("Method not implemented.");
    }


    update(entities: ecs.Entity[]): void {
        
    }


}