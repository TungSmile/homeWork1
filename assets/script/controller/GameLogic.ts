import { _decorator, Camera, Component, geometry, instantiate, log, Node, PhysicsSystem, Prefab, SpriteFrame, tween, Vec3 } from 'cc';
import { SlotCtrl } from './SlotCtrl';
import { StockCtrl } from './StockCtrl';
import { TaskCtrl } from './TaskCtrl';
import { ItemCube } from '../model/ItemCube';
import { DataGame } from '../data/DataGame';
import { Configute, SetupGame, statusTouch, TypeKeeper, typeSpecial } from '../data/Basic';
import { CubeCtrl } from './CubeCtrl';
const { ccclass, property } = _decorator;

@ccclass('GameLogic')
export class GameLogic extends Component {

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


    // placeTo = null;
    // placeFrom = null;

    listIndexCubesPick = [];
    typeCubePick: number = typeSpecial.empty;
    dataTask = [];
    dataSlot = [];
    dataStore = [];
    sttTaskScript: number = 0;

    oneTouch: string = null;
    twoTouch: string = null;

    isAnim: boolean = false;




    // logic game all sovle in script here

    // cube init in slot hold
    // cube move : 
    // - slot to task  (destroy cube, reload new task)  
    // - slot to slot ( click every where slot alway pick first element in slot) ==> event touch on slot , not in cube
    // - slot to stock (check stock have free space ,true => create stock and cube destroy  ,fail => event end game,go to ggstore )
    // - stock to task (happen when reload new task, create free space in stock , destroy task => action if new task has ssame type stock)
    // - store to slot (diffirent type store :1 ...,2 cave =reload pre cube in store , cube add in slot )  

    // event touch
    // pick 2 place : slot and store 
    // drop 1 place : slot 

    // móa all slock when check , use reverse browsing




    // getIDFreeStackByIdSlot(id: number) {
    //     let t = this;
    //     let slot = t.dataSlot[id];
    //     let rs = -1;
    //     for (let i = 0; i < slot.length; i++) {
    //         let e = slot[i];
    //         if (e == -1) {
    //             rs = i;
    //         } else {
    //             return rs;
    //         }
    //     }
    //     return rs;
    // }

    // // type=-1 is find free stack
    // getAllCubeSameTypeInASlot(id: number, type: number) {
    //     let t = this;
    //     let slot = t.dataSlot[id];
    //     let rs = -1;
    //     for (let i = slot.length - 1; i >= 0; i--) {
    //         let e = slot[i];
    //         if (e == type) {
    //             rs = i;
    //         } else {
    //             return rs;
    //         }
    //     }
    //     return rs;
    // }






    start() {
        let t = this;
        t.node.on("pickSlot", t.pickSlot, t);
        t.node.on("doneSlot", t.cancelPick, t);
        t.createTask()
        t.createSlot();
        t.createCube();
    }

    createCube() {
        let t = this;
        for (let i = 0; i < DataGame.instance.scriptSlot.length; i++) {
            // let tempSlot = []
            let slot = DataGame.instance.scriptSlot[i];
            for (let j = 0; j < slot.length; j++) {
                let stack = slot[j];
                if (stack > typeSpecial.empty) {
                    // tempSlot.push({ name: "C" + DataGame.instance.countCube, type: stack });
                    let pos = t.Slot.getPosByXY(i, j);
                    let index = slot.length - j; // duyet nguoc
                    t.Cube.createCube(stack, pos, t.listImgCube[stack], "S" + i, j)
                } else {
                    // tempSlot.push({ name: "0", type: stack })
                }
            }
        }

    }

