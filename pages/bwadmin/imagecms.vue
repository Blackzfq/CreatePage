<template>
    <div class="ImageCms" ref="ImageCms">
        <div class="tootl" style="position: sticky;top: 0;background-color: #FFF;z-index: 5"> 
            <a-row type="flex" justify="space-between">
                <a-col :span="12">
                    <span style="font-size: 16px;">文件管理</span>
                    <a-icon type="reload" :spin="loading" style="margin-left: 15px;" @click="refreshData" />
                </a-col>
                <a-col :span="12" style="text-align: end;">
                    <a-input-search placeholder="请输入文件的名称" style="width: 200px;text-align: start" v-model="search" @change="onSearch" />
                    <a-button type="primary" @click="()=>{visible=true}">
                        添加文件
                    </a-button>
                </a-col>
            </a-row>
            <a-divider />
        </div>

        <ListImage ref="listImage" :updeData="data"/>
        
        <!-- 上传图片弹窗 -->
        <a-modal v-model="visible" title="上传图片" height="800px" :footer="null" :getContainer="()=>$refs.ImageCms"
            :mask="false" :bodyStyle="{height:'600px',overflow:'auto'}" centered>
            <MideoEditor @succee="onSuccee"/>
        </a-modal>
    </div>
</template>
<script>
    export default {
        name: 'ImageCms',
        data() {

            return {
                loading: false,
                visible: false,
                data:null,
                search:''
            }
        },
        methods: {
            async refreshData() {
                this.loading = true
                await this.$refs.listImage.resetImageList()
                this.loading=false
            },
            onSearch(e) {
                const params=this.search
                this.$refs.listImage.onSearch(params)
            },
            onSuccee(value){
                this.data=value
            }
        }
    }
</script>
<style scoped lang="scss">
    .ImageCms {
        padding: 24px;
        background-color: #FFF;
        min-width: 1100px;
        position: relative;
        height: 100%;
    }
</style>