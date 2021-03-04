<template>
    <div class="CrrentEitorPage">
        <BWEitor v-for="(pageitem,pageindex) in currentComponents" :key="pageindex" :isKey="pageindex" @setOption="onSetOption" @sortTop="sortTop" @sortNext="sortNext" @onremove="deleteCompontent">
            <template v-slot:components>
                <component :is="pageitem.comName" :commonStyle="pageitem.commonStyle" :propsValue="pageitem.propsValue" :elements="pageitem.elements"></component>
            </template>
        </BWEitor>
    </div>
</template>
<script>
    import { mapGetters } from 'vuex'
    import {_bl_register_components_object} from '@/plugins/bl-components' //批量注册组件 
    export default {
        name: 'CrrentEitorPage',
        components: {..._bl_register_components_object},
        computed: {
            ...mapGetters('PagesEitorMenu', {
                currentComponents: 'getCurrentComponents'
            })
        },
        data() {

            return {

            }
        },
        created(){
            //初始化组件列表  SWITCH_CURRENTCOMPONENTS
            this.$store.dispatch('PagesEitorMenu/switchCurrentComponents',0)
        },
        methods:{
            onSetOption(val){
                alert(`设置当前组件配置，当前组件序号为${val}`)
            },
            sortTop(val){
                const obj={
                    comNum:val,
                    move:true
                }
                this.$store.dispatch('PagesEitorMenu/sortComponents', obj)
            },
            sortNext(val){
                const obj={
                    comNum:val,
                    move:false
                }
                this.$store.dispatch('PagesEitorMenu/sortComponents', obj)
            },
            deleteCompontent(val){
                this.$store.dispatch('PagesEitorMenu/deleteComponents',val)
            }
        }
    }
</script>
<style lang="scss">
    h1,h2,h3,h4,h5,h6,p,div{
        &:focus{
            outline: none;
        }
    }
    .CrrentEitorPage {
        height: 100%;
        background-color: #FFF;
    }
</style>