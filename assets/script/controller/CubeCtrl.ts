import { _decorator, Component, instantiate, log, Node, Prefab, SpriteFrame, Vec3 } from 'cc';
import { DataGame } from '../data/DataGame';
import { ItemCube } from '../model/ItemCube';
import { caseSound, ConditionEndGame, Configute, idX, SetupGame, typeSpecial } from '../data/Basic';
const { ccclass, property } = _decorator;

@ccclass('CubeCtrl')
export class CubeCtrl extends Component {

    @property({ type: Prefab })
    Cube: Prefab = null;
    cubeTemp = null;


    start() {
        let t = this;
        t.node.on("checkWin", t.CEGWDAC, t);
    }

    createCube(type: number, posWrold: Vec3, imgIcon: SpriteFrame, nameKeeper: string, indexStack: number) {
        let t = this;
        let cube = instantiate(t.Cube);
        let temp = cube.getComponent(ItemCube);
        cube.name = "C" + DataGame.instance.countCube;
        DataGame.instance.countCube++
        temp.getComponent(ItemCube).renderImgIcon(imgIcon);
        t.node.addChild(cube)
        let pos = t.node.inverseTransformPoint(new Vec3(), posWrold);
        // cube.getComponent(ItemCube).move(new Vec3(), pos, 0)
        temp.setPos(pos);
        temp.setType(type);
        temp.setNameKeeper(nameKeeper);
        temp.setIndexInStack(indexStack);
        temp.setColorTail(DataGame.instance.colorTable[type])
    }

    findCubeByNameKeeperAndIndex(name: string, index: number) {
        let t = this;
        // t.node.children.forEach(cube => {
        //     let temp = cube.getComponent(ItemCube);
        //     if (temp.getNameKeeper() == name && temp.getIndexInStack() == index) {
        //         return cube;
        //     }
        // })
        // log("???a")
        // return null

        for (let i = 0; i < t.node.children.length; i++) {
            const e = t.node.children[i].getComponent(ItemCube);
            if (e.getNameKeeper() == name && e.getIndexInStack() == index) {
                return e;
            }
        }
        return null
    }

    lightCubeByKeeperAndIndex(nameKeeper: string, index: number, isLight: boolean) {
        let t = this;
        // let cube = t.findCubeByNameKeeperAndIndex(nameKeeper, index)
        // if (cube != null) {
        //     cube.turnLight(isLight)
        // }
        t.node.children.forEach(cube => {
            let temp = cube.getComponent(ItemCube);
            temp.getNameKeeper() == nameKeeper && temp.getIndexInStack() == index ? temp.turnLight(isLight) : 0
        })
    }

    moveCube(nameTo: string, indexTo: number, posWrold: Vec3) {
        let t = this;
        // let cube = t.findCubeByNameKeeperAndIndex(nameTo, indexTo);
        // if (cube != null) {
        //     cube.getComponent(ItemCube).moving(null, pos, Configute.timeAnim);
        // }
        let pos = t.node.inverseTransformPoint(new Vec3(), posWrold);
        t.node.children.forEach(cube => {
            let temp = cube.getComponent(ItemCube);
            if (temp.getNameKeeper() == nameTo && temp.getIndexInStack() == indexTo) {
                temp.moving(pos, Configute.timeAnim);
                temp.turnLight(false);
                cube.setSiblingIndex(t.node.children.length)
            }
        })
    }

    setNewAddressCube(nameTo: string, indexTo: number, nameFrom: string, indexFrom: number,) {
        let t = this;
        // let cube = t.findCubeByNameKeeperAndIndex(nameTo, indexTo);
        // if (cube != null) {
        //     cube.getComponent(ItemCube).setNameKeeper(nameFrom);
        //     cube.getComponent(ItemCube).setIndexInStack(indexFrom);
        // }
        t.node.children.forEach(cube => {
            let temp = cube.getComponent(ItemCube);
            if (temp.getNameKeeper() == nameTo && temp.getIndexInStack() == indexTo) {
                temp.setNameKeeper(nameFrom);
                temp.setIndexInStack(indexFrom);
            }
        })
    }


