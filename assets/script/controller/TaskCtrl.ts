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
            task.name = "T" + i;
            temp.resetTask(type, t.icons[type], t.shadows[type], Configute.timeAnim, 0);
            t.node.addChild(task);
            let posX = startX + (sizeTask * i);
            task.setPosition(new Vec3(posX, 0, 0));
        }
    }


    getPosTaskByIndex(index: number) {
        let t = this;
        let rs = t.node.getChildByName("T" + index).getComponent(TaskMission).getPos()
        return rs ? rs : null;
    }

    resetTask(index: number, type: number, time: number, wait: number) {
        let t = this;
        t.node.getChildByName("T" + index).getComponent(TaskMission).resetTask(type, t.icons[type], t.shadows[type], time, wait);
        DataGame.instance.countTaskDone++;
    }

    closeTask(index: number, time: number, wait: number) {
        let t = this;
        t.node.getChildByName("T" + index).getComponent(TaskMission).closeDoorForDone(time, wait);
    }

    update(deltaTime: number) {

    }
}

