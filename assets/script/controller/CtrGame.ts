import { _decorator, Component, log, SpriteFrame, Vec3 } from 'cc';
import { SlotCtrl } from './SlotCtrl';
import { StockCtrl } from './StockCtrl';
import { TaskCtrl } from './TaskCtrl';
import { CubeCtrl } from './CubeCtrl';
import { DataGame } from '../data/DataGame';
import { SetupGame, typeSpecial } from '../data/Basic';
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


    sttTask: number = 0;
    dataTask = [];
    dataSlot = [];
    dataStore = [];

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

    ///
    ///
    ///

    ///
    /// func sovle with slot
    ///

    clickSlot(name: string) {
        let t = this;
        let index = t.getIndexSlot(name)
        if (t.isAnim) { return; };
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
            return false;
        }

        //list cubes move than more stack free
        if (t.StackCubePick[1] != typeSpecial.end ? 2 : 1 > countStackFree) {

        } else {
            //list cubes move same stack free
            t.dataSlot[t.SlotOne][t.StackCubePick[0]] = typeSpecial.empty;
            t.dataSlot[t.SlotTwo][countStackFree - 1] = t.typePick;
            t.Cube.findCubeByXY(t.SlotOne, t.StackCubePick[0])
            // log(t.SlotTwo, countStackFree - 1, t.Slot.getPosGateSlot(t.SlotOne), t.CPCBS(), t.Slot.getPosByXY(t.SlotTwo, countStackFree - 1), 0)
            log("toa do", t.SlotTwo, countStackFree - 1)
            t.Cube.CMFSTNS(t.SlotTwo, countStackFree - 1, t.Slot.getPosGateSlot(t.SlotOne), t.CPCBS(), t.Slot.getPosStack(t.SlotTwo, countStackFree - 1), 0)
            // action second cube
            if (t.StackCubePick[1] != typeSpecial.end) {
                t.dataSlot[t.SlotOne][t.StackCubePick[1]] = typeSpecial.empty;
                t.dataSlot[t.SlotTwo][countStackFree - 2] = t.typePick;
                t.Cube.findCubeByXY(t.SlotOne, t.StackCubePick[1])
                t.Cube.CMFSTNS(t.SlotTwo, countStackFree - 2, t.Slot.getPosGateSlot(t.SlotOne), t.Slot.getPosGateSlot(t.SlotTwo), t.Slot.getPosByXY(t.SlotTwo, countStackFree - 2), 0.5)
            }




            // check cube move can be done
            let indexCubeDone = typeSpecial.empty;
            for (let i = 0; i < t.dataSlot[t.SlotTwo].length; i++) {
                let stack = t.dataSlot[t.SlotTwo][i];
                if (stack != typeSpecial.empty &&
                    stack == t.dataSlot[t.SlotTwo][i + 1] &&
                    t.dataSlot[t.SlotTwo][i + 1] == t.dataSlot[t.SlotTwo][i + 2]) {
                    indexCubeDone = i;
                    break;
                } else {
                    break;
                }
            }
            if (indexCubeDone != typeSpecial.empty) {
                t.dataSlot[t.SlotTwo][indexCubeDone] = typeSpecial.empty;
                t.dataSlot[t.SlotTwo][indexCubeDone + 1] = typeSpecial.empty;
                t.dataSlot[t.SlotTwo][indexCubeDone + 2] = typeSpecial.empty;

            }

        }
    }











    // get index by cut element frist in name node
    getIndexSlot(name: string) {
        let index = Number(name.slice(1));
        // let type = name.slice(0, 1);
        return index;
    }


    //calculator Point Center Between Slot
    CPCBS() {
        let t = this;
        if (t.SlotOne == typeSpecial.empty && t.SlotTwo != typeSpecial.empty) {
            log("problem");
            return new Vec3
        }
        let gateTo = t.Slot.getPosGateSlot(t.SlotOne);
        let gateFrom = t.Slot.getPosGateSlot(t.SlotTwo);

        return gateTo.y >= gateFrom.y ? new Vec3(gateFrom.x, gateTo.y, 0) : new Vec3(gateTo.x, gateFrom.y, 0)

    }





    ///
    ///
    ///

    update(deltaTime: number) {

    }
}