    CleanCubeByName(nameKeeper: string, type: number, nameFrom: string, indexFrom: number, posWrold: Vec3, isTask: boolean) {
        let t = this;
        let listNode = [];
        let posCenter = null;
        let pos = t.node.inverseTransformPoint(new Vec3(), posWrold);
        let idNodeSave: number = Math.floor(SetupGame.ConditionDone / 2);
        t.node.children.forEach(cube => {
            let temp = cube.getComponent(ItemCube);
            if (temp.getNameKeeper() == nameKeeper && temp.getType() == type) {
                // if (temp.getIndexInStack() == idNodeSave) {
                //     posCenter = temp.getPos();
                //     temp.setNameKeeper(nameFrom);
                //     temp.setIndexInStack(indexFrom);
                //     t.scheduleOnce(() => {
                //         temp.moveByDoneAct(pos, Configute.timeAnim, isTask);
                //     }, Configute.timeAnim / 3)
                // } else {
                listNode.push(cube);
                // }

            }
        });


        // Combined Cube to one cube
        // if (posCenter != null) {
        listNode = listNode.sort((a, b) => a.getComponent(ItemCube).getIndexInStack() - b.getComponent(ItemCube).getIndexInStack());
        let del = listNode.length - SetupGame.ConditionDone;
        let tempL = del > 0 ? listNode.slice(del) : [...listNode];
        let cubeCenter = tempL[Math.floor(tempL.length / 2)].getComponent(ItemCube)
        posCenter = cubeCenter.getPos();
        cubeCenter.setNameKeeper(nameFrom);
        cubeCenter.setIndexInStack(indexFrom);
        for (let i = 0; i < tempL.length; i++) {
            let e = tempL[i].getComponent(ItemCube);
            if (i != Math.floor(tempL.length / 2)) {
                e.moveByDoneAct(posCenter, Configute.timeAnim / 2, true);
            } else {
                e.moveByDoneAct(pos, Configute.timeAnim / 2, isTask, Configute.timeAnim / 2);
            }

        }

    }


    // useless 
    animCombinedCube(nameKeeper: string, type: number, step: number) {
        let t = this;
        for (let i = 0; i < t.node.children.length; i++) {
            let e = t.node.children[i];
            let temp = e.getComponent(ItemCube);
        }
        t.node.children.forEach(cube => {
            let temp = cube.getComponent(ItemCube);
            if (temp.getNameKeeper() == nameKeeper && temp.getType() == type) {
            }
        })
    }

    cleanCube(name: string, index: number) {
        let t = this;
        t.findCubeByNameKeeperAndIndex(name, index).node.destroy()
    }


    cubeRunByRoad3P(name: string, index: number, p1: Vec3, p2: Vec3, p3: Vec3) {
        let t = this;
        let pos1 = t.node.inverseTransformPoint(new Vec3(), p1);
        let pos2 = t.node.inverseTransformPoint(new Vec3(), p2);
        let pos3 = t.node.inverseTransformPoint(new Vec3(), p3);
        log(pos1, pos2, pos3)
        t.node.children.forEach(cube => {
            let temp = cube.getComponent(ItemCube);
            if (temp.getNameKeeper() == name && temp.getIndexInStack() == index) {
                // temp.moving(pos, Configute.timeAnim);
                temp.move3Point(pos1, pos2, pos3, Configute.timeAnim * 2, temp.getIndexInStack() * 0.1)
                temp.turnLight(false);
                cube.setSiblingIndex(t.node.children.length)
            }
        })


    }



    /// nem logic

    createNewCube(X: number, Y: number, posWrold: Vec3, imgIcon: SpriteFrame, isShow: boolean = true) {
        let t = this;
        let cube = instantiate(t.Cube);
        let temp = cube.getComponent(ItemCube);
        let pos = t.node.inverseTransformPoint(new Vec3(), posWrold);
        cube.name = "C" + DataGame.instance.countCube;
        DataGame.instance.countCube++;
        temp.getComponent(ItemCube).renderImgIcon(imgIcon);
        temp.setPos(pos);
        temp.setXindex(X);
        temp.setYindex(Y);
        t.node.addChild(cube);
        // t.node.setSiblingIndex()
        cube.active = isShow;
    }

    findCubeByXY(X: number, Y: number) {
        let t = this;
        for (let i = 0; i < t.node.children.length; i++) {
            let e = t.node.children[i];
            let cube = e.getComponent(ItemCube);
            if (cube.getXindex() == X && cube.getYindex() == Y) {
                t.cubeTemp = e;
                return;
            }
        }
        t.cubeTemp = null;
    }

    lightCube(isOn: boolean) {
        let t = this;
        if (t.cubeTemp != null) {
            t.cubeTemp.getComponent(ItemCube).turnLight(isOn);
        }
    }


    // animation when cube picked
    AWCP(X: number, Y: number) {
        let t = this;
        for (let i = 0; i < t.node.children.length; i++) {
            let e = t.node.children[i];
            let cube = e.getComponent(ItemCube);
            if (cube.getXindex() == X && cube.getYindex() == Y) {
                cube.turnLight(true);
                t.node.parent.emit("sound", caseSound.Tap)
                break;
            }
        }

    }

