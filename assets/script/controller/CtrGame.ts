import { _decorator, Component, log, SpriteFrame, Vec3, Node, AudioSource, AudioClip } from 'cc';
import { SlotCtrl } from './SlotCtrl';
import { StockCtrl } from './StockCtrl';
import { TaskCtrl } from './TaskCtrl';
import { CubeCtrl } from './CubeCtrl';
import { DataGame } from '../data/DataGame';
import { caseSound, Configute, idX, linkStore, SetupGame, typeSpecial } from '../data/Basic';
import super_html_playable from '../plugin/super_html_playable';
import { StoreCtrl } from './StoreCtrl';
const { ccclass, property } = _decorator;

@ccclass('CtrGame')
export class CtrGame extends Component {

    @property({ type: [SpriteFrame] })
    listImgCube: SpriteFrame[] = [];
    @property({ type: [AudioClip] })
    listSound: AudioClip[] = [];

    @property({ type: SlotCtrl })
    Slot: SlotCtrl = null;
    @property({ type: StockCtrl })
    Stock: StockCtrl = null;
    @property({ type: TaskCtrl })
    Task: TaskCtrl = null;
    @property({ type: CubeCtrl })
    Cube: CubeCtrl = null;
    @property({ type: StoreCtrl })
    Store: StoreCtrl = null;

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

    endGame: boolean = true;

    start() {
        let t = this;
        t.node.on("pickSlot", t.clickSlot, t);
        t.node.on("doneSlot", t.CDP, t);
        t.node.on("sound", t.CS, t)
        t.node.on("endGame", t.CCWOLG, t)
        t.createTask();
        t.createSlot();
        t.createCube();
        t.createStock();
        t.createStore();
        super_html_playable.set_google_play_url(linkStore.android);
        super_html_playable.set_app_store_url(linkStore.ios);
        t.schedule(() => {
            t.CCWOLG()
        }, Configute.timeAnim)
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

    createStore() {
        let t = this;
        t.Store.createStore();
        t.dataStore = [...DataGame.instance.scriptStore];
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
                t.ASD()
                // clean data for test
                t.ACD();
                t.CDP();
                log("case 4")
            } else {
                // cube cant move
                t.ACD();
                t.CDP();
                log("case 5")
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
            log(t.dataTask, "check task", t.sttTask, DataGame.instance.countTaskDone)
            for (let i = 0; i < t.dataTask.length; i++) {
                if (t.dataTask[i] == t.typePick) {
                    t.Cube.ACTT(t.SlotTwo
                        , indexCubeDone + 1
                        , t.Task.getPosTaskByIndex(i)
                        , Configute.timeAnim
                        , timeWaitAnim);
                    timeWaitAnim += Configute.timeAnim;
                    let typeNew = DataGame.instance.scriptTask[t.sttTask];
                    if (typeNew != undefined) {
                        t.Task.resetTask(i, typeNew, Configute.timeAnim, timeWaitAnim);
                        t.dataTask[i] = typeNew;
                        timeWaitAnim += Configute.timeAnim;
                        t.sttTask++;
                        t.WHTCS(i, typeNew, timeWaitAnim);
                    } else {
                        t.Task.closeTask(i, Configute.timeAnim, timeWaitAnim);
                        t.dataTask[i] = typeSpecial.end;
                    }
                    timeWaitAnim += Configute.timeAnim;
                    t.scheduleOnce(() => {
                        DataGame.instance.isAnim = false
                    }, timeWaitAnim);
                    if (t.CATD()) {
                        DataGame.instance.isAnim = true;
                        DataGame.instance.endGame = true;
                        DataGame.instance.isWin = true;
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
                DataGame.instance.isAnim = true;
                DataGame.instance.endGame = true;
                DataGame.instance.isWin = false;
                t.scheduleOnce(() => {
                    t.Ads.active = true
                }, timeWaitAnim)
            }
        }
        t.CCWOLG();
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
    WHTCS(indexTask: number, type: number, wait: number) {
        let t = this;
        for (let i = 0; i < t.dataStock.length; i++) {
            let e = t.dataStock[i];
            if (e == type) {
                t.Cube.findCubeByXY(idX.stock, i);
                t.Cube.ACISTT(t.Task.getPosTaskByIndex(indexTask), Configute.timeAnim / 2, wait);
                t.dataStock[i] = typeSpecial.empty;
                let valueNext = DataGame.instance.scriptTask[t.sttTask];
                if (valueNext != undefined) {
                    t.sttTask++;
                    t.scheduleOnce(() => {
                        t.dataTask[indexTask] = valueNext;
                        t.Task.resetTask(indexTask, valueNext, Configute.timeAnim, Configute.timeAnim / 2);
                        t.WHTCS(indexTask, valueNext, Configute.timeAnim + Configute.timeAnim / 2)
                    }, wait + Configute.timeAnim / 2);
                    break;
                } else {
                    t.scheduleOnce(() => {
                        t.dataTask[indexTask] = typeSpecial.end;
                        t.Task.closeTask(indexTask, Configute.timeAnim, 0);
                    }, wait + Configute.timeAnim / 2);
                }
            }
        }
        log(t.dataTask, "data àter")
    }

    /// func for slot

    // animation slot done
    ASD() {
        let t = this;
        for (let i = 0; i < t.dataSlot[t.SlotTwo].length; i++) {
            if (t.dataSlot[t.SlotTwo][i] != typeSpecial.empty) {
                return
            }
        }
        t.dataSlot[t.SlotTwo] = new Array(t.dataSlot[t.SlotTwo].length).fill(typeSpecial.end)
        t.Slot.doneSlot(t.SlotTwo, Configute.timeAnim, Configute.timeAnim * 2);
    }

    /// event ui


    // check case win or lose game

    CCWOLG() {
        let t = this;
        if (DataGame.instance.endGame && t.endGame) {
            t.endGame = false;
            t.scheduleOnce(() => {
                t.Ads.active = DataGame.instance.endGame;
                t.Ads.getChildByName("win").active = DataGame.instance.isWin;
                t.Ads.getChildByName("lose").active = !DataGame.instance.isWin;
            }, Configute.timeAnim * 4)
        }

    }

    // controll sound
    CS(sttCase: number, vol: number = 1) {
        let t = this;
        let as = t.node.getComponent(AudioSource);
        as.stop();
        as.clip = t.listSound[sttCase]
        as.volume = vol;
        as.play();
    }

    openAdUrl() {
        super_html_playable.download();
    }

    update(deltaTime: number) {

    }
}

