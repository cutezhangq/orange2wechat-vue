<template>
    <div id="demo"></div>
</template>

<style scoped>
</style>

<script>
    export default {
        name: "demo",
        // provide：是一个对象，或者是一个返回对象的函数。里面就包含要给子孙后代的东西，也就是属性和属性值。
        provide() {
            return {
                parentScroll: this
            };
        },
        //inject：一个字符串数组，或者是一个对象。属性值可以是一个对象，包含from和default默认值。
        inject: {
            parentScroll: {
                default: null
            }
        },
        mounted() {
            console.log("this.parentScroll", this.parentScroll)
            console.log("this", this)
        }
    };
</script>