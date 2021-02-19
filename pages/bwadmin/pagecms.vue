<template>
    <div class="PageCms">
        <!--页面列表-->
        <a-spin :spinning="false">
            <div class="page-item-wrapper">
                <div class="page-item">
                    <ThumbnailPanel />
                </div>
                <!-- <div class="page-item" v-for="(item, index) in pageList" :key="index">
                    <thumbnailPanel @refresh="getPageList" @showPreview="showPreviewFn" :pageData="item"
                        :btnList="operationBtn(item.isPublish)" />
                </div> -->
            </div>
        </a-spin>
    </div>
</template>
<script>
    export default {
        name: 'PageCms',
        data() {

            return {

            }
        }
    }
</script>
<style scoped lang="scss">
    .PageCms {}

    .page-item-wrapper {
        .page-item {
            float: left;
            margin-right: 20px;
            margin-bottom: 40px;
        }
    }
</style>