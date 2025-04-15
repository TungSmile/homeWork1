import { _decorator, CapsuleCollider, Component, easing, log, Node, Sprite, SpriteFrame, tween, Vec3 } from 'cc';
import { Configute, TypeKeeper } from '../data/Basic';
const { ccclass, property } = _decorator;

@ccclass('ItemCube')
export class ItemCube extends Component {

    nameKeeper: String = "";
    indexInStack: number = -1;
    type: number = -1;

    XIndex: number;
    YIndex: number;

    positionStand: Vec3

    @property({ type: Node })
    icon: Node = null;

    @property({ type: Node })
    light: Node = null;

    eff

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


    move3Point(p1: Vec3, p2: Vec3, p3: Vec3, time: number, wait: number = 0) {
        let t = this;
        tween(t.node)
            .delay(wait)
            .to(time / 3, { position: p1 })
            .to(time / 3, { position: p2 })
            .to(time / 3, { position: p3 })
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
        // ligh and up
        t.light.active = isActive;
        tween(t.node)
            .by(Configute.timeAnim / 3, { position: new Vec3(0, isActive ? 30 : -30, 0) }, { easing: easing.quadOut })
            .call(() => {
            })
            .start();
    }

    getPos() {
        return this.positionStand;
    }

    setPos(pos: Vec3) {
        let t = this;
        t.positionStand = pos;
        t.node.setPosition(pos);
    }

    getXindex() {
        return this.XIndex;
    }

    setXindex(valueX: number) {
        this.XIndex = valueX;
    }

    getYindex() {
        return this.YIndex;
    }

    setYindex(valueY: number) {
        this.YIndex = valueY;
    }


    shakeCube() {
        let t = this;

        t.eff = tween(t.node)
            .by(Configute.timeAnim, { eulerAngles: new Vec3(0, 0, 5), position: new Vec3(0, 5, 0) })
            .by(Configute.timeAnim, { eulerAngles: new Vec3(0, 0, -10), position: new Vec3(0, -10, 0) })
            .by(Configute.timeAnim, { eulerAngles: new Vec3(0, 0, 5), position: new Vec3(0, 5, 0) })
            .call(() => { })
            .start()


    }

}

