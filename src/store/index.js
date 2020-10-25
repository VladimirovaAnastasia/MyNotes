import Vue from 'vue'
import Vuex from 'vuex'
import auth from "./modules/auth";
import info from "./modules/profileInfo";
import allNotes from "./modules/allNotes";
import profile from "./modules/profilePhoto";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        searchValue: '',
        error: null,
        COLORS: [
            {name: 'Azure', color: '#f0ffff'},
            {name: 'Khaki', color: '#f0e68c'},
            {name: 'Lavender', color: '#e6e6fa'},
            {name: 'Pale Green', color: '#98fb98'},
            {name: 'Pink', color: '#ffc0cb'},
            {name: 'White', color: '#ffffff'},
        ]
    },
    mutations: {
        setSearchValue(state, value) {
            state.searchValue = value
        },
    },
    actions: {},
    modules: {
        auth, info, allNotes, profile
    },
    getters: {
        searchValue: s => s.searchValue,
        colors: s => s.COLORS,
        colorByName: s => name => s.COLORS.find(t => t.name === name),
        colorByCode: s => color => s.COLORS.find(t => t.color === color),
    }
})
