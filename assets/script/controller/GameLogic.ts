import { _decorator, Camera, Component, geometry, instantiate, log, Node, PhysicsSystem, Prefab, SpriteFrame, Vec3 } from 'cc';
import { SlotCtrl } from './SlotCtrl';
import { StockCtrl } from './StockCtrl';
import { TaskCtrl } from './TaskCtrl';
import { ItemCube } from '../model/ItemCube';
import { DataGame } from '../data/DataGame';
import { SetupGame, statusTouch, TypeKeeper } from '../data/Basic';
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


    placeTo = null;
    placeFrom = null;
    listCubesTarget = [];

    dataTask = [];
    sttTaskScript: number = 0;
    dataSlot = [];


    protected onLoad(): void {
        let t = this;
    }

    // logic game

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




    getIDFreeStackByIdSlot(id: number) {
        let t = this;
        let slot = t.dataSlot[id];
        let rs = -1;
        for (let i = 0; i < slot.length; i++) {
            let e = slot[i];
            if (e == -1) {
                rs = i;
            } else {
                return rs;
            }
        }
        return rs;
    }

    // type=-1 is find free stack
    getAllCubeSameTypeInASlot(id: number, type: number) {
        let t = this;
        let slot = t.dataSlot[id];
        let rs = -1;
        for (let i = slot.length - 1; i >= 0; i--) {
            let e = slot[i];
            if (e == type) {
                rs = i;
            } else {
                return rs;
            }
        }
        return rs;
    }






    start() {
        let t = this;
        // t.node.on("newCube", t.createCube, t);
        t.node.on("loadPlaceTouch", t.pickPlace, t);
        t.createTask()
        t.createSlot();
        t.createCube()
    }

    createCube() {
        let t = this;
        for (let i = 0; i < DataGame.instance.scriptSlot.length; i++) {
            // let tempSlot = []
            let slot = DataGame.instance.scriptSlot[i];
            for (let j = 0; j < slot.length; j++) {
                let stack = slot[j];
                if (stack > -1) {
                    // tempSlot.push({ name: "C" + DataGame.instance.countCube, type: stack });
                    let pos = t.Slot.getPosByXY(i, j);
                    t.Cube.createCube(stack, pos, t.listImgCube[stack])
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
        // t.dataSlot = [...DataGame.instance.scriptSlot];
    }

    pickPlace(place: Node, typeKeeper: TypeKeeper) {
        let t = this;
        if (place) {
            switch (DataGame.instance.statusTouch) {
                case statusTouch.Indle:
                    t.placeTo = place;
                    DataGame.instance.statusTouch = statusTouch.LoadTo;
                    // t.checkTypeKeeper(typeKeeper);
                    break;
                case statusTouch.LoadTo:
                    if (place.name == t.placeTo.name) {
                        DataGame.instance.statusTouch = statusTouch.Cancel;
                        // t.checkTypeKeeper(typeKeeper);
                    }
                    t.placeFrom = place;
                    DataGame.instance.statusTouch = statusTouch.LoadFrom;
                    // t.checkTypeKeeper(typeKeeper);
                    break;
                case statusTouch.LoadFrom:
                    t.placeTo = null;
                    t.placeFrom = null;
                    DataGame.instance.statusTouch = statusTouch.Indle;
                    // t.checkTypeKeeper(typeKeeper);
                    break;
                case statusTouch.Cancel:
                    t.placeTo = null;
                    t.placeFrom = null;
                    DataGame.instance.statusTouch = statusTouch.Indle;
                    break;
                default:
                    break;
            }
        } else {
            log("nothing item has touch ???")
        }
    }


    update(deltaTime: number) {

    }

}

