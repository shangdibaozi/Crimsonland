
export enum UI_EVENT {
    NONE = 1000,
    START_GAME,
    PLAYER_MOVE,
    PLAYER_STOP_MOVE,
    SHOOT_NEAR,
    SHOOT_LESS_BLOOD,
    SHOOT_CHANGE_TARGET
}

export enum AI_STATE {
    NONE,
    IDLE,
    MOVE_TO,
    FOLLOW,
    ATTACK,
    WAIT,
    TAKE_HIT,
    TAKE_HITING,
    TAKE_HIT_OVER,
}

export enum PhysicsGroup {
    DEFAULT = 1 << 0,
    Player_Attack = 1 << 1,
    Enemy_Body = 1 << 2,
    Player_Body = 1 << 3,
    Enemy_Attack = 1 << 4,
    Ground_Item = 1 << 5
}
