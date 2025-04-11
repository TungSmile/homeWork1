import { _decorator, CapsuleCollider, Component, easing, log, Node, Sprite, SpriteFrame, tween, Vec3 } from 'cc';
import { Configute, TypeKeeper } from '../data/Basic';
const { ccclass, property } = _decorator;

@ccclass('ItemCube')
export class ItemCube extends Component {

    nameKeeper: String = "";
    indexInStack: number = -1;
    type: number = -1;


    @property({ type: Node })
    icon: Node = null;

    @property({ type: Node })
    light: Node = null;


    start() {

    }

    getType() {
        return this.type;
    }

    setNameKeeper(name: string) {
        this.nameKeeper = name;
    }

    getNameKeeper() {
        return this.nameKeeper;
    }
    getIndexInStack() {
        return this.indexInStack;
    }

    setIndexInStack(i: number) {
        this.indexInStack = i;
    }

    setType(type: number) {
        this.type = type;
    }

    moving(from: Vec3, time: number) {
        // all world posion
        let t = this;
        tween(t.node)
            .to(time, { position: from })
            .call(() => {
            })
            .start()
    }

    moveByDoneAct(from: Vec3, time: number, die: boolean = true, wait: number = 0) {
        let t = this;
        tween(t.node)
            .delay(wait)
            .to(time, { position: from })
            .call(() => {
                die ? t.node.destroy() : 0
            })
            .start()
    }


    renderImgIcon(img: SpriteFrame) {
        let t = this;
        t.icon.getComponent(Sprite).spriteFrame = img;
    }

    turnLight(isActive: boolean) {
        let t = this;
        t.light.active = isActive;
        tween(t.node)
            .by(Configute.timeAnim / 3, { position: new Vec3(0, isActive ? 30 : -30, 0) }, { easing: easing.quadOut })
            .call(() => {
            })
            .start();
    }

    getPos() {
        return this.node.getPosition(new Vec3);
    }

    setPos(pos: Vec3) {
        this.node.setPosition(pos);
    }




}

