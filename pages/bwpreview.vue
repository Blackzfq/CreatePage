<template>
    <div class="BWpreview">
        <NuxtChild keep-alive />
    </div>
</template>
<script>
export default{
    name:'BWpreview',
    layout:'PagePreview',
    asyncData({route,redirect}) {
        if(route.name==='bwpreview-slug-preview'||route.name==='bwpreview-slug-pageeditor'){
            return
        }else{
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