import { _decorator, Component, Node } from 'cc';
import { TypeKeeper } from '../data/Basic';
const { ccclass, property } = _decorator;

@ccclass('Store')
export class Store extends Component {
    type = TypeKeeper.Store;
    @property
    style = 0;
    listCube: [] = [];

    start() {
        let t = this;
        t.getData()

    }

    getData() {

    }

    getCubeByCave() {
        // only use type 2

        let t = this;
        let rs = -1;
        if (t.listCube.length <= 0) {
            return rs;
        }
        rs = t.listCube.shift();
        return rs;
    }



    renderUI() {
        let t = this;
        // type 1 : conceyor 
        // type 2 : cave
        // type 3 : ...
    }


    update(deltaTime: number) {

    }
}

