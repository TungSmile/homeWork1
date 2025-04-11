import { _decorator, Component, Sprite, SpriteFrame, tween, Vec3 } from 'cc';
import { Configute } from '../data/Basic';
const { ccclass, property } = _decorator;

@ccclass('TaskMission')
export class TaskMission extends Component {

    type: number = -1;
    busy: boolean = false

    start() {
        let t = this;

    }


    resetTask(type: number, icon: SpriteFrame, shadow: SpriteFrame) {
        let t = this;
        if (t.busy) { return }
        let door = t.node.getChildByName("door");
        let iconNode = t.node.getChildByName("icon");
        let shadowNode = t.node.getChildByName("shadowOfIcon");
        t.type = type
        door.active = true;
        t.busy = true;
        tween(door)
            .by(Configute.timeAnim / 2, { position: new Vec3(0, -120, 0) })
            .call(() => {
                iconNode.getComponent(Sprite).spriteFrame = icon;
                shadowNode.getComponent(Sprite).spriteFrame = shadow;
            })
            .by(Configute.timeAnim / 2, { position: new Vec3(0, 120, 0) })
            .call(() => {
                door.active = false;
                t.busy = false;
            })
            .start();
    }

    closeDoorForDone() {
        let t = this;
        if (t.busy) { return }
        let door = t.node.getChildByName("door");
        door.active = true;
        t.busy = true; // busy forever
        tween(door)
            .by(Configute.timeAnim, { position: new Vec3(0, -120, 0) })
            .call(() => {
                t.node.getChildByName("lightBoderDone").active = true;

            })
            .start();
    }



    getPos() {
        return this.node.getWorldPosition(new Vec3);
    }


    update(deltaTime: number) {

    }
}

