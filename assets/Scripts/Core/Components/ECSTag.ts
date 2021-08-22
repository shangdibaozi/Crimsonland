import { ecs } from "../../Libs/ECS";

@ecs.registerTag()
export class ECSTag {
    static Enemy: number;
    static FireBullet: number;
    static Gun: number;
    static Item: number;
    static MgBullet: number;
    static PistolBullet: number;
    static Player: number;
    static Rotate: number;
}