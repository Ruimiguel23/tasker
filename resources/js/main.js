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
        isLoading: false,
        taskAddDialog: false,
        selectedTaskId: 0,
        newDescription:"",
        taskIds:[],
    },
    created() {

        this.getProjects().then(response => {
            response.data.forEach(project => this.projects.push(project));
            this.selectedProject = this.projects[0];
            this.getTasks(this.selectedProject.id).then(response => {
                Vue.set(this.selectedProject, 'tasks', this.nestTasks(response.data));
                Vue.set(this,'open',this.taskIds);
            });
        });

    },
    methods: {
        addTaskField(id) {
            this.taskAddDialog = true;
            this.selectedTaskId = id;
            /*if (typeof id === "number") {
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
                this.open.push(id);
            }*/

        },
        nestTasks(tasks) {
            let newTask = null;
            let oldId = null;
            let nestedTasks = [];
            tasks.forEach(task => {
                this.taskIds.push(task.id);
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
            this.getTasks(this.selectedProject.id).then(response => {
                Vue.set(this.selectedProject, 'tasks', this.nestTasks(response.data));
            });
        },
        saveTask(isNewTask) {
            console.log(isNewTask);

            if(isNewTask) {
                let parent_id = null;
                let parent = null;
                console.log(this.selectedTaskId);
                if (typeof (this.selectedTaskId) === 'number') {
                    parent = this.findTask(this.selectedProject.tasks, this.selectedTaskId);
                    parent_id = parent.id;
                } else {
                    parent = this.selectedProject;
                }
                this.isLoading = true;
                if (!parent.tasks) {
                    Vue.set(parent, 'tasks', []);
                }
                let newTask = {
                    description: this.newDescription,
                    parent_id: parent_id,
                    component: 'task'
                };
                this.newTask(newTask).then(response => {
                    newTask.id = response.data.id;
                    this.taskAddDialog = false;
                    parent.tasks.push(newTask);
                    this.open.push(parent_id);
                    this.isLoading = false;
                });
            }else{

            }
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
        removeTask(id) {
            this.isLoading = true;
            axios.delete('api/task/' + id).then(() => {
                let task = this.findTask(this.selectedProject.tasks, id);
                if (task.parent_id) {
                    let parentTask = this.findTask(this.selectedProject.tasks, task.parent_id);
                    parentTask.tasks.splice(parentTask.tasks.indexOf(task), 1);
                } else {
                    this.selectedProject.tasks.splice(this.selectedProject.tasks.indexOf(task), 1);
                }
                this.isLoading = false;
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

        /**
         * @returns {Promise}
         */
        getProjects() {
            return axios.get('/api/user/1/projects');
        },
        /**
         * @param {number} projectId
         * @returns {Promise}
         */
        getTasks(projectId) {
            return axios.get('api/project/' + projectId + '/tasks');
        },

        /**
         * @param {Object} task
         * @param {String} description
         * @returns {Promise}
         */
        newTask(task) {
            return axios.post('/api/task', {
                'project_id': this.selectedProject.id,
                'user_id': 1,
                'parent_id': task.parent_id,
                'completed': false,
                'description': task.description
            })
        },
        newTaskId(projectId) {
            return axios.get('/api/project/' + projectId + '/task/new_id');
        }
    }
});