    createTask() {
        let t = this;
        t.dataTask = DataGame.instance.scriptTask.slice(0, SetupGame.TotalTask);
        t.sttTaskScript = SetupGame.TotalTask;
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

    pickSlot(nameSlot: string) {
        let t = this;
        // touch frist time to pick slot
        log("Slot", nameSlot);
        if (t.isAnim) { return }
        if (t.oneTouch == null) {
            t.oneTouch = nameSlot;
            // check cube in frist element
            // light on cube 
            let indexSlotPick = t.readNameCustoms(nameSlot);
            t.typeCubePick = t.getTypeCubefristBySlot(indexSlotPick);
            t.listIndexCubesPick = t.getAllCubeBYSlotAndType(indexSlotPick, t.typeCubePick);
            t.turnLightListCube(true);
            log(t.typeCubePick, t.listIndexCubesPick, "case touch1")
            return
        }
        // touch duoble to 1 slot for cancle
        if (t.oneTouch == nameSlot) {
            t.cancelPick()
            log("case touch 2")
            return
        }
        // touch second time to drop
        if (t.oneTouch && t.twoTouch == null) {
            t.isAnim = true;
            t.twoTouch = nameSlot;
            let indexSlotDrop = t.readNameCustoms(nameSlot);
            let typeDrop = t.getTypeCubefristBySlot(indexSlotDrop);
            if (typeDrop == typeSpecial.empty) {
                // case for slot drop empty
                t.tranferDataSlot(t.readNameCustoms(t.oneTouch), indexSlotDrop, t.typeCubePick, t.listIndexCubesPick.length)
                log(t.dataSlot, "how about data1")
                return
            }
            if (t.typeCubePick == typeDrop) {
                // let cubesDrop = t.getAllCubeBYSlotAndType(indexSlotDrop, typeDrop);
                if (t.listIndexCubesPick.length <= t.countFreeStackBySlot(indexSlotDrop)) {
                    t.tranferDataSlot(t.readNameCustoms(t.oneTouch), indexSlotDrop, t.typeCubePick, t.listIndexCubesPick.length);
                    log(t.dataSlot, "how about data2");
                } else {
                    log("case touch 3 a")
                    t.cancelPick()

                }
                return
            }
            log("case touch 3 b")
            t.isAnim = false;
            t.cancelPick()
            return
        }
        t.isAnim = false;
        t.cancelPick()
        log("case touch 4")
    }

    cancelPick() {
        let t = this;
        t.turnLightListCube(false);
        t.listIndexCubesPick = [];
        t.oneTouch = null;
        t.twoTouch = null;
    }

    readNameCustoms(name: string) {
        let index = Number(name.slice(1));
        // let type = name.slice(0, 1);
        return index;
    }

    // get type of frist cube if slot empty return is -1
    getTypeCubefristBySlot(iSlot: number) {
        let t = this;
        let slot = t.dataSlot[iSlot];
        for (let i = slot.length - 1; i >= 0; i--) {
            if (slot[i] != typeSpecial.empty) {
                return slot[i]
            }
        }
        return -1;
    }

    getAllCubeBYSlotAndType(iSlot: number, type: number) {
        let t = this;
        let rs = [];
        let slot = t.dataSlot[iSlot];
        let freeStack: boolean = false;
        for (let i = slot.length - 1; i >= 0; i--) {
            if (slot[i] != typeSpecial.empty && !freeStack) {
                freeStack = true;
            }
            if (freeStack) {
                if (slot[i] == type) {
                    rs.push(i);
                } else {
                    return rs
                }
            }
        }
        return rs
    }

    turnLightListCube(isOn: boolean) {
        let t = this;
        t.listIndexCubesPick.forEach(e => {
            t.Cube.lightCubeByKeeperAndIndex(t.oneTouch, e, isOn)
        })
    }

    countFreeStackBySlot(iSlot: number) {
        let t = this;
        let count: number = 0;
        let slot = t.dataSlot[iSlot];
        for (let i = slot.length - 1; i >= 0; i--) {
            if (slot[i] == typeSpecial.empty) {
                count++;
            } else {
                return count;
            }
        }
        return count;
    }


    tranferDataSlot(idTo: number, idFrom: number, type: number, stack: number) {
        let t = this;
        let rs = [];
        for (let i = t.dataSlot[idTo].length - 1; i >= 0; i--) {
            if (t.dataSlot[idTo][i] == type || t.dataSlot[idTo][i] == typeSpecial.empty) {
                t.dataSlot[idTo][i] = typeSpecial.empty;
            } else {
                break;
            }
        }
        let count = stack
        for (let i = 0; i < t.dataSlot[idFrom].length; i++) {
            if (t.dataSlot[idFrom][i] == typeSpecial.empty && count != 0) {
                t.dataSlot[idFrom][i] = type;
                rs.push(i)
                count--;
            }
        }



        t.actionMoveOfCube(rs);
        if (t.caseDoneCube(t.readNameCustoms(t.twoTouch))) {
            // let temp = t.twoTouch;
            log(t.typeCubePick, "check done")
            // t.scheduleOnce(() => {
            //     //slove slot
            //     t.Slot.doneSlot(temp);
            //     // slove cube
            //     t.Cube.CleanCubeByName(temp)

            // }, Configute.timeAnim);
        } else log("NoDone");
        t.cancelPick();
    }


    actionMoveOfCube(data) {
        let t = this;
        log(data, "check data");
        for (let i = 0; i < data.length; i++) {
            let indexStack = data[i];// index new
            let pos = t.Slot.getPosByXY(t.readNameCustoms(t.twoTouch), indexStack);
            t.Cube.moveCube(t.oneTouch, t.listIndexCubesPick[i], pos);
            t.Cube.setNewAddressCube(t.oneTouch, t.listIndexCubesPick[i], t.twoTouch, indexStack)
        }
        t.scheduleOnce(() => {
            t.isAnim = false;
        }, Configute.timeAnim)

    }

    caseDoneCube(index: number) {
        let t = this;
        // continue here 

        // let index = t.readNameCustoms(t.twoTouch);
        let slot = t.dataSlot[index];
        let temp = []
        for (let i = slot.length - 1; i >= 0; i--) {
            if (i >= slot.length - SetupGame.ConditionDone) {
                if (slot[i] != t.typeCubePick) {
                    return false;
                }
                temp.push(typeSpecial.empty)
            } else {
                temp.push(slot[i]);
            }

        }

        log("check temp", temp.reverse())
        t.dataSlot[index] = temp;
        let name = t.twoTouch;
        let typeTemp = t.typeCubePick;

        // sovle task & stock frist
        let rsCheckTask = t.checkTask(t.typeCubePick);// check task have type
        // let rsCheckStock = t.Stock.checkFreeStock();
        let posNew = null;
        let nameTemp = null;
        let indexStack = null;
        if (rsCheckTask != -1) {
            posNew = t.Task.getPosTaskByName("T" + rsCheckTask);
            nameTemp = "T" + rsCheckTask;
            indexStack = rsCheckTask;
            t.sttTaskScript++
        } else if (t.Stock.checkFreeStock()) {
            let idStock = t.Stock.getPosFreeStock()
            posNew = idStock;
            nameTemp = "ST" + idStock;
            indexStack = idStock;
        } else {
            log("case end game")
            return false;
        }




        tween(t.node)
            .delay(Configute.timeAnim)
            .call(() => {
                t.Cube.CleanCubeByName(name, typeTemp, nameTemp, indexStack, posNew, rsCheckTask != -1);
            })
            .delay(Configute.timeAnim)
            .call(() => {
                // t.Slot.doneSlot(name);
                t.caseSlotDone(index, name)
                t.isAnim = false;
            })
            .delay(Configute.timeAnim / 2)
            .call(() => {
                rsCheckTask != -1 ? t.Task.resetTask(nameTemp, DataGame.instance.scriptTask[t.sttTaskScript]) : 0;
            })
            .start();

        return true;
    }


    caseSlotDone(index: number, name: string) {
        let t = this;
        let rs = true
        t.dataSlot[index].forEach(v => {
            if (v != typeSpecial.empty) { rs = false }
        })
        if (rs) {
            t.Slot.doneSlot(name);
        }
        return rs;
    }

    getIdCubeCenterByIdSlot(type: number, index: number) {
        let t = this;
        let tempSlot = t.dataSlot[index];
        for (let i = 0; i < tempSlot.length; i++) {
            let e = tempSlot[i];

        }
    }



    checkTask(type: number) {
        let t = this;
        for (let i = 0; i < t.dataTask.length; i++) {
            if (t.dataTask[i] == type) {
                return i
            }
        }
        log(t.dataTask, "check data task")
        return -1
    }

    checkStock() {
        let t = this;

        return true
    }
    // pickSlot(slot: Node, typeKeeper: TypeKeeper) {
    //     let t = this;
    //     if (place) {
    //         switch (DataGame.instance.statusTouch) {
    //             case statusTouch.Indle:
    //                 t.placeTo = place;
    //                 DataGame.instance.statusTouch = statusTouch.LoadTo;
    //                 // t.checkTypeKeeper(typeKeeper);
    //                 break;
    //             case statusTouch.LoadTo:
    //                 if (place.name == t.placeTo.name) {
    //                     DataGame.instance.statusTouch = statusTouch.Cancel;
    //                     // t.checkTypeKeeper(typeKeeper);
    //                 }
    //                 t.placeFrom = place;
    //                 DataGame.instance.statusTouch = statusTouch.LoadFrom;
    //                 // t.checkTypeKeeper(typeKeeper);
    //                 break;
    //             case statusTouch.LoadFrom:
    //                 t.placeTo = null;
    //                 t.placeFrom = null;
    //                 DataGame.instance.statusTouch = statusTouch.Indle;
    //                 // t.checkTypeKeeper(typeKeeper);
    //                 break;
    //             case statusTouch.Cancel:
    //                 t.placeTo = null;
    //                 t.placeFrom = null;
    //                 DataGame.instance.statusTouch = statusTouch.Indle;
    //                 break;
    //             default:
    //                 break;
    //         }
    //     } else {
    //         log("nothing item has touch ???")
    //     }
    // }


    update(deltaTime: number) {

    }

}

