import { _decorator, Component, log, SpriteFrame, Vec3, Node } from 'cc';
import { SlotCtrl } from './SlotCtrl';
import { StockCtrl } from './StockCtrl';
import { TaskCtrl } from './TaskCtrl';
import { CubeCtrl } from './CubeCtrl';
import { DataGame } from '../data/DataGame';
import { Configute, idX, SetupGame, typeSpecial } from '../data/Basic';
const { ccclass, property } = _decorator;

@ccclass('CtrGame')
export class CtrGame extends Component {

    @property({ type: [SpriteFrame] })
    listImgCube: SpriteFrame[] = [];

    @property({ type: SlotCtrl })
    Slot: SlotCtrl = null;
    @property({ type: StockCtrl })
    Stock: StockCtrl = null;
    @property({ type: TaskCtrl })
    Task: TaskCtrl = null;
    @property({ type: CubeCtrl })
    Cube: CubeCtrl = null;


    @property(Node)
    Ads: Node = null;


    sttTask: number = 0;
    dataTask = [];
    dataSlot = [];
    dataStore = [];
    dataStock = [];

    SlotOne: number = typeSpecial.empty;
    SlotTwo: number = typeSpecial.empty;

    typePick: number = typeSpecial.end;
    StackCubePick = []

    isAnim: boolean = false;

    start() {
        let t = this;
        t.node.on("pickSlot", t.clickSlot, t);
        t.node.on("doneSlot", t.CDP, t);
        t.createTask();
        t.createSlot();
        t.createCube();
        t.createStock();
    }


    /// contructor

    createCube() {
        let t = this;
        for (let x = 0; x < t.dataSlot.length; x++) {
            let slot = t.dataSlot[x];
            for (let y = slot.length - 1; y >= 0; y--) {
                let stack = slot[y];
                if (stack > typeSpecial.empty) {
                    t.Cube.createNewCube(x, y, t.Slot.getPosStack(x, y), t.listImgCube[stack], true);
                }
            }
        }

    }

    createTask() {
        let t = this;
        t.dataTask = DataGame.instance.scriptTask.slice(0, SetupGame.TotalTask);
        t.sttTask = SetupGame.TotalTask;
        t.Task.getData({ data: t.dataTask, numTask: SetupGame.TotalTask })
        t.Task.createTask()

    }

    createSlot() {
        let t = this;
        t.Slot.setData({ quantity: SetupGame.TotalSlot, mapPos: DataGame.instance.mapSlot })
        t.Slot.createSlot();

        // case refence not yet fix
        t.dataSlot = [...DataGame.instance.scriptSlot];

    }

    createStock() {
        let t = this;
        t.dataStock = t.Stock.setupData();
    }




    ///
    ///
    ///

    ///
    /// func sovle with slot
    ///

    clickSlot(name: string) {
        let t = this;
        let index = t.getIndexSlot(name)
        if (DataGame.instance.isAnim) { return; };
        if (t.SlotOne == typeSpecial.empty) {
            // chon cai dau
            t.SlotOne = index;
            t.PACHSTN(index);
            t.ACP();
            log("case 1")
            return;
        }

        if (t.SlotOne == index) {
            // double click 
            t.ACD();
            t.CDP();
            log("case 2")
            return;
        }

        if (t.SlotOne != typeSpecial.empty && t.SlotTwo == typeSpecial.empty) {
            // pick slot for point end of cube moved
            t.SlotTwo = index;
            log("case 3")
            if (t.AMCWS()) {
                // clean data for test
                t.ACD();
                t.CDP();
                log("cube move")
            } else {
                // cube cant move
                t.ACD();
                t.CDP();
                log("case 4")
                return;
            }

        }

        if (false) {
            // case with pick isnt slot (store)
        }


    }



