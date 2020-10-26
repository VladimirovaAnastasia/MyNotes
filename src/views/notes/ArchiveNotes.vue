<template>

    <div class="wrapper">

        <div>
            <h2>Архив заметок</h2>
            <NoteList :filteredNotes="archivedNotes"></NoteList>
            <p v-show="!archivedNotes.length">Заметок нет</p>
        </div>

    </div>

</template>

<script>
    import NoteList from "../../components/notes/NotesList";

    export default {
        name: "Archive",
        components: {NoteList},
        async mounted() {
            await this.$store.dispatch('getNotes');
        },
        computed: {
            archivedNotes() {
                return this.$store.getters.archivedNotes
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

