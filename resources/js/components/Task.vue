<template>
    <v-layout align-center justify-start>
        <v-flex shrink>
           {{id}}. {{description}}
        </v-flex>
        <v-flex shrink>
            <v-icon small @click="add">add</v-icon>
        </v-flex>
        <v-flex shrink>
            <v-icon small @click="edit">edit</v-icon>
        </v-flex>
        <v-flex shrink>
            <v-icon small @click="remove">remove</v-icon>
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
        props: ['description', 'status','expanded','id'],
        watch: {
            status: function () {
                this.dataStatus = this.status;
            }
        },
        methods: {
            edit() {
                this.$emit('change-task-component', {'component': 'task-edit', 'id': this.id})
            },
            add() {
                this.$emit('add-task', this.id)
            },
            changeStatus() {
                this.$emit('change-status', {'status': this.dataStatus, 'id': this.id})
            },
            remove(){
                this.$emit('remove-task',this.id);
            }
        }
    }
</script>

<style scoped>
</style>
