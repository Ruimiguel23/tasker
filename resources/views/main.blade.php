<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Tasks</title>

    <link href="https://unpkg.com/vuetify/dist/vuetify.css" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="{{asset('css/main.css')}}">
    <link href="https://fonts.googleapis.com/css?family=Material+Icons" rel="stylesheet">
</head>
<body>
<v-app dark id="app">
    <v-dialog v-model="projectAddDialog" max-width="400px">
        <v-card>
            <v-card-title>
                <span class="headline">New Project</span>
            </v-card-title>
            <v-card-text>
                <v-container grid-list-md>
                    <v-layout wrap>
                        <v-flex xs12>
                            <v-text-field v-model="newProjectTitle" label="Title" required></v-text-field>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-layout fluid row wrap justify-space-between>
                    <v-flex xs4 md3>
                        <v-btn class="primary" @click="onSaveProject" block>Submit</v-btn>
                    </v-flex>
                    <v-flex xs4 md3>
                        <v-btn @click="projectAddDialog=false" flat block>Cancel</v-btn>
                    </v-flex>
                </v-layout>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-progress-linear style="position: fixed; padding:0;margin:0;z-index:1000" v-if="isLoading" :height="4"
                       :indeterminate="true"></v-progress-linear>
    <v-toolbar clipped-left app>
        <v-toolbar-side-icon @click="drawer=true"></v-toolbar-side-icon>
        <v-toolbar-title>Tasker</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-menu offset-y>
            <v-btn
                slot="activator"
                flat
                dark
            >
                @{{user.name}}
            </v-btn>

            <v-list>
                <v-list-tile @click="logout">
                    <v-list-tile-title>Logout</v-list-tile-title>
                </v-list-tile>
            </v-list>
        </v-menu>
    </v-toolbar>
    <v-navigation-drawer app clipped v-model="drawer" enable-resize-watcher>
        <v-list dense class="pt-0">
            <v-toolbar flat>
                <v-list>
                    <v-list-tile>
                        <v-list-tile-title class="title">
                            Projects
                        </v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-toolbar>
            <v-divider></v-divider>
            <v-list-tile
                v-for="project in projects"
                :key="project.title"
                @click="changeProject(project)"
            >
                <v-list-tile-content>
                    <v-list-tile-title><p :class="{selected:project.id===selectedProject.id}">@{{project.title}}</p>
                    </v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
            <v-list-tile><p @click="projectAddDialog=true" style="font-size: small">+ Add project</p></v-list-tile>
        </v-list>

    </v-navigation-drawer>

    <v-content>

        <v-container grid-list-md fluid v-if="selectedProject">
            <v-layout row align-center>
                <h1>@{{ selectedProject.title }}</h1>
                <v-spacer></v-spacer>
                    <v-menu offset>
                        <v-btn slot="activator">
                            <v-icon>more_horiz</v-icon>
                        </v-btn>
                        <v-list>
                            <v-list-tile @click="">
                                <v-list-tile-title>Change title</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile @click="onDeleteProject">
                                <v-list-tile-title>Delete project</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile @click="onDeleteProjectTasks">
                                <v-list-tile-title>Delete all tasks</v-list-tile-title>
                            </v-list-tile>
                        </v-list>
                    </v-menu>
            </v-layout>
            <v-divider></v-divider>
            <v-treeview :value="completed" @input="changeStatusTasks" :open="open" item-key="id"
                        :items="selectedProject.tasks"
                        item-children="tasks" selectable hoverable :transition=true style="padding-top: 1rem">
                <template slot="label" slot-scope="{item,open,leaf}">
                    <component @update-task="onUpdateTask" @remove-task="removeTask" :parent_id="item.parent_id"
                               @add-task="addTaskField" @save-task="saveTask" @change-task-component="changeComponent"
                               :is="item.component" :description="item.description" :loading="isLoading"
                               :id=item.id></component>
                </template>
            </v-treeview>
            <p @click="addTaskField">+ Add task</p>
            <v-dialog v-model="taskAddDialog" max-width="400px">
                <v-card>
                    <v-card-title>
                        <span class="headline">New task</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-flex xs12>
                                    <v-text-field v-model="newDescription" label="Description" required></v-text-field>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-layout fluid row wrap justify-space-between>
                            <v-flex xs4 md3>
                                <v-btn class="primary" @click="saveTask(true)" block>Submit</v-btn>
                            </v-flex>
                            <v-flex xs4 md3>
                                <v-btn @click="taskAddDialog=false" flat block>Cancel</v-btn>
                            </v-flex>
                        </v-layout>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-snackbar
                v-model="snackbar.show"
                :top="snackbar.top"
                :timeout="snackbar.timout"
            >
                @{{snackbar.message}}
                <v-btn
                    color="pink"

                    flat
                    @click="snackbar.show = false"
                >
                    Close
                </v-btn>
            </v-snackbar>

        </v-container>
    </v-content>
</v-app>
</body>
<script src="{{asset('js/main.js')}}"></script>
</html>
