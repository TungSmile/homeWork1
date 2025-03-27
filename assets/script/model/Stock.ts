import { _decorator, Component, Node } from 'cc';
import { TypeKeeper } from '../data/Basic';
const { ccclass, property } = _decorator;

@ccclass('Stock')
export class Stock extends Component {
    type = TypeKeeper.Stock;

    

    start() {

    }

    update(deltaTime: number) {

    }
}

