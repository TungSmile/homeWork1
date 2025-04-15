import { _decorator, Component, instantiate, log, Node, Prefab, Size, UITransform, Vec3 } from 'cc';
import { SlotHold } from '../model/SlotHold';
import { Configute, SetupGame, statusCube, TypeKeeper } from '../data/Basic';
import { DataGame } from '../data/DataGame';
const { ccclass, property } = _decorator;

@ccclass('SlotCtrl')
export class SlotCtrl extends Component {

    quantitySlot: number = 0;
    mapPosQuantity = [];

    @property({ type: Prefab })
    slot: Prefab = null;
    slotTo = null;
    slotFrom = null;

    start() {

    }


    setData(data) {
        let t = this;
        t.quantitySlot = data.quantity;
        t.mapPosQuantity = data.mapPos;
    }

    createSlot() {
        let t = this;
        for (let i = 0; i < t.quantitySlot; i++) {
            let e = instantiate(t.slot);
            let temp = e.getComponent(SlotHold);
            let cap = SetupGame.LengthSlot;
            // let dataSlot = DataGame.instance.scriptSlot[i];
            temp.setCapSlot(SetupGame.LengthSlot);
            temp.createSlot();
            e.name = "S" + i
            e.getComponent(UITransform).setContentSize(new Size(Configute.weightSlot, cap * Configute.heightCube))
            t.node.addChild(e);
            e.setPosition(t.mapPosQuantity[i]);
            // e.on(Node.EventType.TOUCH_START, t.eventTouchPick, t);
            e.on(Node.EventType.TOUCH_START, t.eventTouchSlot, t);

        }
    }

    getSlotByName(name: string) {
        let t = this;
        let rs = t.node?.getChildByName(name)?.getComponent(SlotHold);
        return rs ? rs : null;
    }

    getPosByXY(XSlot: number, YStack: number) {
        let t = this;
        let rs = t.node.getChildByName("S" + XSlot).getComponent(SlotHold).getPosByIndex(YStack);
        return rs ? rs : null;
    }


    calculation3Point(from: number, to: number, toStack: number) {
        let t = this;
        let gateFrom: Vec3 = t.node.getChildByName("S" + from).getComponent(SlotHold).getPosGateSlot();
        let gateTo: Vec3 = t.node.getChildByName("S" + to).getComponent(SlotHold).getPosGateSlot();
        let start: Vec3 = new Vec3(gateFrom.x, gateFrom.y > gateTo.y ? gateFrom.y : gateTo.y, 0)
        let road: Vec3 = new Vec3(gateTo.x, gateFrom.y > gateTo.y ? gateFrom.y : gateTo.y, 0);
        let end: Vec3 = t.node.getChildByName("S" + to).getComponent(SlotHold).getPosByIndex(toStack)
        return [start, road, end]
    }



    doneSlot(name: string) {
        let t = this;
        let slot = t.node?.getChildByName(name);
        slot.off(Node.EventType.TOUCH_START, t.eventTouchPick, t);
        slot.on(Node.EventType.TOUCH_START, t.eventDoneSlot, t);
        slot.getComponent(SlotHold).animClose();
    }

    eventDoneSlot(e) {
        let t = this;
        t.node.parent.emit("doneSlot", e.target.name);
    }


    eventTouchPick(e) {
        let t = this;
        t.node.parent.emit("pickSlot", e.target.name);
    }




    // new logic

    getPosStack(x: number, y: number) {
        let t = this;
        let pos = t.node.getChildByName("S" + x).getComponent(SlotHold).getPosByStack(y);
        return pos;
    }


    eventTouchSlot(e) {
        let t = this;
        t.node.parent.emit("pickSlot", e.target.name);
    }

    getPosGateSlot(x: number) {
        let t = this;
        let pos = t.node.getChildByName("S" + x).getComponent(SlotHold).getPosGateSlot();
        return pos;

    }



    update(deltaTime: number) {

    }
}

