<template>
    <v-layout align-center justify-start>
        <v-flex shrink>
            <v-text-field :loading="isLoading" autofocus label="Description" v-model="description"
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
            }
        },
        props: ['description', 'index','id'],
        methods: {
            toggleLoading() {
                this.isLoading = !this.isLoading;
            },
            save() {
                this.$emit('save-task', {'description': this.description, 'id': this.id});
                this.cancel();
            },
            cancel() {
                this.$emit('change-task-component', {'component': 'task', 'id': this.id});
            }
        }
    }
</script>

<style scoped>

</style>
