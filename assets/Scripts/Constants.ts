
export enum UI_EVENT {
    NONE = 1000,
    START_GAME,
    PLAYER_MOVE,
    PLAYER_STOP_MOVE
}

export enum AI_STATE {
    IDLE,
    MOVE_TO,
    FOLLOW,
    ATTACK
}