    /// pick all cube has same type nearest 
    PACHSTN(indexSlot: number) {
        let t = this;
        for (let i = 0; i < t.dataSlot[indexSlot].length; i++) {
            let stack = t.dataSlot[indexSlot][i];
            if (stack > typeSpecial.empty) {
                if (i == 0) {
                    log("slot full cube");
                }
                t.typePick = stack;
                t.StackCubePick[0] = i;
                t.StackCubePick[1] = stack == t.dataSlot[indexSlot][i + 1] ? i + 1 : typeSpecial.end;
                return;
            }
        }
        t.typePick = typeSpecial.empty;
        t.StackCubePick[0] = t.dataSlot[indexSlot].length - 1;
        t.StackCubePick[1] = typeSpecial.end;
        log("slot empty")
    }

    // clean data pick
    CDP() {
        let t = this;
        t.StackCubePick[0] = typeSpecial.end;
        t.StackCubePick[1] = typeSpecial.end;
        t.typePick = typeSpecial.end;
        t.SlotOne = typeSpecial.empty;
        t.SlotTwo = typeSpecial.empty;
    }

    // animation Cube When picked 
    ACP() {
        let t = this;
        t.StackCubePick.forEach(e => {
            if (e != typeSpecial.end && e != typeSpecial.empty) {
                t.Cube.AWCP(t.SlotOne, e);

            }
        })
    }

    // animation Cube When drop 
    ACD() {
        let t = this;
        t.StackCubePick.forEach(e => {
            if (e != typeSpecial.end && e != typeSpecial.empty) {
                t.Cube.AWCD(t.SlotOne, e);

            }
        })
    }



