import { _decorator, Component, instantiate, log, Node, Prefab, Tween, tween, Vec3 } from 'cc';
import { DataGame } from '../data/DataGame';
import { styleStore } from '../data/Basic';
const { ccclass, property } = _decorator;

@ccclass('StoreCtrl')
export class StoreCtrl extends Component {

    @property({ type: Prefab })
    conveyor: Prefab = null;

    @property({ type: Prefab })
    cave: Prefab = null;

    private store: Node = null;





    start() {

    }


    createStore() {
        let t = this;
        switch (DataGame.instance.styleStore) {
            case styleStore.Cave:
                t.store = instantiate(t.cave);
                t.node.addChild(t.store);
                t.store.setPosition(DataGame.instance.positionStore);
                break;
            case styleStore.Conveyor:
                t.store = instantiate(t.conveyor);
                t.node.addChild(t.store);
                t.store.setPosition(DataGame.instance.positionStore);
                t.belt = t.store.getChildByName("arrow");
                t.AAMIB();
                t.store.getChildByName("thanh_truyen").on(Node.EventType.TOUCH_START, t.SC, t);
                break;
            default:
                break;
        }
    }


    // for case store is conveyor
    private belt: Node = null;
    effectBelt = null;
    timeAnimConveyor = 1;
    isOnMovingBelt: boolean = true;

    // animation arrow moving in belt only conveyor store
    AAMIB() {
        let t = this;
        if (!t.isOnMovingBelt) {
            return
        }
        t.belt.children.forEach(arrow => {
            let rs = arrow.getPosition(new Vec3).x >= -500;
            if (rs) {
                tween(arrow)
                    .by(t.timeAnimConveyor / 2, { position: new Vec3(- 50, 0, 0) })
                    // .by(0, { position: new Vec3(rs ? 600 : 0, 0, 0) })
                    .call(() => {

                    })
                    .start()
            } else {
                arrow.setPosition(new Vec3(600, 0, 0))
            }



        });
        t.effectBelt = tween(t.belt)
            .delay(t.timeAnimConveyor / 2)
            .call(() => {
                t.AAMIB();
            })
            .start()
    }

    // stop conveyor 
    SC() {
        let t = this;
        t.isOnMovingBelt = !t.isOnMovingBelt
        if (t.isOnMovingBelt) {
            t.AAMIB();
        }
    }




    update(deltaTime: number) {

    }
}

