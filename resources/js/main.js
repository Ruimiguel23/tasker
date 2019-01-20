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
                    status: false,
                    component: "task",
                    expanded:true,
                    tasks: [{
                        title: "Something level 1",
                        status: false,
                        component: "task",
                        expanded:true,
                        tasks: [{title: "Something level 2", status: false, expanded:true,component: "task"}]
                    }, {
                        title: "Something2 level 1",
                        status: false,
                        component: "task",
                        expanded:true,
                        tasks: [{title: "Something2 level 2", status: false,expanded:true, component: "task"}]
                    }]
                },
                {title: "Another Something", status: false, expanded:true,component: "task"}],

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
        this.deconstructTasks(this.selectedProject.tasks, 0);
    },
    methods: {
        addTaskField(index) {
            let selectedTask = this.deconstructedTasks[index];
            let newTask = {
                title: "",
                component: "task-add",
                level: selectedTask.level + 1
            };
            this.deconstructedTasks.splice(index + 1, 0, newTask);
        },
        changeComponent(event) {
            this.deconstructedTasks[event.index].component = event.component;
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
        setMargin(level) {
            return 50 * level + "px";
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
        toggleExpand(event){
            let {expand, index} = event;
            let changedTask = this.deconstructedTasks[index];
            let changedTaskLevel = changedTask.level;
            while (this.deconstructedTasks[index + 1].level > changedTaskLevel) {
                this.deconstructedTasks[index + 1].expanded = expand;
                index = index + 1;
            }
        }

    }
});
