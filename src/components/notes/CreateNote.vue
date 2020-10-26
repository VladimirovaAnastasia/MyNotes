<template>

    <form novalidate class="md-layout" @submit.prevent="validateUser">

        <md-card class="md-layout-item md-size-100 md-small-size-100">

            <md-card-content>

                <div class="md-layout md-gutter">
                    <div class="md-layout-item md-small-size-100">
                        <md-field :class="getValidationClass('title')">
                            <label>Заголовок</label>
                            <md-input name="title" id="first-name" autocomplete="given-name" v-model="form.title"
                                      :disabled="sending"/>
                            <span class="md-error"
                                  v-if="!$v.form.title.required">Требуется ввести заголовок заметки</span>
                        </md-field>
                    </div>
                </div>

                <md-field :class="getValidationClass('description')">
                    <label>Введите текст заметки</label>
                    <md-textarea ref="text" class="note__description" maxlength="100"
                                 v-model="form.description"></md-textarea>
                    <span class="md-error" v-if="!$v.form.description.required">Требуется ввести текст заметки</span>
                </md-field>

                <div class="md-layout md-gutter">
                    <div class="md-layout-item md-small-size-100">
                        <md-field>
                            <label>Выберете цвет</label>
                            <InputColor @updateColor="onUpdateColor" :defaultColor="'White'"></InputColor>
                        </md-field>
                    </div>
                </div>

            </md-card-content>

            <md-progress-bar md-mode="indeterminate" v-if="sending"/>

            <md-card-actions>
                <md-button class="md-primary" @click="$emit('created')">Отмена</md-button>
                <md-button type="submit" class="md-primary" :disabled="sending">Создать</md-button>
            </md-card-actions>
        </md-card>

    </form>
</template>

<script>
    import {validationMixin} from 'vuelidate'
    import {
        required,
    } from 'vuelidate/lib/validators'
    import InputColor from "../InputColor";

    export default {
        name: 'CreateNote',
        components: {InputColor},
        mixins: [validationMixin],
        data: () => ({
            form: {
                title: '',
                description: null,
                color: '#ffffff',
            },
            isCreated: false,
            sending: false,
        }),
        validations: {
            form: {
                title: {
                    required
                },
                description: {
                    required
                }
            }
        },
        methods: {
            onUpdateColor(color) {
                this.form.color = this.$store.getters.colorByName(`${color}`).color
            },
            getValidationClass(fieldName) {
                const field = this.$v.form[fieldName];

                if (field) {
                    return {
                        'md-invalid': field.$invalid && field.$dirty
                    }
                }
            },
            async createNote() {
                try {
                    await this.$store.dispatch('createNote', {
                        date: Date.now(),
                        title: this.form.title,
                        description: this.form.description,
                        color: this.form.color,
                        isNew: true,
                        isFixed: false,
                        isArchived: false,
                        isListType: false,
                        listOfTasks: ['']
                    });
                    await this.$message('Заметка была успешно создана!');
                } catch (e) {
                }
            },
            clearForm() {
                this.$v.$reset();
                this.form.title = null;
                this.form.description = null;
                this.form.color = null;
            },
            saveUser() {
                this.sending = true;

                window.setTimeout(() => {
                    this.createNote();
                    this.sending = false;
                    this.clearForm();
                    this.$emit('created')
                }, 1000)
            },
            validateUser() {
                this.$v.$touch();

                if (!this.$v.$invalid) {
                    this.saveUser()
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .md-progress-bar {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
    }

    .md-field {
        margin: 4px 0 26px;
    }

</style>
