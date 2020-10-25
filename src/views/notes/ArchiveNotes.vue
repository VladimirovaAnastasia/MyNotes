<template>

    <div class="wrapper">

        <div>
            <h2>Архив заметок</h2>
            <NoteList :filteredNotes="filteredNotes"></NoteList>
            <p v-show="!filteredNotes.length">Заметок нет</p>
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
            notes() {
                return this.$store.getters.notes
            },
            filteredNotes() {
                return this.notes.filter(item => item.isArchived)
            }
        }
    }
</script>

<style scoped>
    h2,
    p {
        text-align: left;
    }
</style>

