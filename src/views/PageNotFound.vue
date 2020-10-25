<template>
    <div class="not-found">
        <md-empty-state
                md-icon="devices_other"
                md-label="Страница не найдена">
            <md-button to="/" class="md-primary md-raised">На главную</md-button>
        </md-empty-state>
    </div>
</template>

<script>
    export default {
        name: "PageNotFound"
    }
</script>

<style scoped>
    .not-found {
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
