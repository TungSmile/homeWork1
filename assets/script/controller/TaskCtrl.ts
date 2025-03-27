import { _decorator, Component, instantiate, log, Node, Prefab, SpriteFrame, Vec3 } from 'cc';
import { TaskMission } from '../model/TaskMission';
import { Configute, SetupGame } from '../data/Basic';
import { DataGame } from '../data/DataGame';
const { ccclass, property } = _decorator;

@ccclass('TaskCtrl')
export class TaskCtrl extends Component {

    @property({ type: Prefab })
    taskMission: Prefab = null;
    dataCreateTask = null;
    numTask: number = 0;
    @property({ type: [SpriteFrame] })
    icons: SpriteFrame[] = [];
    @property({ type: [SpriteFrame] })
    shadows: SpriteFrame[] = [];

    start() {
        let t = this;
    }

    getData(data) {
        let t = this;
        t.dataCreateTask = data.data;
        t.numTask = data.numTask
    }

    createTask() {
        let t = this;
        let sizeTask = Configute.weightScene / SetupGame.TotalTask;
        let startX = -(Configute.weightScene - sizeTask) / 2;
        for (let i = 0; i < t.numTask; i++) {
            let task = instantiate(t.taskMission);
            let temp = task.getComponent(TaskMission);
            let type = t.dataCreateTask[i];
            task.name = "T" + i
            temp.resetTask(type, t.icons[type], t.shadows[type]);
            t.node.addChild(task);
            let posX = startX + (sizeTask * i)
            task.setPosition(new Vec3(posX, 0, 0))
        }
    }

    




    update(deltaTime: number) {

    }
}

