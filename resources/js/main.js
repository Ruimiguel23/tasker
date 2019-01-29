import axios from "axios";
import Vuetify from 'vuetify';

require('./bootstrap');

window.Vue = require('vue');


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
        projects: [],
        open: [],
        deconstructedTasks: [],
        completed: [],
        selectedProject: null,
        isLoading:false,
    },
    created() {

        this.getProjects().then(response => {
            response.data.forEach(project => this.projects.push(project));
            this.selectedProject = this.projects[0];
            this.getTasks(this.selectedProject.id).then(response => {
                Vue.set(this.selectedProject, 'tasks', this.nestTasks(response.data));
            });
        });

    },
    methods: {
        addTaskField(id) {
            if (typeof id === "number") {
                let task = this.findTask(this.selectedProject.tasks, id);
                let newTask = {
                    description: "",
                    component: "task-add",
                    id: -1,
                    parent_id: id
                };
                if (!task.tasks) {
                    Vue.set(task, 'tasks', [])
                }
                task.tasks.push(newTask);
                this.open.push(id);
            } else {
                let newTask = {
                    title: "",
                    component: "task-add",
                    id: -1,
                    parent_id: null
                };
                this.selectedProject.tasks.push(newTask);
            }


        },
        nestTasks(tasks) {
            let newTask = null;
            let oldId = null;
            let nestedTasks = [];
            tasks.forEach(task => {
                task.tasks = [];
                task.component = 'task';
                if (task.parent_id === null) {
                    nestedTasks.push(task);
                } else {
                    let foundTask = this.findTask(nestedTasks, task.parent_id);
                    foundTask.tasks.push(task);
                }
            });
            return nestedTasks;
        },
        changeComponent(event) {
            let task = this.findTask(this.selectedProject.tasks, event.id);
            task.component = event.component;
        },
        changeProject(project) {
            this.selectedProject = project;
            this.open=[];
            this.getTasks(this.selectedProject.id).then(response => {
                Vue.set(this.selectedProject, 'tasks', this.nestTasks(response.data));
            });
        },
        saveTask(event) {
            let {description, id} = event;
            let task = this.findTask(this.selectedProject.tasks, id);
            this.isLoading=true;
            axios.post('/api/task', {
                'project_id': this.selectedProject.id,
                'user_id': 1,
                'parent_id': task.parent_id,
                'completed': false,
                'description': description
            }).then(response => {
                task.id=response.data.id;
                task.description = description;
                this.isLoading=false;
                this.changeComponent({'id':task.id,'component':'task'});
            });
        },

        cancelAddTask(event) {
            let {id, parent_id} = event;
            if (parent_id !== null) {
                let parentTask = this.findTask(this.selectedProject.tasks, parent_id);
                parentTask.tasks.splice(-1, 1);
            } else {
                this.selectedProject.tasks.splice(-1, 1);
            }
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
        removeTask(id){
            this.isLoading=true
            axios.delete('api/task/'+id).then(()=>{
                let task = this.findTask(this.selectedProject.tasks,id);
                if(task.parent_id){
                    let parentTask = this.findTask(this.selectedProject.tasks,task.parent_id);
                    parentTask.splice(parentTask.tasks.indexOf(task),1);
                }else{
                    this.selectedProject.tasks.splice(this.selectedProject.tasks.indexOf(task),1);
                }
                this.isLoading=false;
            });
        },

        findTask(tasks, id) {
            for (let task of tasks) {
                if (task.id === id) {
                    return task
                }
                if (task.tasks) {
                    let result = this.findTask(task.tasks, id);
                    if (result) {
                        return result
                    }
                }
            }
            return null;
        },
        getProjects() {
            return axios.get('/api/user/1/projects');
        },
        getTasks(projectId) {
            return axios.get('api/project/'+projectId+'/tasks');
        }
    }
});
