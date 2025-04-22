import { Vec3 } from "cc";

export enum TypeKeeper {
    NoHold = -1,
    Slot = 0,
    Stock = 1,
    Store = 2,
}

export enum statusCube {
    NoMove = -1,
    SlotToSlot = 0,
    SlotToTask = 1,
    SlotToStock = 2,
    StockToTask = 3,
    StoreToSlot = 4,
}

export enum Configute {
    timeAnim = 0.5
    , // defaul 1
    heightCube = 100,
    weightSlot = 127,
    weightScene = 1080
}


export enum SetupGame {
    TotalTask = 2,
    Stock = 5,
    TotalSlot = 7,
    LengthSlot = 3,
    TotalStore = 1,
    ConditionDone = 3
}


export enum statusTouch {
    Indle = 1,
    LoadTo = 2,
    LoadFrom = 3,
    Cancel = 4
}

export enum typeSpecial {
    empty = -1,
    end = -2
}

export enum colorCube {
    Orange = 0,
    Black = 1,
    Red = 2,
    Violet = 3,
    Pink = 4,
    Yellow = 5,
    Gray = 6,
    Blue = 7,
    LightBlue = 8,
    Green = 9
}

export enum idX {
    vtr = -4,
    task = -3,
    stock = -2,
    store = -1
}

export enum pairOfAngles90 {  // obj *90
    notBelong = -2,
    up = -1,
    right = 2,
    down = 1,
    left = 0
}

export enum CodeHexColor {
    Orange = "#EE6A33A3",
    Black = "#545454A3",
    Red = "#C30109A3",
    Violet = "#DF286FA3",
    Pink = "#B523D7",
    Yellow = "#FBBC2A",
    Gray = "#B2B2B2",
    Blue = "#0845CF",
    LightBlue = "#22B4FF",
    Green = "#64DE5D"
};

export enum ConditionEndGame {
    TaskDone = 6,
    CubeDone = 18,
    StockNotFree = 4,
    TaskFree = 4,
    SlotDone = 6,
}

export enum linkStore {
    android = "https://play.google.com/store/apps/details?id=com.gplay.wood.blocks.color.sort",
    ios = "https://play.google.com/store/apps/details?id=com.gplay.wood.blocks.color.sort",
    defaul = "https://play.google.com/store/apps/details?id=com.gplay.wood.blocks.color.sort"
}

export enum caseSound {
    Tap = 0,
    Drop1 = 1,
    Drop2 = 2,
    Drop3 = 3,
    DoneTask = 4,
    CombineCube = 5
}
