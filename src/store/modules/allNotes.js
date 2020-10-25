import firebase from 'firebase/app'

export default {
    state: {
        notes: [],
    },
    mutations: {
        createNote(state, note) {
            state.notes.push(note)
        },
        removeNote(state, idFirebase) {
            state.notes = state.notes.filter(t => t.idFirebase !== idFirebase)
        },
        setNote(state, note) {
            let updatedNote = this.getters.noteIndexById(`${note.idFirebase}`);
            state.notes.splice(updatedNote, 1, note)
        },
        setNotes(state, notes) {
            state.notes = notes
        },
    },
    actions: {

        async createNote({commit, dispatch, getters}, {date, title, description, color, isNew, isFixed, isArchived, isListType, listOfTasks}) {
            try {
                const uid = await dispatch('getUid');
                const index = this.getters.notes.length;
                const note = await firebase.database().ref(`/users/${uid}/notes`).push({
                    index,
                    date,
                    title,
                    description,
                    color,
                    isNew,
                    isFixed,
                    isArchived,
                    isListType,
                    listOfTasks
                });
                const newNote = {
                    idFirebase: note.key,
                    index,
                    date,
                    title,
                    description,
                    color,
                    isNew,
                    isFixed,
                    isArchived,
                    isListType,
                    listOfTasks
                };
                commit('createNote', newNote)
            } catch (e) {
                throw e
            }
        },

        async updateNote({commit, dispatch, getters}, updatedData) {
            try {
                const uid = await dispatch('getUid');
                const idFirebase = {...updatedData}.idFirebase;
                const data = {...getters.noteById(idFirebase), ...updatedData};
                await firebase.database().ref(`/users/${uid}/notes`).child(idFirebase).update(data);
                commit('setNote', data)
            } catch (e) {
                throw e
            }
        },

        async updateAllNotes({commit, dispatch, getters}, updatedData) {
            try {
                const uid = await dispatch('getUid');
                const data = [...updatedData];
                let newData = {};
                let updatedNotes = [];
                data.forEach((item) => {
                    let newDataKey = item.idFirebase;
                    newData[newDataKey] = item;
                    updatedNotes.push(item)
                });
                console.log(updatedNotes, 'updated');
                await firebase.database().ref(`/users/${uid}/notes`).update(newData);
                commit('setNotes', updatedNotes)
            } catch (e) {
                throw e
            }
        },

        async removeNote({commit, dispatch, getters}, idFirebase) {
            try {
                const uid = await dispatch('getUid');
                let removedItemIndex = getters.noteById(idFirebase).index;
                await firebase.database().ref(`/users/${uid}/notes`).child(idFirebase).remove();
                commit('removeNote', idFirebase);
                let notes = getters.notes;
                let updatedNotes = '';
                updatedNotes = notes.map((item) => {
                    if (item.index > removedItemIndex) {
                        item.index = item.index - 1
                    }
                    return item
                });
                commit('setNotes', updatedNotes)
            } catch (e) {
                throw e
            }
        },

        async getNotes({commit, dispatch}) {
            try {
                const uid = await dispatch('getUid');
                const notes = (await firebase.database().ref(`/users/${uid}/notes`).once('value')).val() || {};
                let data = Object.keys(notes).map(key => ({...notes[key], idFirebase: key}));
                let invalidDateCount = 0;
                data.forEach((item) => {
                    if ((Date.now() - item.date) > 10 * 1000) {
                        item.isNew = false;
                        invalidDateCount = invalidDateCount + 1
                    }
                });
                if (invalidDateCount > 0) {
                    commit('setNotes', data);
                } else {
                    dispatch('updateAllNotes', data)
                }
                return data
            } catch (e) {
                throw e
            }
        }

    },
    getters: {
        notes: s => s.notes,
        noteById: s => id => s.notes.find(t => t.idFirebase === id),
        noteIndexById: s => id => s.notes.findIndex((t) => t.idFirebase === id)
    }
}
