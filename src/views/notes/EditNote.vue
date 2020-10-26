<template>

    <div class="edit-note">

        <div v-if="note" class="edit-note__item">

            <h1>{{note.title}}</h1>

            <form novalidate class="md-layout md-small-size-100" @submit.prevent="validateUser">
                <md-card class="md-layout-item md-size-100 md-small-size-100">

                    <md-card-content>
                        <md-field :class="getValidationClass('description')">
                            <label>Введите текст заметки</label>
                            <md-textarea maxlength="100" v-model="description"></md-textarea>
                            <span class="md-error" v-if="!$v.description.required">Требуется ввести текст заметки</span>
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
    import {mapGetters, mapActions} from "vuex";

    export default {
        name: 'Note',
        mixins: [validationMixin],
        components: {InputColor},
        data: () => ({
            title:'',
            description: '',
            newColor: null,
            sending: false
        }),
        validations: {
            description: {
                required
            }
        },
        computed: {
            ...mapGetters(['noteById', 'colorByCode']),
            note() {
                return this.noteById(this.$route.params.id)
            },
            color() {
                return this.colorByCode(`${this.note.color}`).name
            }
        },
        mounted() {
            this.description = this.note.description;
            this.newColor = this.colorByCode(`${this.note.color}`).color
        },
        methods: {
            ...mapActions(['updateNote']),
            getValidationClass(fieldName) {
                const field = this.$v[fieldName];
                if (field) {
                    return {
                        'md-invalid': field.$invalid && field.$dirty
                    }
                }
            },
            onUpdateColor(color) {
                this.newColor = this.colorByName(`${color}`).color
            },
            async submitHandler() {
                let updatedData = {
                    idFirebase: this.note.idFirebase,
                    description: this.description,
                    color: this.newColor
                };
                await this.updateNote(updatedData);
                await this.$router.push('/notes');
                await this.$message('Заметка была успешно отредактирована!');
            },
            validateUser () {
                this.$v.$touch();

                if (!this.$v.$invalid) {
                    this.submitHandler()
                }
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
