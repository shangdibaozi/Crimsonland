
export enum UI_EVENT {
    NONE = 1000,
    START_GAME,
    PLAYER_MOVE,
    PLAYER_STOP_MOVE,
    SHOOT_NEAR,
    SHOOT_LESS_BLOOD,
    SHOOT_LOCK
}

export enum AI_STATE {
    IDLE,
    MOVE_TO,
    FOLLOW,
    ATTACK
}

export const ITEM_COLLISION_RADIUS = 20;