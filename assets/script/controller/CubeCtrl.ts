import { _decorator, Component, instantiate, log, Node, Prefab, SpriteFrame, Vec3 } from 'cc';
import { DataGame } from '../data/DataGame';
import { ItemCube } from '../model/ItemCube';
import { Configute, idX, SetupGame } from '../data/Basic';
const { ccclass, property } = _decorator;

@ccclass('CubeCtrl')
export class CubeCtrl extends Component {

    @property({ type: Prefab })
    Cube: Prefab = null;
    cubeTemp = null;


    start() {

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
            }
        }

    }

    // cube move from slot to new slot
    CMFSTNS(X: number, Y: number, posTo: Vec3, posCenter: Vec3, posFrom: Vec3, wait: number) {
        let t = this;
        let to = t.node.inverseTransformPoint(new Vec3(), posTo);
        let center = t.node.inverseTransformPoint(new Vec3(), posCenter);
        let from = t.node.inverseTransformPoint(new Vec3(), posFrom);
        let cube = t.cubeTemp.getComponent(ItemCube)
        cube.move3Point(to, center, from, Configute.timeAnim * 2, wait)
        cube.turnLight(false);
        t.cubeTemp.setSiblingIndex(t.node.children.length)
        cube.setXindex(X);
        cube.setYindex(Y);
    }



    update(deltaTime: number) {

    }
}

