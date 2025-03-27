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
    timeAnim = 1,
    heightCube = 100,
    weightSlot = 127,
    weightScene = 1080
}


export enum SetupGame {
    TotalTask = 4,
    Stock = 5,
    TotalSlot = 5,
    LengthSlot = 3,
    TotalStore = 1
}


export enum statusTouch {
    Indle = 1,
    LoadTo = 2,
    LoadFrom = 3,
    Cancel = 4


}

