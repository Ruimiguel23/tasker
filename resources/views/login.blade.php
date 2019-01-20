<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <link href="https://unpkg.com/vuetify/dist/vuetify.min.css" rel="stylesheet">
</head>
<body>

<v-app dark id="app">
    <v-container class="my-5">
        <v-layout row wrap justify-center>

            <v-flex xs12 md6>
                <v-card>
                    <v-card-text>
                        <v-form>
                            <v-text-field label="E-mail" name="email" type="text" required></v-text-field>
                            <v-text-field label="Password" name="password" type="text" required></v-text-field>
                            <v-layout fluid row wrap justify-space-between>

                                <v-flex xs4 md3>
                                    <v-btn class="primary" block>Login</v-btn>
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
                                    <v-text-field label="Name*" required></v-text-field>
                                </v-flex>
                                <v-flex xs12>
                                    <v-text-field label="Email*" required></v-text-field>
                                </v-flex>
                                <v-flex xs12>
                                    <v-text-field label="Password*" type="password" required></v-text-field>
                                </v-flex>
                            </v-layout>
                        </v-container>
                        <small>*indicates required field</small>
                    </v-card-text>
                    <v-card-actions>
                        <v-layout fluid row wrap justify-space-between>
                            <v-flex xs4 md3>
                                <v-btn class="primary" @click="dialog=false" block>Sign-Up</v-btn>
                            </v-flex>
                            <v-flex xs4 md3>
                                <v-btn @click="dialog=false" flat block>Close</v-btn>
                            </v-flex>
                        </v-layout>
                    </v-card-actions>
                </v-card>
            </v-dialog>

        </v-layout>
    </v-container>
</v-app>

</body>
<script src="{{asset('js/login.js')}}"></script>
</html>