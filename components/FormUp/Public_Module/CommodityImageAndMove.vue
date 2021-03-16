<template>
    <div class="CommodityImageAndMove"  ref="CommodityImageAndMove">
        <!-- 空状态 -->
        <a-empty
            image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
            :image-style="{height: '60px',}">
            <span slot="description"> 暂无主图信息,请尽快完善内容 </span>
            <a-button type="primary" @click="()=>mideoVisible=true">
                从媒体中心选择
            </a-button>
        </a-empty>
        <!-- 已存在内容 -->
        <a-upload action="https://www.mocky.io/v2/5cc8019d300000980a055e76" list-type="picture-card"
            :file-list="fileList" :openFileDialogOnClick="false" @preview="handlePreview" @change="handleChange">
            <div v-if="fileList.length < 6" style="cursor: pointer;" @click="()=>mideoVisible=true">
                <a-icon type="plus" />
                <div class="ant-upload-text">
                    添加主图
                </div>
            </div>
        </a-upload>
        <!-- 图片预览 -->
        <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
            <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
        <!-- 媒体中心 -->
        <a-modal v-model="mideoVisible" width="1100px" :footer="null" :getContainer="()=>$refs.CommodityImageAndMove" :mask="false"
            :bodyStyle="{height:'600px',overflow:'auto'}" centered>
            <span slot="title">
                图片管理
                <a-input-search placeholder="请输入图片的名称进行检索" style="width:300px;margin-left:24px;" v-model="search"
                    @change="onSearch" />
            </span>
            <ListImage scene ref="listImage" @insertion="setImage" />
        </a-modal>
    </div>
    </div>
</template>
<script>
    export default {
        name: 'CommodityImageAndMove',
        data() {

            return {
                previewVisible: false,
                mideoVisible:false,
                previewImage: '',
                fileList: [
                    {
                        uid: '-6',
                        name: 'image.png',
                        type: 'video',
                        status: 'error',
                    },
                    {
                        uid: '-5',
                        name: 'image.mp4',
                        type: 'image',
                        status: 'error',
                    },
                    {
                        uid: '-4',
                        name: 'image.png',
                        type: 'image',
                        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
                        status: 'error',
                    },
                    {
                        uid: '-3',
                        name: 'image.png',
                        type: 'image',
                        status: 'error',
                    },
                    {
                        uid: '-2',
                        name: 'image.png',
                        type: 'image',
                        status: 'error',
                    },
                ],
            };
        },
        methods: {
            handleCancel() {
                this.previewVisible = false;
            },
            async handlePreview(file) {
                if (!file.url && !file.preview) {
                    file.preview = await getBase64(file.originFileObj);
                }
                this.previewImage = file.url || file.preview;
                this.previewVisible = true;
            },
            handleChange({ fileList }) {
                this.fileList = fileList;
            },
        }
    }
</script>
<style scoped lang="scss">
    .CommodityImageAndMove {
        &::v-deep .ant-upload.ant-upload-select-picture-card {
            cursor: default;
        }
    }
</style>