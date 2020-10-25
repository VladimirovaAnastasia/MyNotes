<template>

    <form class="md-layout" @submit.prevent="submitHandler">

        <md-card class="md-layout-item md-size-30 md-small-size-100">

            <md-card-content>

                <md-card-header>
                    <div class="md-title">Страница логина</div>
                </md-card-header>

                <div class="md-layout md-gutter">
                    <div class="md-layout-item md-small-size-100">
                        <md-field :class="getValidationClass('email')">
                            <label>Введите Email</label>
                            <md-input name="email" autocomplete="given-name" v-model="email"/>
                            <span class="md-error" v-if="!$v.email.required">Требуется ввести Email</span>
                        </md-field>
                    </div>
                </div>

                <md-field :class="getValidationClass('password')">
                    <label>Введите пароль</label>
                    <md-input name="email" autocomplete="given-name" type="password" v-model="password"/>
                    <span class="md-error" v-if="!$v.password.required">Требуется ввести пароль</span>
                </md-field>

            </md-card-content>

            <md-card-actions>
                <md-button type="submit" class="md-primary">Войти</md-button>
            </md-card-actions>

        </md-card>

    </form>

</template>

<script>
    import {validationMixin} from 'vuelidate'
    import {email, required, minLength} from 'vuelidate/lib/validators'

    export default {
        name: 'login',
        data: () => ({
            email: '',
            password: ''
        }),
        mixins: [validationMixin],
        validations: {
            email: {email, required},
            password: {required, minLength: minLength(6)}
        },
        methods: {
            getValidationClass(fieldName) {
                const field = this.$v[fieldName];
                if (field) {
                    return {
                        'md-invalid': field.$invalid && field.$dirty
                    }
                }
            },
            async submitHandler() {
                if (this.$v.$invalid) {
                    this.$v.$touch();
                    return
                }
                const formData = {
                    email: this.email,
                    password: this.password
                };
                try {
                    await this.$store.dispatch('login', formData);
                    await this.$router.push('/')
                } catch (e) {
                }
            }
        }
    }
</script>

<style scoped>
    form {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
    }
</style>
