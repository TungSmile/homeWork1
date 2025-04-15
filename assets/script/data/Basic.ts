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
    timeAnim = 1, // defaul 1
    heightCube = 100,
    weightSlot = 127,
    weightScene = 1080
}


export enum SetupGame {
    TotalTask = 4,
    Stock = 5,
    TotalSlot = 5,
    LengthSlot = 4,
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

