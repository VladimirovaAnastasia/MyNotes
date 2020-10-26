<template>

    <Loader v-if="loading"></Loader>

    <div v-else class="all-notes">

        <div class="wrapper">

            <ModalAddNote></ModalAddNote>

            <div class="all-notes__search" v-show="notArchivedNotes.length">
                <md-field>
                    <label>Фильтровать по цвету</label>
                    <InputColor @updateColor="getColor" :clearField="isColorFilterRemoved"></InputColor>
                </md-field>
                <md-button v-show="filterByColor!=='all'" class="md-icon-button" md-menu-trigger @click="clearFilter">
                    <md-icon>delete_outline</md-icon>
                    <md-tooltip md-direction="bottom">Очистить фильтр</md-tooltip>
                </md-button>
            </div>

            <p v-show="fixed.length" class="md-headline all-notes__title">Закрепленные</p>
            <NoteList v-show="fixed.length" :filteredNotes="fixed" @updateIndexes="updateIndexesFixed"></NoteList>
            <p v-show="fixed.length && notFixed.length" class="md-headline all-notes__title" @updateIndexes="updateIndexes">Остальные заметки</p>
            <NoteList v-show="notFixed.length" :filteredNotes="notFixed"></NoteList>
            <p v-show="!filteredNotes.length" class="all-notes__empty">Заметок нет</p>

        </div>

    </div>

</template>

<script>
    import Note from "./EditNote";
    import ModalAddNote from "../../components/modals/ModalAddNote";
    import InputColor from "../../components/InputColor";
    import NoteList from "../../components/notes/NotesList";
    import Loader from "../../components/Loader";
    import {mapGetters, mapActions} from "vuex";

    export default {
        name: "AllNotes",
        components: {NoteList, Note, ModalAddNote, InputColor, Loader},
        data () {
            return {
                searchedNotes: [],
                filterByType: 'all',
                filterByColor: 'all',
                isColorFilterRemoved: false,
                loading: true
            }
        },
        async mounted(){
            await this.getNotes();
            this.loading = false
        },
        computed: {
            ...mapGetters(['notArchivedNotes', 'searchValue']),
            filteredNotes() {
                if (this.searchValue) {
                    if (!this.isColorFilterRemoved) {
                        return this.notArchivedNotes
                            .filter(this.colorFilter)
                            .filter(this.searchFilter)
                    } else {
                        return this.notArchivedNotes
                            .filter(this.searchFilter)
                    }
                } else if (!this.isColorFilterRemoved){
                    return this.notArchivedNotes
                        .filter(this.colorFilter)
                } else {
                    return this.notArchivedNotes
                }
            },
            fixed() {
                return this.filteredNotes
                    .filter(this.fixedFilter)
            },
            notFixed() {
                return this.filteredNotes
                    .filter(this.notFixedFilter)
            },
        },
        methods: {
            ...mapActions(['updateAllNotes', 'getNotes']),
            async updateIndexesFixed(data) {
                await this.updateAllNotes([...data, ...this.notFixed])
            },
            async updateIndexes(data){
                await this.updateAllNotes([...data, ...this.fixed])
            },
            getColor(color) {
                this.isColorFilterRemoved = false;
                if (color) {
                    this.filterByColor = this.$store.getters.colorByName(`${color}`).color
                }
            },
            colorFilter(item) {
                if (this.filterByColor !== 'all') {
                    if (item.color === this.filterByColor) {
                        return item
                    }
                } else {
                    return item
                }
            },
            fixedFilter(item) {
                if (item.isFixed) {
                    return item
                }
            },
            notFixedFilter(item) {
                if (!item.isFixed) {
                    return item
                }
            },
            searchFilter(item) {
                let result = null;
                if (item.title.toLowerCase().includes(this.searchValue.toLowerCase()) || item.description.toLowerCase().includes(this.searchValue.toLowerCase())) {
                    result = item
                }
                if (!this.searchValue) {
                    result = item
                }
                return result
            },
            sortByIndex(prev, next) {
                return next.index - prev.index
            },
            clearFilter() {
                this.filterByColor='all';
                this.isColorFilterRemoved = true
            }
        },
    }
</script>

<style lang="scss" scoped>
    .all-notes {
        display: flex;
        flex-direction: column;
        align-items: center;

        &__title {
            margin: 10px 0 0 0
        }

        &__search {
            position: relative;
            left: 5px;
            display: flex;
            flex-direction: row;

            .md-button {
                position: relative;
                top: 15px;
            }
        }
        &__empty {
            position: relative;
            left: 5px;
        }
    }
    .md-field {
        width: 270px;
    }
    ul {
        list-style: none;
        margin: 0;
        padding: 0;
    }
</style>
