<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>

    <link href="https://unpkg.com/vuetify/dist/vuetify.css" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="{{asset('css/main.css')}}" >
    <link href="https://fonts.googleapis.com/css?family=Material+Icons" rel="stylesheet">
</head>
<body>
<v-app dark id="app">

    <v-navigation-drawer app fixed v-model="drawer" enable-resize-watcher>
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
                    <v-list-tile-title>@{{project.title}}</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
        </v-list>
    </v-navigation-drawer>
    <v-content>

        <v-container grid-list-md fluid v-if="selectedProject">

            <h1>@{{ selectedProject.title }}</h1>
            <v-divider></v-divider>
            <v-treeview :value="completed"  :open="open" item-key="id" :items="selectedProject.tasks" item-children="tasks" selectable hoverable :transition=true style="padding-top: 1rem">

                <template slot="label" slot-scope="{item,open,leaf}">
                    <component @remove-task="removeTask" @cancel-add-task="cancelAddTask" :parent_id="item.parent_id" @add-task="addTaskField" @save-task="saveTask" @change-task-component="changeComponent" :is="item.component" :description="item.description" :loading="isLoading"
                               :id=item.id></component>
                </template>
            </v-treeview>
            <!--
                <v-fade-transition transition-group>
                        <div v-for="(task,index) in deconstructedTasks" :key="task.title">
                            <component v-if="task.expanded" @change-status="changeStatus" @cancel-add-task="remove"
                                       @add-task="addTaskField"
                                       @toggle-expand="toggleExpand"
                                       @save-task="saveTask" @change-task-component="changeComponent" :index="index"
                                       :status="task.status" :expanded="task.expanded"
                                       :style="'margin-left:'+ setMargin(task.level)" :is="task.component"
                                       :description="task.title"></component>
                            <v-divider></v-divider>
                        </div>
                </v-fade-transition>
                --!>
            <p @click="addTaskField">+ Add task</p>
            <v-progress-linear v-if="isLoading" :height="2" :indeterminate="true"></v-progress-linear>
            <v-dialog v-model="taskAddDialog">
                <v-card>
                    <v-card-title>
                        <span class="headline">Sign-Up</span>
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
                                <v-btn @click="dialog=false" flat block>Cancel</v-btn>
                            </v-flex>
                        </v-layout>
                    </v-card-actions>
                </v-card>
            </v-dialog>

        </v-container>
    </v-content>
</v-app>
</body>
<script src="{{asset('js/main.js')}}"></script>
</html>
