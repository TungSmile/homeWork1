import { _decorator, Component, log, Node, Vec3 } from 'cc';
import { SetupGame } from '../data/Basic';
const { ccclass, property } = _decorator;
@ccclass('StockCtrl')
export class StockCtrl extends Component {

    activeStock: number = 3; // defaul
    dataStock: number[] = [];


    protected onLoad(): void {

    }

    start() {
        let t = this;
        t.setupData()

    }


    setupData() {
        let t = this;
        if (t.activeStock >= SetupGame.Stock) {
            log("wtf stock over capacity ???");
            return
        }
        let allCells = t.node.getChildByName("Cells");
        for (let i = 0; i < SetupGame.Stock; i++) {
            let cell = allCells.children[i];
            if (i < t.activeStock) {
                cell.active = false;
                t.dataStock.push(0);
            } else {
                cell.active = true;
                cell.on(Node.EventType.TOUCH_START, t.moreStock, t);
                t.dataStock.push(-1);
                t.node.emit("test", cell)
            }


        }
    }

    moreStock(e) {
       
    }


    checkFreeStock() {
        let t = this;
        return t.dataStock.indexOf(0); // -1 is faile
    }

    getPosFreeStock() {
        let t = this;
        let allCells = t.node.getChildByName("Cells");
        let id = t.getIndexFreeStock();
        if (id != -1) {
            return allCells.children[id].getWorldPosition(new Vec3)
        } else {
            log("full busy")
            return null
        }
    }

    getIndexFreeStock() {
        let t = this;
        if (t.checkFreeStock() != -1) {
            for (let i = 0; i < t.dataStock.length; i++) {
                if (t.dataStock[i] == 0) {
                    return i;
                }
            }
            log('amazing good job,check free done but not free')
            return -1;
        } else {
            return -1;
        }
    }

    findIndexStockByType(type: number) {
        let t = this;
        for (let i = 0; i < t.dataStock.length; i++) {
            if (t.dataStock[i] == type) {
                return i;
            }
        }
        return -1;
    }

    cleanDataByType(type: number) {
        let t = this;
        let id = t.findIndexStockByType(type);
        if (id != -1) {
            t.dataStock[id] = 0;
            return true;
        }
        return false;

    }




    update(deltaTime: number) {

    }
}

