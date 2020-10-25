<template>

    <div>

        <md-button class="md-primary md-raised" @click="showDialog = true">Создать заметку</md-button>

        <md-dialog :md-active.sync="showDialog">
            <md-dialog-title>Создать заметку</md-dialog-title>
            <CreateNote @created="showDialog = false"></CreateNote>
        </md-dialog>

    </div>

</template>

<script>
    import CreateNote from "../notes/CreateNote";

    export default {
        name: "ModalAddNote",
        components: {CreateNote},
        data() {
            return {
                showDialog: false
            }
        },
    }

</script>

<style scoped>

</style>