    // animation cube move with Slot
    AMCWS() {
        let t = this;
        let countStackFree: number = 0;

        for (let i = 0; i < t.dataSlot[t.SlotTwo].length; i++) {
            let stack = t.dataSlot[t.SlotTwo][i];
            if (stack != typeSpecial.end) {
                if (stack == typeSpecial.empty) {
                    countStackFree++;
                }
            } else {
                return false;
            }
        }





        // check new slot enuogh 
        if (countStackFree <= 0) {
            log("case 5a")
            return false;
        }

        //  not same type pick
        if (countStackFree < t.dataSlot[t.SlotTwo].length && t.dataSlot[t.SlotTwo][countStackFree] != t.typePick) {
            log("case 5b")
            return false;
        }


        let timeWaitAnim: number = 0;
        DataGame.instance.isAnim = true;
        //list cubes move than more stack free
        let tempA = t.StackCubePick[1] != typeSpecial.end ? 2 : 1
        if (tempA > countStackFree) {
            // case new stock has 1 but pick 2 (true logic)
            t.dataSlot[t.SlotOne][t.StackCubePick[0]] = typeSpecial.empty;
            t.dataSlot[t.SlotTwo][countStackFree - 1] = t.typePick;
            t.Cube.findCubeByXY(t.SlotOne, t.StackCubePick[0]);
            t.Cube.CMFSTNS(t.SlotTwo, countStackFree - 1, t.Slot.getPosGateSlot(t.SlotOne), t.Slot.getPosGateSlot(t.SlotTwo), t.Slot.getPosStack(t.SlotTwo, countStackFree - 1), Configute.timeAnim * 1.5, 0)
            t.Cube.AWCD(t.SlotOne, t.StackCubePick[1]);
        } else {
            //list cubes move same stack free
            t.dataSlot[t.SlotOne][t.StackCubePick[0]] = typeSpecial.empty;
            t.dataSlot[t.SlotTwo][countStackFree - 1] = t.typePick;
            t.Cube.findCubeByXY(t.SlotOne, t.StackCubePick[0]);
            t.Cube.CMFSTNS(t.SlotTwo, countStackFree - 1, t.Slot.getPosGateSlot(t.SlotOne), t.Slot.getPosGateSlot(t.SlotTwo), t.Slot.getPosStack(t.SlotTwo, countStackFree - 1), Configute.timeAnim * 1.5, 0)
            // action second cube
            if (tempA == 2) {
                t.dataSlot[t.SlotOne][t.StackCubePick[1]] = typeSpecial.empty;
                t.dataSlot[t.SlotTwo][countStackFree - 2] = t.typePick;
                t.Cube.findCubeByXY(t.SlotOne, t.StackCubePick[1]);
                t.Cube.CMFSTNS(t.SlotTwo, countStackFree - 2, t.Slot.getPosGateSlot(t.SlotOne), t.Slot.getPosGateSlot(t.SlotTwo), t.Slot.getPosStack(t.SlotTwo, countStackFree - 2), Configute.timeAnim * 1.5, Configute.timeAnim / 5);
                timeWaitAnim += Configute.timeAnim / 5;
            }
        }
        timeWaitAnim += Configute.timeAnim * 1.5;
        // check cube move can be done
        let indexCubeDone = typeSpecial.empty;
        for (let i = 0; i < t.dataSlot[t.SlotTwo].length; i++) {
            let stack = t.dataSlot[t.SlotTwo][i];
            if (stack != typeSpecial.empty) {
                if (stack == t.dataSlot[t.SlotTwo][i + 1] &&
                    t.dataSlot[t.SlotTwo][i + 1] == t.dataSlot[t.SlotTwo][i + 2]) {
                    indexCubeDone = i;
                }
                break;
            }
        }
        if (indexCubeDone != typeSpecial.empty) {
            t.dataSlot[t.SlotTwo][indexCubeDone] = typeSpecial.empty;
            t.dataSlot[t.SlotTwo][indexCubeDone + 1] = typeSpecial.empty;
            t.dataSlot[t.SlotTwo][indexCubeDone + 2] = typeSpecial.empty;
            t.Cube.AJTCTC(t.SlotTwo, indexCubeDone + 1, Configute.timeAnim / 2, timeWaitAnim)
            timeWaitAnim = timeWaitAnim + Configute.timeAnim / 2; // 1.8+0.5 ,1.5+0.5
            for (let i = 0; i < t.dataTask.length; i++) {
                if (t.dataTask[i] == t.typePick) {
                    let sttTask = "T" + i;
                    t.Cube.ACTT(t.SlotTwo
                        , indexCubeDone + 1
                        , t.Task.getPosTaskByName(sttTask)
                        , Configute.timeAnim
                        , timeWaitAnim);
                    timeWaitAnim += Configute.timeAnim;
                    // let typeNew = DataGame.instance.scriptTask[t.sttTask];
                    if (DataGame.instance.scriptTask.length > t.sttTask) {
                        t.Task.resetTask(sttTask, DataGame.instance.scriptTask[t.sttTask], Configute.timeAnim, timeWaitAnim);
                        t.dataTask[i] = DataGame.instance.scriptTask[t.sttTask];
                        t.WHTCS(i, sttTask, DataGame.instance.scriptTask[t.sttTask], timeWaitAnim);
                        t.sttTask++;
                    } else {
                        t.Task.closeTask(sttTask, Configute.timeAnim, timeWaitAnim);
                        t.dataTask[i] = typeSpecial.end;
                    }
                    timeWaitAnim += Configute.timeAnim;
                    t.scheduleOnce(() => {
                        DataGame.instance.isAnim = false
                    }, timeWaitAnim);
                    //
                    // add more case after reset task  has task same type stock
                    //


                    if (t.CATD()) {
                        DataGame.instance.isAnim = true
                        t.scheduleOnce(() => {
                            t.Ads.active = true;
                        }, Configute.timeAnim * 4)
                    }


                    return true;
                }
            }
            let checkStock = t.Stock.checkFreeStock()
            if (checkStock) {
                let pos = t.Stock.getPosFreeStock();
                let index = t.Stock.getIndexFreeStock();
                t.Cube.findCubeByXY(t.SlotTwo, indexCubeDone + 1);
                t.Cube.ACTS(idX.stock, index, pos, Configute.timeAnim / 2, timeWaitAnim);
                t.dataStock[index] = t.typePick;
                timeWaitAnim += Configute.timeAnim / 2
            } else {
                DataGame.instance.isAnim = true
                t.scheduleOnce(() => {
                    t.Ads.active = true
                }, Configute.timeAnim * 4)
            }
        }
        t.scheduleOnce(() => {
            DataGame.instance.isAnim = false;

        }, timeWaitAnim)

        return true;
    }



