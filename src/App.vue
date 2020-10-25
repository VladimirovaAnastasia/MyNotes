<template>

    <div id="app">

        <component :is="layout">
            <router-view/>
        </component>

    </div>

</template>

<script>
    import EmptyLayout from './layouts/EmptyLayout'
    import MainLayout from './layouts/MainLayout'

    export default {
        computed: {
            layout() {
                return (this.$route.meta.layout || 'empty') + '-layout'
            }
        },
        components: {
            EmptyLayout, MainLayout
        }
    }
</script>


<style lang="scss">
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        height: 100vh;
        min-width: 320px;
    }

    .wrapper {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin: 20px auto;
        width: 1020px;

        @media (max-width: 1100px) {
            width: 700px;
        }

        @media (max-width: 767px) {
            width: 320px;
        }
    }
</style>
