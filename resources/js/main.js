import axios from "axios";
import Vuetify from 'vuetify';

require('./bootstrap');

window.Vue = require('vue');
var VueCookie = require('vue-cookie');
Vue.use(VueCookie);
Vue.use(Vuetify, {
    iconfont: "md",
});
Vue.component('task', require('./components/Task.vue').default);
Vue.component('task-edit', require('./components/TaskEdit.vue').default);
Vue.component('task-add', require('./components/TaskAdd.vue').default);
Array.prototype.diff = function (a) {
    return this.filter(function (i) {
        return a.indexOf(i) < 0
    });
};
const app = new Vue({
        el: '#app',
        data: {
            projectAddDialog: false,
            drawer: true,
            projectMenu:false,
            newProjectTitle: '',
            projects: [],
            open: [],
            deconstructedTasks: [],
            completed: [],
            selectedProject: null,
            isLoading: false,
            taskAddDialog: false,
            selectedTaskId: 0,
            newDescription: "",
            taskIds: [],
            oldCompletedTasks: [],
            user: {},
            loaded: false,
            snackbar: {
                message: '',
                top: true,
                show: false,
                timout: 4000
            }

        },
        created() {

            if(!this.$cookie.get('access_token')){
                window.location.href = "/";
            }

            axios.defaults.headers.common = this.getHeaders();
            this.isLoading = true;
            this.getUser().then(response => {
                this.user = response.data;
                this.getProjects(this.user.id).then(response => {
                    response.data.forEach(project => this.projects.push(project));
                    this.snackbar.message = "Logged In Successfully";
                    this.snackbar.show = true;
                    this.isLoading = false;
                    this.selectedProject = this.projects[0];
                    this.getTasks(this.selectedProject.id).then(response => {
                        Vue.set(this.selectedProject, 'tasks', this.nestTasks(response.data));
                        Vue.set(this, 'open', this.taskIds);
                        this.getCompletedTasks(this.selectedProject.id).then(response => {
                            Vue.set(this, 'completed', response.data);
                        })
                    });
                });
            });


        },
        methods: {
            addTaskField(id) {
                this.taskAddDialog = true;
                this.selectedTaskId = id;
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
                this.loaded = false;
                this.isLoading = true;
                this.loaded = false;
                this.selectedProject = project;
                this.getTasks(this.selectedProject.id).then(response => {
                    this.taskIds = [];
                    Vue.set(this.selectedProject, 'tasks', this.nestTasks(response.data));

                    this.getCompletedTasks(this.selectedProject.id).then(response => {
                        Vue.set(this, 'completed', response.data);
                        this.open = this.taskIds;
                        this.isLoading = false;
                    })
                });
            },
            onUpdateTask(event) {
                let {description, id} = event;
                this.isLoading = true;
                this.updateTask(id, description).then(response => {
                    let task = this.findTask(this.selectedProject.tasks, id);
                    task.description = response.data.task.description;
                    this.changeComponent({'id': id, 'component': 'task'});
                    this.isLoading = false;
                    this.snackbar.message = response.data.message;
                    this.snackbar.show = true;
                });
            },
            onDeleteProject(){
                this.isLoading=true;
                this.deleteProjectRequest(this.selectedProject.id).then(response=>{
                    this.isLoading=false;
                    this.snackbar.message=response.data.message;
                    this.snackbar.show=true;
                    this.projects.splice(this.projects.indexOf(this.selectedProject), 1);
                    if(this.projects[0]){
                        this.changeProject(this.projects[0]);
                    }
                })
            },
            onDeleteProjectTasks(){
                this.isLoading=true;
                this.deleteProjectTasksRequest(this.selectedProject.id).then(response=>{
                    this.isLoading=false;
                    this.snackbar.message=response.data.message;
                    this.snackbar.show=true;
                    this.selectedProject.tasks=[];
                })
            },
            saveTask() {
                let parent_id = null;
                let parent = null;
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
                    this.snackbar.message = response.data.message;
                    this.snackbar.show = true;
                    newTask.id = response.data.task.id;
                    this.taskAddDialog = false;
                    parent.tasks.push(newTask);
                    this.open.push(parent_id);
                    this.isLoading = false;
                });
            },
            removeTask(id) {
                this.isLoading = true;
                axios.delete('api/task/' + id).then(response => {
                    let task = this.findTask(this.selectedProject.tasks, id);
                    if (task.parent_id) {
                        let parentTask = this.findTask(this.selectedProject.tasks, task.parent_id);
                        parentTask.tasks.splice(parentTask.tasks.indexOf(task), 1);
                    } else {
                        this.selectedProject.tasks.splice(this.selectedProject.tasks.indexOf(task), 1);
                    }
                    this.isLoading = false;
                    this.snackbar.message = response.data.message;
                    this.snackbar.show = true;
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
            getProjects(userId) {
                return axios.get('/api/user/' + userId + '/projects');
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
            onSaveProject() {
                this.isLoading = true;
                this.newProjectRequest(this.newProjectTitle).then(response => {
                    this.projects.push(response.data.project);
                    this.selectedProject = this.projects[this.projects.length-1];
                    this.snackbar.message=response.data.message;
                    this.snackbar.show=true;
                    this.isLoading=false;
                    this.projectAddDialog=false;
                })
            },
            /**
             * @returns {Promise}
             * @param {number} taskId
             * @param {string} newDescription
             */
            updateTask(taskId, newDescription) {
                return axios.patch('api/task/' + taskId, {
                    description: newDescription
                })
            },

            completeTasks(tasks) {
                return axios.post('api/task/complete', {tasks: tasks})
            },
            incompleteTasks(tasks) {
                return axios.post('api/task/incomplete', {tasks: tasks});
            },
            getCompletedTasks(projectId) {
                return axios.get('api/project/' + projectId + '/completed');
            },
            changeStatusTasks(tasks) {

                if (this.loaded) {

                    if (this.completed.length < tasks.length) {
                        this.completeTasks(tasks.diff(this.completed)).then(() => {
                            this.isLoading = false;
                        });
                    } else {
                        if (this.completed.length > tasks.length) {
                            this.incompleteTasks(this.completed.diff(tasks)).then(() => {
                                this.isLoading = false;
                            });
                        }
                    }
                    this.completed = tasks;
                }
                this.loaded = true;
            },
            getHeaders() {

                let headers = {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Authorization': 'Bearer ' + this.$cookie.get('access_token')
                };
                return headers;
            },

            getCookie(name) {
                let regexp = new RegExp("(?:^" + name + "|;\s*" + name + ")=(.*?)(?:;|$)", "g");
                let result = regexp.exec(document.cookie);
                return (result === null) ? null : result[1];
            },

            getUser() {
                return axios.get('api/user');
            },
            newProjectRequest(title) {
                return axios.post('api/project/' + this.user.id, {
                    title: title
                })
            },
            logout(){
                this.$cookie.delete('access_token');
                window.location.href = "/";
            },
            deleteProjectRequest(projectId){
                return axios.delete('/api/project/'+projectId)
            },
            deleteProjectTasksRequest(projectId){
                return axios.delete('/api/project/'+projectId+'/delete_tasks');
            }
        },
        computed: {
            selected(projectId) {
                return projectId === this.selectedProject.id;
            }
        }
    })
;
