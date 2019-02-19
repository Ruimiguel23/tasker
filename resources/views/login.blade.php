<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Login</title>
    <link href="https://unpkg.com/vuetify/dist/vuetify.min.css" rel="stylesheet">
</head>
<body>

<v-app dark id="app">
    <v-progress-linear style="position: fixed; padding:0;margin:0;z-index:1000" v-if="isLoading" :height="4"
                       :indeterminate="true"></v-progress-linear>
    <v-container class="my-5" >
        <v-layout row wrap justify-center >
            <v-flex xs4 md4> <h1 style="text-align: center">TASKER</h1></v-flex>
        </v-layout>

        <v-layout row wrap justify-center fill-height>
            <v-flex xs6 md4>
                <v-card>
                    <v-card-text>
                        <v-form>
                            <v-text-field  v-model="email" label="E-mail" name="email" type="text"
                                          required></v-text-field>
                            <v-text-field v-model="password" label="Password" name="password" type="password"
                                          required></v-text-field>
                            <v-layout fluid row wrap justify-space-between>

                                <v-flex xs4 md3>
                                    <v-btn class="primary" block @click="sendLoginRequest">Login</v-btn>
                                </v-flex>

                                <v-flex xs4 md3>
                                    <v-btn @click="dialog=true" flat block>Sign-up</v-btn>
                                </v-flex>

                            </v-layout>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-flex>


            <!-- REGISTER MODAL !-->
            <v-dialog v-model="dialog" persistent max-width="600px">
                <v-card>
                    <v-card-title>
                        <span class="headline">Sign-Up</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-flex xs12>
                                    <v-text-field @input="error.name=[]" :error-messages="error.name" v-model="registerData.name" label="Name*" required></v-text-field>
                                </v-flex>
                                <v-flex xs12>
                                    <v-text-field @input="error.email=[]"  :error-messages="error.email" v-model="registerData.email" label="Email*" required></v-text-field>
                                </v-flex>
                                <v-flex xs12>
                                    <v-text-field @input="error.password=[]"  :error-messages="error.password" v-model="registerData.password" label="Password*" type="password"
                                                  required></v-text-field>
                                </v-flex>
                            </v-layout>
                        </v-container>
                        <small>*indicates required field</small>
                    </v-card-text>
                    <v-card-actions>
                        <v-layout fluid row wrap justify-space-between>
                            <v-flex xs4 md3>
                                <v-btn class="primary" @click="sendRegisterRequest" block>Sign-Up</v-btn>
                            </v-flex>
                            <v-flex xs4 md3>
                                <v-btn @click="dialog=false" flat block>Close</v-btn>
                            </v-flex>
                        </v-layout>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <v-snackbar
                v-model="snackbar.show"
                :timeout="snackbar.timeout"
                :top="snackbar.top"
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

        </v-layout>
    </v-container>
</v-app>

</body>
<script src="{{asset('js/login.js')}}"></script>
</html>
