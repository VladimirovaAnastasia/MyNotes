<template>

    <div>

        <md-button @click="showDialog = true">Удалить</md-button>

        <md-dialog :md-active.sync="showDialog">
            <md-dialog-title>Вы действительно хотите удалить заметку?</md-dialog-title>
            <md-card-actions>
                <md-button class="md-primary" @click="showDialog = false">Отмена</md-button>
                <md-button type="submit" class="md-primary" @click="action">Удалить</md-button>
            </md-card-actions>
        </md-dialog>

    </div>

</template>

<script>
    export default {
        name: "ModalConfirm",
        data() {
            return {
                showDialog: false
            }
        },
        methods: {
            action() {
                this.showDialog = false;
                this.$emit('action')
            }
        }
    }
</script>

<style scoped>

</style>
