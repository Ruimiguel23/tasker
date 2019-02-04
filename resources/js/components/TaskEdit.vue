<template>
    <v-layout align-center justify-start>
        <v-flex shrink>
            <v-text-field :loading="isLoading" autofocus label="Description" v-model="dataDescription"
                          :value="description"></v-text-field>
        </v-flex>
        <v-flex shrink>
            <v-btn @click="save">Save</v-btn>
        </v-flex>
        <v-flex shrink>
            <v-btn @click="cancel">Cancel</v-btn>
        </v-flex>
    </v-layout>
</template>

<script>
    export default {
        name: "Task",
        data: function () {
            return {
                isLoading: false,
                dataDescription:this.description,
            }
        },
        props: ['description', 'index','id'],
        methods: {
            toggleLoading() {
                this.isLoading = !this.isLoading;
            },
            save() {
                this.$emit('update-task', {'description': this.dataDescription, 'id': this.id});
            },
            cancel() {
                this.$emit('change-task-component', {'component': 'task', 'id': this.id});
            }
        }
    }
</script>

<style scoped>

</style>
