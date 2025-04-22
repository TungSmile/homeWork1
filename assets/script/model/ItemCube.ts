import { _decorator, CapsuleCollider, Color, Component, easing, log, Node, ParticleSystem2D, Sprite, SpriteFrame, tween, Vec3 } from 'cc';
import { Configute, pairOfAngles90, TypeKeeper } from '../data/Basic';
import { DataGame } from '../data/DataGame';
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

    @property({ type: Node })
    parSys2D: Node = null;

    eff
    eff1

    directorMoving: pairOfAngles90 = pairOfAngles90.notBelong;

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
        let originPos = t.node.getWorldPosition(new Vec3)
        tween(t.node)
            .delay(wait)
            .call(() => {
                // t.caclutationAngles(originPos, p1);
                t.ctrTail();
            })
            .to(time / 2, { worldPosition: p1 })
            .call(() => {
                // t.caclutationAngles(p1, p2);
                // t.ctrTail();
            })
            .to(time / 2, { worldPosition: p2 })
            .call(() => {
                t.ctrTail(false);
                t.positionStand = p2;
            })
            .start()
    }

    move3Point(p1: Vec3, p2: Vec3, p3: Vec3, time: number, wait: number = 0) {
        let t = this;
        let originPos = t.node.getWorldPosition(new Vec3)
        let oTop1 = Vec3.distance(originPos, p1)
        let p1Top2 = Vec3.distance(p1, p2)
        let p2Top3 = Vec3.distance(p2, p3)
        let v = time / (oTop1 + p1Top2 + p2Top3)

        tween(t.node)
            .delay(wait)
            .call(() => {
                // t.caclutationAngles(originPos, p1);
                t.ctrTail();
            })
            .to(v * oTop1, { worldPosition: p1 }, { easing: "quintIn" })
            .call(() => {
                // t.caclutationAngles(p1, p2);
                // t.ctrTail();
            })
            .to(v * p1Top2, { worldPosition: p2 })
            .call(() => {
                // t.caclutationAngles(p2, p3);
                // t.ctrTail();
            })
            .to(v * p2Top3, { worldPosition: p3 })
            .call(() => {
                // t.caclutationAngles(p3, p2);
                t.ctrTail(false);
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
                if (die) {
                    DataGame.instance.countCubeDone++;
                    t.node.parent.emit("checkWin");
                    t.node.destroy();
                }
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
                    DataGame.instance.countCubeDone++;
                    t.node.parent.emit("checkWin");
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

    ctrTail(isAct: boolean = true) {
        let t = this;

        let par = t.parSys2D.getComponent(ParticleSystem2D);
        // par.resetSystem()
        isAct ? par.resetSystem() : par.stopSystem();
        t.parSys2D.active = isAct;
        // if (isAct) {
        //     // t.parSys2D.getComponent(ParticleSystem2D).
        //     // par.angle = 90 * t.directorMoving;
        // }
        // else {
        //     par.resetSystem();
        // }
    }

    setColorTail(nameColor: string) {
        let t = this;
        let par = t.parSys2D.getComponent(ParticleSystem2D);
        par.startColor = new Color(nameColor);
    }




    caclutationAngles(to: Vec3, from: Vec3) {
        let t = this;
        if (to.x == from.x) {
            if (to.y < from.y) {
                t.directorMoving = pairOfAngles90.up;
                return;
            } else if (to.y > from.y) {
                t.directorMoving = pairOfAngles90.down;
                return;
            }
        }
        if (to.y == from.y) {
            if (to.x < from.x) {
                t.directorMoving = pairOfAngles90.right;
                return;
            } else if (to.y > from.y) {
                t.directorMoving = pairOfAngles90.left;
                return;
            }
        }
        t.directorMoving = pairOfAngles90.notBelong;
    }



}

