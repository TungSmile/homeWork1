import { _decorator, Component, instantiate, Size, tween, UITransform, Vec3, Node, log, Mat4 } from 'cc';
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
            t.node.getChildByName("lightDone").getComponent(UITransform).setContentSize(new Size(175, Configute.heightCube * t.capasity + 70));
            t.node.getChildByName("lightDone").setPosition(new Vec3(0, (Configute.heightCube / 2) * (t.capasity - 3), 0))
            t.node.getChildByName("done").setPosition(new Vec3(0, Configute.heightCube * (t.capasity - 1), 0))
            let partry = t.node.getChildByName("partition");
            for (let i = 0; i < t.capasity - 3; i++) {
                let cloneParitition = instantiate(partry);
                cloneParitition.name = "partition"
                t.node.addChild(cloneParitition);
                cloneParitition.setSiblingIndex(partry.getSiblingIndex());
                let posY = Configute.heightCube * i + (Configute.heightCube - 20);
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
        // let localPos = new Vec3(0, posX, 0);
        // let worldPos = new Vec3();
        // t.node.getWorldPosition(worldPos);
        // Vec3.add(worldPos, worldPos, localPos);
        temp.setPosition(new Vec3(0, posX, 0));
        return temp.getWorldPosition(new Vec3);
    }


    getPosGateSlot() {
        return this.node.getChildByName("done").getWorldPosition(new Vec3);
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

    getPosByStack(stack: number) {
        let t = this;
        if (stack >= t.capasity) {
            log("wrong , over capacity of slot")
            return null;
        }
        // 120 20 80 160  // 4    // [-1,-1, 1, 1]
        // 0  1  2  3            //   3  2 1 0
        let posX =
            // Configute.heightCube * stack - (Configute.heightCube + 20)
            Configute.heightCube * ((t.capasity - 1) - stack) - (Configute.heightCube + 20);

        // let temp = t.node.getChildByName("tempPosition");
        // temp.setPosition(new Vec3(0, posX, 0));
        // return temp.getWorldPosition(new Vec3);

        let localPos = new Vec3(0, posX, 0);
        let worldPos = new Vec3();
        t.node.getWorldPosition(worldPos);
        // Vec3.add(worldPos, worldPos, localPos);
        const worldMatrix: Mat4 = t.node.getWorldMatrix();
        Vec3.transformMat4(worldPos, localPos, worldMatrix)
        return worldPos;
    }

    update(deltaTime: number) {

    }
}

