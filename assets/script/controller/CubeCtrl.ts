import { _decorator, Component, instantiate, Node, Prefab, SpriteFrame, Vec3 } from 'cc';
import { DataGame } from '../data/DataGame';
import { ItemCube } from '../model/ItemCube';
const { ccclass, property } = _decorator;

@ccclass('CubeCtrl')
export class CubeCtrl extends Component {

    @property({ type: Prefab })
    Cube: Prefab = null;

    start() {

    }

    createCube(type: number, posWrold: Vec3, imgIcon: SpriteFrame) {
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
    }




    update(deltaTime: number) {

    }
}

