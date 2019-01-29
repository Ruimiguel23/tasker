<template>
    <v-layout align-center justify-start>
        <v-flex shrink>
            <v-text-field autofocus label="Description" v-model="description"
                          :value="title"></v-text-field>
        </v-flex>
        <v-flex shrink>
            <v-btn :loading="loading" @click="save">Save</v-btn>
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
                description:""
            }
        },created(){
            this.description=this.title;
        },
        props: ['title', 'index','id','parent_id','loading'],
        methods: {
            save() {
                this.$emit('save-task', {'description': this.description, 'id': this.id});
            },
            cancel() {
                this.$emit('cancel-add-task', {'id':this.id,'parent_id':this.parent_id});
            }
        }
    }
</script>

<style scoped>

</style>
