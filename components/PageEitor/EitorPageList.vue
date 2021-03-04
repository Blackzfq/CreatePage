<template>
    <div class="EitorPageList">
        <a-button icon="plus" block @click="addPage">
            新增页面
        </a-button>
        <ul>
            <li v-for="(pageitem,pageindex) in $store.state.PagesEitorMenu.pageList" :key="pageindex"
                @mouseenter="isMove=pageindex" @mouseleave="isMove=null" @click="isActivePage(pageindex)">
                <a-icon type="file" style="margin-right: 10px;" />{{pageitem.name}}<span style="float: right;"
                    v-show="isMove===pageindex">
                    <a-icon type="setting" style="margin-right: 10px;cursor: pointer;"
                        @click="openEditPage(pageitem,pageindex)" />
                    <a-icon type="close" style="cursor: pointer;" @click="deletePage(pageindex)" />
                </span>
            </li>
        </ul>

        <!-- 页面内容编辑 -->
        <a-modal centered destroyOnClose v-model="visible" width="800px" @cancel="closePageMessage" @ok="handleOk">
            <template slot="title">
                <a-icon type="setting" style="margin-right: 10px;" />页面设置
            </template>
            <template slot="footer">
                <a-button key="submit" type="primary" @click="handleOk">
                    保存
                </a-button>
            </template>
            <PageDetilForm ref="PageDetilForm" :formdata="pageContent" />
        </a-modal>
    </div>
</template>
<script>
    export default {
        name: 'EitorPageList',
        data() {

            return {
                visible: false,
                isMove: null,
                pageContent: undefined,
                isEitor:null
            }
        },
        methods: {
            addPage() {
                const newPage = { 
                    name: 'newpage',
                    url: '', 
                    title: '',
                    description: '', 
                    keywords: '',
                    components:[{
                        comName: 'EdiorSwiper1',
                    }] 
                }


                this.$store.commit('PagesEitorMenu/Add_PageList', newPage)
            },
            deletePage(num) {
                let self = this
                this.$confirm({
                    title: '(警告:删除页面，将无法恢复)，您确定吗？',
                    okText: '确定',
                    okType: 'danger',
                    cancelText: '放弃',
                    centered: true,
                    onOk() {
                        self.$store.commit('PagesEitorMenu/Delete_PageList', num)
                        self.$store.commit('PagesEitorMenu/SET_Currentpage',self.$store.state.PagesEitorMenu.pageList[0])
                    },
                    onCancel() {
                        console.log('Cancel');
                    },
                });
            },
            openEditPage(obj,num) {
                this.pageContent =JSON.parse(JSON.stringify(obj))
                this.isEitor=num
                this.visible = true;
            },
            closePageMessage(e) {
                console.log(e);
                this.isEitor=null
            },
            handleOk(e) {
                const submit=this.$refs.PageDetilForm.onSubmit()
                if(submit){
                    this.$store.commit('PagesEitorMenu/Splice_PageList',{pageContent:this.pageContent,isEitor:this.isEitor})
                    this.visible = false;
                }
            },
            isActivePage(num){
                    this.$store.dispatch('PagesEitorMenu/switchCurrentComponents',num)
            }
        }
    }
</script>
<style scoped lang="scss">
    .EitorPageList {

        ul {
            list-style: none;
            padding-left: 0;
            margin-top: 15px;
        }

        li {
            transition: all .3s;

            &:hover {
                color: #fff;
                background-color: cadetblue;
            }
        }
    }
</style>