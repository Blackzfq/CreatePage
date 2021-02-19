<template>
    <div class="BWeditor">
        <NuxtChild keep-alive />
    </div>
</template>
<script>
export default{
    name:'BWeditor',
    layout:'PageEitor',
    asyncData({route,redirect}) {
        if(route.name!=='bweditor-slug-eitor'){
            redirect('/bwadmin/pagecms')
        }
        },
    data(){

        return{

        }
    }
}
</script>
<style lang="scss">
</style>