    // check all task done
    CATD() {
        let t = this;
        for (let i = 0; i < t.dataTask.length; i++) {
            if (t.dataTask[i] != typeSpecial.end) {
                return false;
            }
        }
        return true;
    }



    // get index by cut element frist in name node
    getIndexSlot(name: string) {
        let index = Number(name.slice(1));
        // let type = name.slice(0, 1);
        return index;
    }

    //calculator Point Center Between Slot
    // useless
    CPCBS() {
        let t = this;
        if (t.SlotOne == typeSpecial.empty && t.SlotTwo != typeSpecial.empty) {
            log("problem");
            return new Vec3
        }
        let gateTo = t.Slot.getPosGateSlot(t.SlotOne);
        let gateFrom = t.Slot.getPosGateSlot(t.SlotTwo);
        return gateTo.y >= gateFrom.y ? new Vec3(gateFrom.x, gateTo.y, 0) : new Vec3(gateTo.x, gateFrom.y, 0);
    }

    ///
    ///
    ///



    /// func for stock

    //when has new task check stock has same type
    WHTCS(indexTask: number, nameTask: string, type: number, wait: number) {
        let t = this;
        log("???")
        // t.sttTask++;
        for (let i = 0; i < t.dataStock.length; i++) {
            let e = t.dataStock[i];
            if (e == type) {
                t.Cube.findCubeByXY(idX.stock, e);
                t.Cube.ACISTT(t.Task.getPosTaskByName(nameTask), Configute.timeAnim / 2, wait);
                t.dataStock[i] = typeSpecial.empty;
                if (DataGame.instance.scriptTask.length > t.sttTask) {
                    t.scheduleOnce(() => {
                        t.Task.resetTask(nameTask, DataGame.instance.scriptTask[t.sttTask], Configute.timeAnim, Configute.timeAnim / 2);
                        t.WHTCS(indexTask, nameTask, DataGame.instance.scriptTask[t.sttTask], Configute.timeAnim);
                        t.sttTask++
                        log('ca3');
                    }, wait + Configute.timeAnim / 2)
                    t.dataTask[indexTask] = DataGame.instance.scriptTask[t.sttTask];
                } else {
                    t.scheduleOnce(() => {
                        t.Task.closeTask(nameTask, Configute.timeAnim, 0);
                        log('ca4');
                    }, wait + Configute.timeAnim / 2)
                    t.dataTask[indexTask] = typeSpecial.end;

                }




            }
        }
        // if (check) {
        //     // log(t.sttTask, 'check num task')
        //     // let temp = t.sttTask + 1;
        //     if (DataGame.instance.scriptTask.length > t.sttTask) {
        //         t.scheduleOnce(() => {
        //             t.sttTask++;
        //             t.Task.resetTask(nameTask, DataGame.instance.scriptTask[t.sttTask], Configute.timeAnim, 0);
        //             t.WHTCS(indexTask, nameTask, DataGame.instance.scriptTask[t.sttTask], Configute.timeAnim);
        //             log('casea3');
        //         }, wait + Configute.timeAnim / 2)
        //         t.dataTask[indexTask] = DataGame.instance.scriptTask[t.sttTask];
        //         // t.WHTCS(indexTask, nameTask, DataGame.instance.scriptTask[t.sttTask], wait + Configute.timeAnim / 2 + Configute.timeAnim)
        //     } else {
        //         t.scheduleOnce(() => {
        //             t.Task.closeTask(nameTask, Configute.timeAnim, 0);
        //             log('caseb');
        //         }, wait + Configute.timeAnim / 2)
        //         t.dataTask[indexTask] = typeSpecial.end;

        //     }
        // }
    }




    update(deltaTime: number) {

    }
}

