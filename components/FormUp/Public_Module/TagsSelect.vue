<template>
    <a-select mode="tags" style="width: 100%" placeholder="Tags Mode" @change="handleChange">
        <a-select-option v-for="i in 25" :key="(i + 9).toString(36) + i">
            {{ (i + 9).toString(36) + i }}
        </a-select-option>
    </a-select>
</template>
<script>
    export default {
        name:'TagsSelect',
        data(){
            return {
                
            }
        },
        methods: {
            handleChange(value) {
                console.log(`selected ${value}`);
            },
        },
    };
</script>

<style scoped lang="scss">

</style>