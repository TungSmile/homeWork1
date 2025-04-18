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
    eff1

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

    move2Point(p1: Vec3, p2: Vec3, time: number, wait: number = 0) {
        let t = this;
        tween(t.node)
            .delay(wait)
            .to(time / 2, { worldPosition: p1 })
            .to(time / 2, { worldPosition: p2 })
            .call(() => {
                t.positionStand = p2
            })
            .start()
    }

    move3Point(p1: Vec3, p2: Vec3, p3: Vec3, time: number, wait: number = 0) {
        let t = this;
        tween(t.node)
            .delay(wait)
            .to(time / 3, { worldPosition: p1 })
            .to(time / 3, { worldPosition: p2 })
            .to(time / 3, { worldPosition: p3 })
            .call(() => {
                t.positionStand = p3

            })
            .start()
    }

    move4Point(p1: Vec3, p2: Vec3, p3: Vec3, p4: Vec3, time: number, wait: number = 0) {
        let t = this;
        tween(t.node)
            .delay(wait)
            .to(time / 4, { worldPosition: p1 })
            .to(time / 4, { worldPosition: p2 })
            .to(time / 4, { worldPosition: p3 })
            .to(time / 4, { worldPosition: p3 })
            .call(() => {
                t.positionStand = p3
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
                if (isActive) {
                    t.shakeCube()
                } else {
                    if (t.eff != null) {
                        t.eff.stop();
                        t.eff1.stop();
                        t.icon.setPosition(new Vec3(0, 0, 0))
                        t.icon.setRotationFromEuler(new Vec3(0, 0, 0))
                        t.light.setPosition(new Vec3(0, 0, 0))
                        t.light.setRotationFromEuler(new Vec3(0, 0, 0))

                    }
                    t.eff = null;
                    t.eff1 = null;
                    t.node.setRotationFromEuler(new Vec3(0, 0, 0));
                }
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

    assignPos(pos: Vec3, time: number, die: boolean = false, wait: number = 0) {
        let t = this;
        if (die) {
            tween(t.node)
                .delay(wait)
                .to(time, { worldPosition: pos })
                .delay(time / 10)
                .call(() => {
                    t.node.destroy();
                })
                .start()
        } else {
            tween(t.node)
                .delay(wait)
                .to(time, { worldPosition: pos })
                .call(() => {
                })
                .start()
        }


    }


    shakeCube() {
        let t = this;
        // t.positionStand=
        let cube = t.node.getChildByName("icon")
        let light = t.node.getChildByName("light");
        t.eff1 = tween(t.light)
            .by(Configute.timeAnim, {
                eulerAngles: new Vec3(0, 0, 5)
                , position: new Vec3(0, 5, 0)
            })
            .by(Configute.timeAnim, {
                eulerAngles: new Vec3(0, 0, -10)
                , position: new Vec3(0, -10, 0)
            })
            .by(Configute.timeAnim, {
                eulerAngles: new Vec3(0, 0, 5)
                , position: new Vec3(0, 5, 0)
            })
            .call(() => {

            })
            .start()
        t.eff = tween(t.icon)
            .by(Configute.timeAnim, {
                eulerAngles: new Vec3(0, 0, 5)
                , position: new Vec3(0, 5, 0)
            })
            .by(Configute.timeAnim, {
                eulerAngles: new Vec3(0, 0, -10)
                , position: new Vec3(0, -10, 0)
            })
            .by(Configute.timeAnim, {
                eulerAngles: new Vec3(0, 0, 5)
                , position: new Vec3(0, 5, 0)
            })
            .call(() => {
                t.shakeCube()
            })
            .start()


    }

}

