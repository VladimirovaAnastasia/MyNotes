<template>

    <div class="cards">

        <div class="md-card card" v-if="sortedNotes.length"
             :style="{ backgroundColor: note.color }"
             v-for="note in sortedNotes"
             draggable="true"
             @dragstart="dragStart(note, $event)"
             @dragend="dragEnd(note, $event)"
             @dragenter="dragEnter(note)">

            <md-badge v-show="note.isNew" class="md-square" md-content="New"/>
            <md-icon class="badge" v-show="false">push_pin</md-icon>

            <md-card-header>
                <md-card-header-text>
                    <div class="md-title">{{note.title}}</div>
                </md-card-header-text>

                <md-menu md-size="big" md-direction="bottom-end">
                    <md-button class="md-icon-button" md-menu-trigger>
                        <md-icon>more_vert</md-icon>
                    </md-button>

                    <md-menu-content>

                        <md-menu-item v-if="!note.isArchived" @click="changeStatus(note, 'isArchived')">
                            <span>Добавить в архив</span>
                            <md-icon>move_to_inbox</md-icon>
                        </md-menu-item>
                        <md-menu-item v-else @click="changeStatus(note, 'isArchived')">
                            <span>Вернуть из архива</span>
                            <md-icon>move_to_inbox</md-icon>
                        </md-menu-item>

                        <md-menu-item v-if="!note.isArchived && !note.isFixed" @click="changeStatus(note, 'isFixed')">
                            <span>Закрепить</span>
                            <md-icon>push_pin</md-icon>
                        </md-menu-item>
                        <md-menu-item v-if="!note.isArchived && note.isFixed" @click="changeStatus(note, 'isFixed')">
                            <span>Открепить</span>
                            <md-icon>push_pin</md-icon>
                        </md-menu-item>

                        <md-menu-item v-if="!note.isListType" @click="changeStatus(note, 'isListType')">
                            <span>Отобразить списком</span>
                            <md-icon>format_list_bulleted</md-icon>
                        </md-menu-item>
                        <md-menu-item v-else @click="changeStatus(note, 'isListType')">
                            <span>Отобразить текстом</span>
                            <md-icon>notes</md-icon>
                        </md-menu-item>

                    </md-menu-content>

                </md-menu>

            </md-card-header>

            <md-card-content v-if="!note.isListType">{{note.description}}</md-card-content>

            <md-card-content v-else>
                <ul class="description-list">
                    <li class="description-list__item" v-for="item in createList(note)">
                        <md-tooltip md-direction="top">{{item}}</md-tooltip>
                        <md-checkbox v-model="note.listOfTasks" :value="item">{{item}}</md-checkbox>
                    </li>
                </ul>
                <md-button @click="changeListItemStatus(note)" class="description-list__button">Сохранить изменения
                </md-button>
                <md-snackbar :md-active.sync="changesSaved">Изменения сохранены!</md-snackbar>

            </md-card-content>

            <md-card-actions class="card__buttons" md-alignment="right">
                <md-button @click="$router.push('/note/' + note.idFirebase)">Редактировать</md-button>
                <ModalConfirm @action="removeNote(note.idFirebase)"></ModalConfirm>
            </md-card-actions>

        </div>

    </div>

</template>

<script>
    import Note from "../../views/notes/EditNote";
    import ModalConfirm from "../modals/ModalConfirm";

    export default {
        name: "NoteList",
        components: {Note, ModalConfirm},
        props: ['filteredNotes'],
        data() {
            return {
                listOfTasksInit: false,
                draggingItem: null,
                changesSaved: false
            }
        },
        computed: {
            sortedNotes() {
                return this.filteredNotes
                    .sort(this.sortByIndex)
            }
        },
        methods: {
            sortByIndex(prev, next) {
                return next.index - prev.index
            },
            setListOfTasks(item) {
                return item
            },
            dragStart(item, e) {
                this.draggingItem = item;
                e.target.style.opacity = 0.5;
                e.dataTransfer.setData('text/plain', 'dummy'); // Firefox用 http://stackoverflow.com/questions/21507189/dragenter-dragover-and-drop-events-not-working-in-firefox
            },
            async dragEnd(item, e) {
                e.target.style.opacity = 1;
                this.$emit('updateIndexes', this.sortedNotes)
            },
            dragEnter(item) {
                const tempIndex = item.index;
                item.index = this.draggingItem.index;
                this.draggingItem.index = tempIndex;
            },
            createList(item) {
                let newList = item.description.split('\n');
                if (newList.length > 1) {
                    return newList.slice(0, newList.length)
                } else {
                    return newList
                }
            },
            removeNote(idFirebase) {
                this.$store.dispatch('removeNote', idFirebase)
            },
            async changeStatus(note, type) {
                let updatedData = {
                    idFirebase: note.idFirebase,
                };
                updatedData[type] = !note[type];
                await this.$store.dispatch('updateNote', updatedData)
            },
            async changeListItemStatus(note) {
                let updatedData = {
                    idFirebase: note.idFirebase,
                    listOfTasks: note.listOfTasks
                };
                await this.$store.dispatch('updateNote', updatedData);
                this.changesSaved = true
            },
        },
    }
</script>

<style lang="scss">
    .cards {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;
        flex-wrap: wrap;
        margin-bottom: 20px;
    }

    .card {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: 320px;
        min-height: 200px;
        margin-top: 16px;
        margin-left: 0 !important;
        transition: box-shadow 1s;

        &__buttons {
            position: absolute;
            bottom: 5px;
        }

        &:hover {
            box-shadow: 0 1px 5px 0 rgba(60, 64, 67, 0.302), 0 1px 5px 1px rgba(60, 64, 67, 0.149);
        }

        .md-card-header {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            width: 100%;
            text-align: left;
        }

        .md-card {
            .badge {
                position: absolute;
                right: -5px;
                top: -5px;
                transform: scale(1.5);
            }

            .md-title {
                text-align: left;
            }
        }

        .md-card-content {
            white-space: pre-wrap;
            word-wrap: break-word;
            width: 300px;
            text-align: left;
            margin-bottom: 50px;
            padding: 13px;
        }

        .md-checkbox {
            margin-top: 0;
            margin-bottom: 8px;

            label {
                width: 260px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }

    .description-list {
        &__item {
            display: flex;
        }

        &__button {
            position: relative;
            left: 18px;
            margin-bottom: 50px;
        }
    }

    ul {
        list-style: none;
        margin: 0;
        padding: 0;
    }
</style>
