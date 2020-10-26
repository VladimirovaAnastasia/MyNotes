<template>

    <div class="edit-note">

        <div v-if="note" class="edit-note__item">

            <h1>{{note.title}}</h1>

            <form novalidate class="md-layout md-small-size-100" @submit.prevent="submitHandler">
                <md-card class="md-layout-item md-size-100 md-small-size-100">

                    <md-card-content>
                        <md-field>
                            <label>Введите текст заметки</label>
                            <md-textarea maxlength="100" v-model="form.description"></md-textarea>
                        </md-field>

                        <div class="md-layout md-gutter">
                            <div class="md-layout-item md-small-size-100">
                                <md-field>
                                    <label>Выберете цвет</label>
                                    <InputColor @updateColor="onUpdateColor" :defaultColor="color"></InputColor>
                                </md-field>
                            </div>
                        </div>

                    </md-card-content>

                    <md-progress-bar md-mode="indeterminate" v-if="sending"/>

                    <md-card-actions>
                        <md-button type="submit" class="md-primary" :disabled="sending">
                            Обновить
                        </md-button>
                    </md-card-actions>

                </md-card>

            </form>

        </div>

        <p v-else>Заметка не найдена</p>

    </div>

</template>

<script>
    import {validationMixin} from "vuelidate";
    import {required} from 'vuelidate/lib/validators'
    import InputColor from "../../components/InputColor";

    export default {
        name: 'Note',
        mixins: [validationMixin],
        components: {InputColor},
        data: () => ({
            form: {
                title: '',
                description: '',
                color: null,
            },
            sending: false
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
        computed: {
            note() {
                return this.$store.getters.noteById(this.$route.params.id)
            },
            color() {
                return this.$store.getters.colorByCode(`${this.note.color}`).name
            }
        },
        mounted() {
            this.form.title = this.note.title;
            this.form.description = this.note.description;
            this.form.color = this.$store.getters.colorByCode(`${this.note.color}`).color
        },
        methods: {
            getValidationClass(fieldName) {
                const field = this.$v.form[fieldName];
                if (field) {
                    return {
                        'md-invalid': field.$invalid && field.$dirty
                    }
                }
            },
            onUpdateColor(color) {
                this.form.color = this.$store.getters.colorByName(`${color}`).color
            },
            async submitHandler() {
                let updatedData = {
                    idFirebase: this.note.idFirebase,
                    description: this.form.description,
                    color: this.form.color
                };
                await this.$store.dispatch('updateNote', updatedData);
                await this.$router.push('/');
                await this.$message('Заметка была успешно отредактирована!');
            }
        },
    }
</script>

<style lang="scss" scoped>
    .edit-note {
        display: flex;
        flex-direction: column;
        align-items: center;

        &__item {
            width: 40%;

            @media (max-width: 767px) {
                width: 100%;
            }
        }
    }
</style>
