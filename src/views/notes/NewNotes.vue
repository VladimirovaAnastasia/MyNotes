<template>

    <div class="wrapper">

        <div>
            <h2>Новые заметки</h2>
            <NoteList :filteredNotes="filteredNotes"></NoteList>
            <p v-show="!filteredNotes.length">Заметок нет</p>
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
            notes() {
                return this.$store.getters.notes
            },
            filteredNotes() {
                return this.notes.filter(item => item.isNew)
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
