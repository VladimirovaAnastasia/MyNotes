<template>

    <div class="wrapper">

        <div>
            <h2>Новые заметки</h2>
            <NoteList :filteredNotes="newNotes"></NoteList>
            <p v-show="!newNotes.length">Заметок нет</p>
        </div>

    </div>

</template>

<script>
    import NoteList from "../../components/notes/NotesList";

    export default {
        name: "NewNotes",
        components: {NoteList},
        async mounted() {
            await this.$store.dispatch('getNotes');
        },
        computed: {
            newNotes() {
                return this.$store.getters.newNotes
            },
        }
    }
</script>


<style scoped>
    h2,
    p {
        text-align: left;
    }
</style>
