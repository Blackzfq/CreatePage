<template>
    <div class="PageEditor">
        <!-- 功能菜单 -->
        <a-drawer placement="left" :mask="false"  :title="$store.state.PagesEitorMenu.Title" :visible="$store.state.PagesEitorMenu.Menu" :get-container="false" :width="350"
            :wrap-style="{ position: 'absolute' }" @close="onClose">
            <AddModle v-if="$store.state.PagesEitorMenu.Modle"/>
            <EitorPageList v-else/>
        </a-drawer>

        <!-- 展示页面 -->
        <div class="Viewbox" :class="{isDesktop:$store.state.PagesEitorMenu.ViewBox==='desktop',isTablet:$store.state.PagesEitorMenu.ViewBox==='tablet',isMobile:$store.state.PagesEitorMenu.ViewBox==='mobile'}">
            <CrrentEitorPage/>
        </div>
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
    .PageEditor{
        background-color: #D8D8D8;
        .Viewbox{
            margin: 0 auto;
            height: 100vh;
            overflow: auto;
        }

        .isDesktop{
            max-width: 1580px;
            width: 100%;
        }

        .isTablet{
            max-width: 768px;
            width: 100%;
            
        }
        .isMobile{
            max-width: 375px;
            width: 100%;
        }
    }
</style>