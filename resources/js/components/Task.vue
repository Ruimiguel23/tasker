<template>
    <v-layout align-center justify-start>
        <v-flex shrink>
            <v-checkbox @change="changeStatus" v-model="dataStatus" :label="description"></v-checkbox>
        </v-flex>
        <v-flex shrink>
            <v-icon @click="add">add</v-icon>
        </v-flex>
        <v-flex shrink>
            <v-icon small @click="edit">edit</v-icon>
        </v-flex>
        <v-flex shrink>
            <v-icon>remove</v-icon>
        </v-flex>
        <v-flex shrink>
            <v-icon @click="toggleExpand">keyboard_arrow_down</v-icon>
        </v-flex>

    </v-layout>
</template>

<script>
    export default {
        name: "Task",
        data: function () {
            return {
                dataStatus: this.status,
            }
        },
        props: ['description', 'index', 'status','expanded'],
        watch: {
            status: function () {
                this.dataStatus = this.status;
            }
        },
        methods: {
            edit() {
                this.$emit('change-task-component', {'component': 'task-edit', 'index': this.index})
            },
            add() {
                this.$emit('add-task', this.index)
            },
            changeStatus() {
                this.$emit('change-status', {'status': this.dataStatus, 'index': this.index})
            },
            toggleExpand(){
                this.$emit('toggle-expand', {'expand':!this.expanded,'index':this.index});
            }
        }
    }
</script>

<style scoped>
</style>