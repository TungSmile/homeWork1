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
            e.on(Node.EventType.TOUCH_START, t.eventTouchPick, t);
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

    doneSlot(name: string) {
        let t = this;
        let slot = t.node?.getChildByName(name);
        slot.off(Node.EventType.TOUCH_START, t.eventTouchPick, t);
        slot.getComponent(SlotHold).animClose();
    }



    eventTouchPick(e) {
        let t = this;
        t.node.parent.emit("pickSlot", e.target.name);
    }


    update(deltaTime: number) {

    }
}

