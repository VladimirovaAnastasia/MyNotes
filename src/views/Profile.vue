<template>

    <Loader v-if="!src"></Loader>

    <div v-else class="profile">

        <div class="profile__img" :style="{backgroundImage:`url(${src})`}"></div>
        <p class="md-headline">{{name}}</p>

        <p>Сменить аватар</p>
        <form @submit.prevent="onSubmit" novalidate class="profile-form md-layout">
            <input type="file" name="file" ref="file">
            <md-button type="submit" class="md-primary">Применить</md-button>
        </form>

    </div>

</template>

<script>
    import Loader from '../components/Loader'

    export default {
        name: "Profile",
        components: {Loader},
        computed: {
            name() {
                return this.$store.getters.info.name
            },
            src() {
                return this.$store.getters.src
            }
        },
        mounted() {
            this.$store.dispatch('getPhoto')
        },
        methods: {
            async onSubmit() {
                const file = this.$refs.file.files[0];
                await this.$store.dispatch('getPhotoLink', file)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .profile {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .profile-form {
        display: flex;
        flex-direction: row;
        align-items: center;
        max-width: 400px;

        input[type=file] {
            cursor: pointer;
            width: 180px;
            height: 34px;
            overflow: hidden;
        }

        input[type=file]:before {
            width: 180px;
            height: 32px;
            font-size: 16px;
            line-height: 32px;
            content: 'Выберите файл';
            display: inline-block;
            background: white;
            border: 1px solid #000;
            padding: 0 10px;
            text-align: center;
            font-family: Helvetica, Arial, sans-serif;
        }

        input[type=file]::-webkit-file-upload-button {
            visibility: hidden;
        }
    }

    .profile__img {
        margin-top: 30px;
        height: 300px;
        width: 300px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
    }
</style>
