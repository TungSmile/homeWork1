import { _decorator, Component, log, Node, Vec3 } from 'cc';
import { SetupGame, typeSpecial } from '../data/Basic';
const { ccclass } = _decorator;
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
                t.dataStock.push(typeSpecial.empty);
            } else {
                cell.active = true;
                cell.on(Node.EventType.TOUCH_START, t.moreStock, t);
                t.dataStock.push(typeSpecial.end);
            }


        }
    }

    moreStock(e) {
        let t = this;
        log("nạp lần đầu là đc")
    }


    checkFreeStock() {
        let t = this;
        log("check stock", t.dataStock)

        for (let i = 0; i < t.dataStock.length; i++) {
            if (t.dataStock[i] == typeSpecial.empty) {
                return true
            }
        }
        return false
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
        if (t.checkFreeStock()) {
            for (let i = 0; i < t.dataStock.length; i++) {
                if (t.dataStock[i] == typeSpecial.empty) {
                    return i;
                }
            }
            return typeSpecial.end;
        } else {
            return typeSpecial.end;
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
            t.dataStock[id] = typeSpecial.empty;
            return true;
        }
        return false;

    }




    update(deltaTime: number) {

    }
}

