import { _decorator, Component, Node, Vec3 } from 'cc';
import { statusCube, statusTouch } from './Basic';
const { ccclass, property } = _decorator;

@ccclass('DataGame')
export class DataGame extends Component {

    private static _instance: any = null;
    static getInstance<T>(): T {
        if (this._instance === null) {
            this._instance = new this();
        }
        return this._instance;
    }

    static get instance() {
        return this.getInstance<DataGame>();
    }

    scriptCube = [0, 0, -1, -1, 1, 0, -1, -1, 8, 3, 4, 5, 2, 2, 6, 7, 1, 1, 7, 7];
    scriptSlot = [[-1, -1, 0, 0], [-1, 0, 1, 1], [8, 3, 4, 5], [2, 2, 6, 7], [1, 1, 7, 7]];
    scriptTask = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];




    mapSlot = [new Vec3(-350, 250, 0), new Vec3(350, 250, 0), new Vec3(0, 0, 0), new Vec3(-350, -250, 0), new Vec3(350, -250, 0)];
    statusEvent: statusCube = statusCube.NoMove;
    countCube: number = 0;
    statusTouch: statusTouch = statusTouch.Indle;
    countTurnPlay: number = 0;


    // readNameCustoms(name: string) {
    //     let index = name.slice(1);
    //     let type = name.slice(0, 1);
    // }







}

