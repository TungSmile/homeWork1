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

    moving(to: Vec3 = null, from: Vec3, time: number) {
        // all world posion
        let t = this;
        to != null ? t.node.setPosition(to) : 0
        tween(t.node)
            .to(time, { position: from })
            .call(() => {
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

    setPos(pos: Vec3) {
        this.node.setPosition(pos);
    }


    update(deltaTime: number) {

    }


}

