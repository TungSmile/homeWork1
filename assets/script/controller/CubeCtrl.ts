import { _decorator, Component, instantiate, log, Node, Prefab, SpriteFrame, Vec3 } from 'cc';
import { DataGame } from '../data/DataGame';
import { ItemCube } from '../model/ItemCube';
import { Configute } from '../data/Basic';
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
        t.node.children.forEach(cube => {
            let temp = cube.getComponent(ItemCube);
            if (temp.getNameKeeper() == name && temp.getIndexInStack() == index) {
                return temp;
            }
        })
        log("???a")
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
                temp.moving(null, pos, Configute.timeAnim);
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


    CleanCubeByName(nameKeeper: string) {
        let t = this;
        t.node.children.forEach(cube => {
            let temp = cube.getComponent(ItemCube);
            temp.getNameKeeper() == nameKeeper ? cube.destroy() : 0
        })
    }


    update(deltaTime: number) {

    }
}

