
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');
import axios from "axios";

window.Vue = require('vue');

import Vuetify from 'vuetify';
/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i)
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))
Vue.use(Vuetify,{
    iconfont:"md",
});
var VueCookie = require('vue-cookie');
Vue.use(VueCookie);
/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

const app = new Vue({
    el: '#app',
    data:{
        dialog:false,
        email:'',
        password:'',
        isLoading:false,
        registerData:{
            email:'',
            name:'',
            password:'',
        },
        snackbar:{
            message:'',
            top:true,
            show:false,
            timout:4000
        },
        error:{
            name:[],
            email:[],
            password:[],
        }
    },
    methods:{
        sendLoginRequest(){
            this.isLoading=true;
            axios.post('/api/user/login',{
                email:this.email,
                password:this.password,
                headers:{
                    'Content-Type':'application/json',
                    'X-Requested-With':'XMLHttpRequest'
                }
            }).then(response=>{
                this.isLoading=false;
                this.$cookie.set('access_token',response.data.access_token);
                window.location.href = "/tasks";
            }).catch(error=>{
                this.isLoading=false;
                console.log(error);
                this.snackbar.message='Credentials not found';
                this.snackbar.show=true;
            })
        },
        sendRegisterRequest(){
            this.isLoading=true;
            axios.post('api/user/register',{
                email:this.registerData.email,
                name:this.registerData.name,
                password:this.registerData.password,
            }).then(response=>{
                console.log(response);
                this.isLoading=false;
                this.snackbar.message=response.data.message;
                this.snackbar.show=true;
                this.dialog=false;
            }).catch(error=>{
                this.error=error.response.data.errors;
                console.log(error.response);
                this.isLoading=false;
            })
        }
    }
});
