<template>

    <div class="page-container">

        <md-app>

            <md-app-toolbar class="md-primary" md-elevation="0">
                <div class="md-toolbar-row">
                    <div class="md-toolbar-section-start">

                        <md-button class="md-icon-button" @click="toggleMenu" v-if="!menuVisible">
                            <md-icon>menu</md-icon>
                        </md-button>

                        <md-button to="/" class="md-title">Мои заметки</md-button>

                        <div class="search" v-show="$route.name==='AllNotes'">
                            <md-field class="field">
                                <label>Поиск</label>
                                <span class="md-prefix"></span>
                                <md-input v-model="searchValue"></md-input>
                            </md-field>
                            <md-button class="md-icon-button search-on" @click="search">
                                <md-icon>search</md-icon>
                                <md-tooltip md-direction="bottom">Поиск</md-tooltip>
                            </md-button>

                            <md-button class="md-icon-button search-off" @click="refreshField">
                                <md-icon>refresh</md-icon>
                                <md-tooltip md-direction="bottom">Очистить поле</md-tooltip>
                            </md-button>
                        </div>

                    </div>

                    <div class="md-toolbar-section-end">
                        <md-menu md-size="medium" md-align-trigger>
                            <md-button md-menu-trigger>
                                {{name}}
                            </md-button>
                            <md-menu-content>
                                <md-menu-item to="/profile">Профиль<span class="material-icons">account_circle</span>
                                </md-menu-item>
                                <md-menu-item @click="logout">Выйти<span class="material-icons">exit_to_app</span>
                                </md-menu-item>
                            </md-menu-content>
                        </md-menu>
                    </div>

                </div>
            </md-app-toolbar>

            <md-app-drawer :md-active.sync="menuVisible" md-swipeable>

                <md-toolbar class="md-transparent" md-elevation="0">
                    <span>Меню</span>
                    <div class="md-toolbar-section-end">
                        <md-button class="md-icon-button md-dense" @click="toggleMenu">
                            <md-icon>keyboard_arrow_left</md-icon>
                        </md-button>
                    </div>
                </md-toolbar>

                <md-list>
                    <md-list-item to="/">
                        <md-icon>create</md-icon>
                        <span class="md-list-item-text">Заметки</span>
                    </md-list-item>
                    <md-list-item to="/new">
                        <md-icon>error</md-icon>
                        <span class="md-list-item-text">Новые</span>
                        <md-badge class="md-square" md-content="New"/>
                    </md-list-item>
                    <md-list-item to="/archive">
                        <md-icon>move_to_inbox</md-icon>
                        <span class="md-list-item-text">Архив</span>
                    </md-list-item>
                </md-list>

            </md-app-drawer>

            <md-app-content>
                <router-view/>
            </md-app-content>

        </md-app>

    </div>

</template>

<script>
    export default {
        name: 'MainLayout',
        data: () => ({
            menuVisible: false,
            searchValue: '',
            src: '',
            loading: true
        }),
        computed: {
            name() {
                return this.$store.getters.info.name
            }
        },
        async mounted() {
            if (!Object.keys(this.$store.getters.info).length) {
                await this.$store.dispatch('getUserInfo')
            }
            this.loading = false
        },
        methods: {
            toggleMenu() {
                this.menuVisible = !this.menuVisible
            },
            search() {
                this.$store.commit('setSearchValue', this.searchValue)
            },
            refreshField() {
                this.searchValue = '';
                this.search()
            },
            async logout() {
                await this.$store.dispatch('logout');
                await this.$router.push('/login')
            }
        }
    }
</script>


<style lang="scss">
    .search {
        display: flex;
        flex-direction: row;
        align-items: center;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);

        label,
        input {
            color: white !important;
        }

        @media (max-width: 767px) {
            left: 66%;
            display: none;
        }


        .md-field::after {
            background-color: white !important;
        }
    }

    .search-icon {
        cursor: pointer;
    }

    .page-container,
    .md-app {
        height: 100%;
    }
</style>
