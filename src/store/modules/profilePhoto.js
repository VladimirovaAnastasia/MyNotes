import firebase from 'firebase'

export default {
    state: {
        src: ''
    },
    mutations: {
        setSrc(state, url) {
            state.src = url
        }
    },
    actions: {

        async getPhotoLink({dispatch, commit}, file) {
            try {
                const ref = firebase.storage().ref('/images/');
                const metadata = {
                    contentType: file.type
                };
                const name = file.name;
                const photoUpload = await ref.child(name).put(file, metadata);
                const url = await photoUpload.ref.getDownloadURL();
                commit('setSrc', url);
                dispatch('uploadPhoto')
            } catch (e) {
                throw e
            }
        },

        async uploadPhoto({dispatch, getters}) {
            try {
                const uid = await dispatch('getUid');
                const url = getters.src;
                await firebase.database().ref(`/users/${uid}/info/photo`).remove();
                await firebase.database().ref(`/users/${uid}/info/photo`).push(url);
            } catch (e) {
                throw e
            }
        },

        async getPhoto({dispatch, commit}) {
            try {
                const uid = await dispatch('getUid');
                const src = (await firebase.database().ref(`/users/${uid}/info/photo`).once('value')).val() || {};
                const url = Object.values(src)[0];
                commit('setSrc', url)
            } catch (e) {
                throw e
            }
        }

    },
    getters: {
        src: s => s.src
    }
}
