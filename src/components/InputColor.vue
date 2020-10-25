<template>

    <md-select name="color" v-model="selectedColor" @md-selected="changeColor" md-dense>
        <md-option v-for="color in colors" :value="color.name">{{color.name}}<span class="color"
                                                                                   :style="{backgroundColor:color.color}"></span>
        </md-option>
    </md-select>

</template>

<script>
    export default {
        name: "InputColor",
        props: ['defaultColor', 'clearField'],
        data: () => ({
            selectedColor: null,
            colors: []
        }),
        mounted() {
            this.colors = this.$store.getters.colors;
            if (this.defaultColor) {
                this.selectedColor = this.defaultColor
            }
        },
        watch: {
            clearField() {
                if (this.clearField) {
                    this.selectedColor = null
                }
            }
        },
        methods: {
            changeColor() {
                this.$emit('updateColor', this.selectedColor)
            }
        }
    }
</script>

<style scoped>
    .color {
        position: absolute;
        top: 4px;
        right: 10px;
        height: 30px;
        width: 30px;
        border: 1px solid #2c3e50;
        border-radius: 50%;
        background-color: lightskyblue;
    }
</style>
