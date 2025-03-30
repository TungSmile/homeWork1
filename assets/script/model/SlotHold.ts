import { _decorator, Component, instantiate, Size, tween, UITransform, Vec3, Node, log } from 'cc';
import { Configute, TypeKeeper } from '../data/Basic';
const { ccclass } = _decorator;

@ccclass('SlotHold')
export class SlotHold extends Component {



    type = TypeKeeper.Slot;
    capasity: number = 0;
    data: any[] = []; //    chieu duyet [dit , than , dau]
    hTop: number = 0;
    isFill: boolean = false;

    start() {
        let t = this;
    }

    setCapSlot(cap: number) {
        this.capasity = cap;
    }

    fillData(data) {
        let t = this;
        t.capasity = data.capasity;
        // t.data = data.data.reverse();

    }

    createSlot() {
        let t = this;
        if (t.capasity > 3) {
            t.node.getChildByName("door").setPosition(new Vec3(0, Configute.heightCube * t.capasity, 0));
            t.node.getChildByName("cells").getComponent(UITransform).setContentSize(new Size(127, Configute.heightCube * t.capasity));
            t.node.getChildByName("door").getComponent(UITransform).setContentSize(new Size(113, Configute.heightCube * t.capasity));
            t.node.getChildByName("door").setPosition(new Vec3(2, Configute.heightCube * (t.capasity - 1), 0))
            t.node.getChildByName("lightDone").getComponent(UITransform).setContentSize(new Size(175, Configute.heightCube * t.capasity));
            t.node.getChildByName("done").setPosition(new Vec3(0, Configute.heightCube * (t.capasity - 1), 0))
            let partry = t.node.getChildByName("partition");
            for (let i = 0; i < t.capasity - 3; i++) {
                let cloneParitition = instantiate(partry);
                cloneParitition.name = "partition"
                t.node.addChild(cloneParitition);
                let posY = Configute.heightCube * i + Configute.heightCube;
                cloneParitition.setPosition(new Vec3(0, posY, 0));
            }
        }
    }


    getPosByIndex(id: number) {
        let t = this;
        if (id >= t.capasity) {
            log("wrong , over capacity of slot")
            return null;
        }
        let temp = t.node.getChildByName("tempPosition");
        let posX = Configute.heightCube * id - (Configute.heightCube + 20);
        temp.setPosition(new Vec3(0, posX, 0));
        return temp.getWorldPosition(new Vec3)
    }


    animClose() {
        let t = this;
        let door = t.node.getChildByName("door");
        door.active = true;
        tween(door)
            .to(Configute.timeAnim, { position: new Vec3(2, -155, 0) })
            .call(() => {
                t.node.getChildByName("done").active = true;
                t.node.getChildByName("lightDone").active = true;
            })
            .start();
    }

    update(deltaTime: number) {

    }
}

