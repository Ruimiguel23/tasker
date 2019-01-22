require('./bootstrap');

window.Vue = require('vue');
import Vuetify from 'vuetify';

Vue.use(Vuetify, {
    iconfont: "md",
});
Vue.component('task', require('./components/Task.vue').default);
Vue.component('task-edit', require('./components/TaskEdit.vue').default);
Vue.component('task-add', require('./components/TaskAdd.vue').default);
const app = new Vue({
    el: '#app',
    data: {
        drawer: true,
        deconstructedTasks: [],
        projects: [{
            title: "First project",
            tasks: [
                {
                    title: "Something",
                    id: 1,
                    status: false,
                    component: "task",
                    expanded: true,
                    tasks: [{
                        title: "Something level 1",
                        id: 2,
                        status: false,
                        component: "task",
                        expanded: true,
                        tasks: [{title: "Something level 2", id: 10, status: false, expanded: true, component: "task"}]
                    }, {
                        title: "Something2 level 1",
                        id: 3,
                        status: false,
                        component: "task",
                        expanded: true,
                        tasks: [{
                            title: "Something2 level 2",
                            id: 4,
                            status: false,
                            expanded: true,
                            component: "task"
                        }]
                    }]
                },
                {
                    title: "Another Something",
                    status: false,
                    id: 5,
                    expanded: true,
                    component: "task"
                }],

        }
            , {
                title: "Second project",
                tasks: [
                    {title: "Something", component: "task"}
                ],
            }
            , {
                title: "Third Project",
                tasks: [
                    {title: "Something"}
                ],
                component: "task",
            }
        ],
        selectedProject: null
    },
    created() {
        this.selectedProject = this.projects[0];
    },
    methods: {
        addTaskField(id) {
            let task = this.findTask(this.selectedProject.tasks, id);
            let newTask = {
                title: "",
                component: "task-add",
            };
            task.push(newTask);
        },
        changeComponent(event) {
            let task = this.findTask(this.selectedProject.tasks, event.id);
            task.component = event.component;
        },
        deconstructTasks(aTasks, level) {
            aTasks.forEach(task => {
                let deconstructedTask = task;
                deconstructedTask.level = level;
                this.deconstructedTasks.push(deconstructedTask);
                if (task.tasks) {
                    this.deconstructTasks(task.tasks, level + 1);
                }
            })
        },
        changeProject(project) {
            this.selectedProject = project;
            this.deconstructedTasks = [];
            this.deconstructTasks(project.tasks, 0);
        },
        saveTask(event) {
            let {description, index} = event;
            this.deconstructedTasks[index].title = description;
        },
        remove(index) {
            this.deconstructedTasks.splice(index, 1);
        },
        changeStatus(event) {
            let {status, index} = event;
            let changedTask = this.deconstructedTasks[index];
            let changedTaskLevel = changedTask.level;
            while (this.deconstructedTasks[index + 1].level > changedTaskLevel) {
                this.deconstructedTasks[index + 1].status = status;
                index = index + 1;
            }
        },
        toggleExpand(event) {
            let {expand, index} = event;
            let changedTask = this.deconstructedTasks[index];
            let changedTaskLevel = changedTask.level;
            while (this.deconstructedTasks[index + 1].level > changedTaskLevel) {
                this.deconstructedTasks[index + 1].expanded = expand;
                index = index + 1;
            }
        },
        findTask(tasks, id) {

            for(let task of tasks){
                if(task.id===id){
                    return task
                }
                if(task.tasks){
                    let result=this.findTask(task.tasks,id);
                    if(result){
                        return result
                    }
                }
            }
            return null;
        },
    }
});
