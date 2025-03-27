import { _decorator, Component, log, Node, Sprite, SpriteFrame, tween, Vec3 } from 'cc';
import { TypeKeeper } from '../data/Basic';
const { ccclass, property } = _decorator;

@ccclass('ItemCube')
export class ItemCube extends Component {

    x: number = -1
    y: number = -1
    z: number = -1

    type: number = -1;

    isAnim: boolean = false;

    @property({ type: Node })
    icon: Node = null;

    @property({ type: Node })
    light: Node = null;


    start() {

    }

    getType() {
        return this.type;
    }


    setType(type: number) {
        this.type = type;
    }

    move(to: Vec3, from: Vec3, time: number) {
        // all world posion
        let t = this;
        t.node.setPosition(to);
        t.isAnim = true
        tween(t.node)
            .to(time, { position: from })
            .call(() => {
                t.isAnim = false;
            })
            .start()
    }

    renderImgIcon(img: SpriteFrame) {
        let t = this;
        t.icon.getComponent(Sprite).spriteFrame = img;
    }

    turnLight(isActive: boolean) {
        this.light.active = isActive;
    }

    setPos(pos: Vec3) {
        this.node.setPosition(pos);
    }


    update(deltaTime: number) {

    }


}

