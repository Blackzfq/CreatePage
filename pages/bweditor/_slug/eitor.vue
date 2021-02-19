<template>
    <div class="PageEditor">
        <!-- 功能菜单 -->
        <a-drawer placement="left" :mask="false"  :title="$store.state.PagesEitorMenu.Title" :visible="$store.state.PagesEitorMenu.Menu" :get-container="false"
            :wrap-style="{ position: 'absolute' }" @close="onClose">
            <AddModle v-if="$store.state.PagesEitorMenu.Modle"/>
            <EitorPageList v-else/>
        </a-drawer>

        PageEditor
    </div>
</template>
<script>
    export default {
        name: 'PageEditor',
        asyncData({ params }) {
            console.log(params.slug)
        },
        data() {

            return {
                
            }
        },
        methods: {
            onClose() {
                this.$store.commit('PagesEitorMenu/SET_Menu',false)
            },
        }
    }
</script>
<style scoped lang="scss">
</style>