    // animation when cube drop
    AWCD(X: number, Y: number) {
        let t = this;
        for (let i = 0; i < t.node.children.length; i++) {
            let e = t.node.children[i];
            let cube = e.getComponent(ItemCube);
            if (cube.getXindex() == X && cube.getYindex() == Y) {
                cube.turnLight(false);
                t.node.parent.emit("sound", caseSound.Drop1);
                break;
            }
        }

    }

    // cube move from slot to new slot
    CMFSTNS(X: number, Y: number, posTo: Vec3, posCenter: Vec3, posFrom: Vec3, time: number, wait: number) {
        let t = this;
        let to = posTo;
        let center = posCenter;
        let from = posFrom;
        if (posTo.y > posCenter.y) {
            center = new Vec3(posCenter.x, posTo.y, 0);
        } else if (posTo.y < posCenter.y) {
            to = new Vec3(posTo.x, posCenter.y, 0);
        }

        let cube = t.cubeTemp.getComponent(ItemCube);
        if (posTo.x == posFrom.x) {
            cube.move2Point(to, from, Configute.timeAnim * 1.5, wait);
        } else
            cube.move3Point(to, center, from, Configute.timeAnim * 1.5, wait);
        cube.turnLight(false);
        t.cubeTemp.setSiblingIndex(t.node.children.length)
        cube.setXindex(X);
        cube.setYindex(Y);
    }


    // animation join 3 cube to center
    AJTCTC(X: number, Y: number, time: number, wait: number) {
        let t = this; let top; let center; let bot;
        for (let i = 0; i < t.node.children.length; i++) {
            let e = t.node.children[i];
            let cube = e.getComponent(ItemCube);
            if (cube.getXindex() == X) {
                if (cube.getYindex() == Y) {
                    center = e;
                } else if (cube.getYindex() == Y + 1) {
                    bot = cube
                } else if (cube.getYindex() == Y - 1) {
                    top = cube
                }
            }
        }
        t.scheduleOnce(() => {
            bot.assignPos(center.getWorldPosition(new Vec3), time, true, 0);
            top.assignPos(center.getWorldPosition(new Vec3), time, true, 0);
            t.node.parent.emit("sound", caseSound.CombineCube)
        }, wait)
    }

    // animation cube to task
    ACTT(X: number, Y: number, pos: Vec3, time: number, wait: number = 0) {
        let t = this;
        for (let i = 0; i < t.node.children.length; i++) {
            let e = t.node.children[i];
            let cube = e.getComponent(ItemCube);
            if (cube.getXindex() == X && cube.getYindex() == Y) {
                cube.assignPos(pos, time, true, wait);
                t.node.parent.emit("sound", caseSound.DoneTask)
                break;
            }
        }
    }


    // animatio cube to stock
    ACTS(X: number, Y: number, pos: Vec3, time: number, wait: number = 0) {
        let t = this;
        let cube = t.cubeTemp.getComponent(ItemCube);
        t.cubeTemp.setSiblingIndex(t.node.children.length)
        cube.setXindex(X);
        cube.setYindex(Y);
        cube.assignPos(pos, time, false, wait);
    }

    // animation cube in stock to task
    ACISTT(pos: Vec3, time: number, wait: number = 0) {
        let t = this;
        let cube = t.cubeTemp.getComponent(ItemCube);
        t.cubeTemp.setSiblingIndex(t.node.children.length);
        cube.assignPos(pos, time, true, wait);
        t.node.parent.emit("sound", caseSound.DoneTask)
    }


    // check cube done all
    CCDA(wait: number) {
        let t = this;
        log("check end game")
        t.scheduleOnce(() => {
            for (let i = 0; i < t.node.children.length; i++) {
                let e = t.node.children[i];
                let cube = e.getComponent(ItemCube);
                if (cube.getXindex() > typeSpecial.empty) {
                    log('not end')
                    return
                }
            }
            // if (t.node.children.length > 0) {
            //     return false
            // }
            DataGame.instance.endGame = true;
            DataGame.instance.isWin = true;
            t.node.parent.emit("endGame");
        }, wait)
    }

    // check end game when done all cube
    CEGWDAC() {
        let t = this;
        log("count : " + DataGame.instance.countCubeDone)
        if (DataGame.instance.countCubeDone == ConditionEndGame.CubeDone) {
            DataGame.instance.endGame = true;
            DataGame.instance.isWin = true;
        }
    }

    update(deltaTime: number) {

    }
}

