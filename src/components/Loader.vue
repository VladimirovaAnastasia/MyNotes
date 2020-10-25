<template>

    <div class="loader">
        <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
    </div>

</template>

<style scoped lang="scss">
    .loader {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 60vh;

        svg {
            height: 200px;
            width: 200px;
        }
    }
</style>
