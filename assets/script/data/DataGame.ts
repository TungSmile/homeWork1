import { _decorator, Component, Node, Vec3 } from 'cc';
import { CodeHexColor, statusCube, statusTouch } from './Basic';
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
    scriptSlot = [[-1, 0, 0], [0, 1, 1], [2, 1, 2], [2, 2, 7], [-1, 1, 1], [1, 7, 7], [-1, 2, 2]];
    scriptTask = [2, 7, 0, 1, 1, 2];


    colorTable = [CodeHexColor.Orange, CodeHexColor.Black, CodeHexColor.Red, CodeHexColor.Violet, CodeHexColor.Pink, CodeHexColor.Yellow, CodeHexColor.Gray, CodeHexColor.Blue, CodeHexColor.LightBlue, CodeHexColor.Green]

    mapSlot = [new Vec3(-400, 250, 0), new Vec3(400, 250, 0), new Vec3(150, 250, 0), new Vec3(-150, 250, 0), new Vec3(-250, -300, 0), new Vec3(0, -300, 0), new Vec3(250, -300, 0)];
    statusEvent: statusCube = statusCube.NoMove;
    countCube: number = 0;
    statusTouch: statusTouch = statusTouch.Indle;
    countTurnPlay: number = 0;
    isAnim: boolean = false;

    // readNameCustoms(name: string) {
    //     let index = name.slice(1);
    //     let type = name.slice(0, 1);
    // }

    endGame: boolean = false;
    isWin: boolean = false;

    countCubeDone: number = 0;
    countTaskDone: number = 0;
    countSlotDone: number = 0;

}

