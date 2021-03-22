<template>
    <div class="CommodityImageAndMove" ref="CommodityImageAndMove">
        <!-- 空状态 -->
        <a-empty
            image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
            :image-style="{height: '60px',}" v-if="fileList.length===0">
            <span slot="description"> 暂无主图信息,请尽快完善内容 </span>
            <a-button type="primary" @click="()=>mideoVisible=true">
                从媒体中心选择
            </a-button>
        </a-empty>
        <!-- 自定义已存在内容 -->
        <div class="bw-upload" v-else>
            <draggable v-model="fileList" filter=".forbid" :move="onMove">
                <!-- 主图 -->
                <div class="upContent updone" v-for="item in fileList" :key="item.key">
                    <a-badge :count="badgecount(item.type)" :number-style="badgestyle(item.type)" style="display: block;height: 100%;width: 100%;">
                        <div class="content" :class="{forbid:item.type==='video'}">
                            <img :src="screenshot(item)" :alt="item.name" width="100%" height="100%">
                            <span class="tools">
                                <a-icon class="toolsbutton" type="eye" @click="handlePreview(item)" />
                                <a-icon class="toolsbutton" type="delete" @click="removefile(item)" />
                            </span>
                        </div>
                    </a-badge>
                </div>
            </draggable>
            <!-- 上传 -->
            <div class="upContent upload" v-if="fileList.length < 6" @click="()=>mideoVisible=true">
                <a-icon type="plus" style="font-size: 20px;" />
                <span>添加主图</span>
            </div>
        </div>
        <!-- 图片预览 -->
        <a-modal centered :visible="previewVisible" :footer="null" @cancel="handleCancel" width="800px">
            <img alt="example" style="width: 100%" :src="previewImage" v-if="!isVideo" />
            <video :src="previewImage" style="width: 100%;" controls="controls" v-else></video>
        </a-modal>
        <!-- 媒体中心 -->
        <a-modal v-model="mideoVisible" width="1100px" :footer="null" :getContainer="()=>$refs.CommodityImageAndMove"
            :mask="false" :bodyStyle="{height:'600px',overflow:'auto'}" centered forceRender>
            <span slot="title">
                图片管理
                <a-input-search placeholder="请输入图片的名称进行检索" style="width:300px;margin-left:24px;" v-model="search"
                    @change="onSearch" />
            </span>
            <ListImage scene multiple ref="listImage" :flie-list="fileList" @change="setFileList" />
        </a-modal>
    </div>
    </div>
</template>
<script>
    import draggable from 'vuedraggable'
    export default {
        name: 'CommodityImageAndMove',
        components: {
            draggable,
        },
        data() {

            return {
                previewVisible: false,
                mideoVisible: false,
                isVideo: false,
                previewImage: '',
                search: '',
                fileList: [],
            };
        },
        computed: {
            screenshot() {
                return function (option) {
                    let url
                    if (option.type === 'image') {
                        url = option.url
                    } else {
                        url = option.url + `?x-oss-process=video/snapshot,t_7000,f_jpg,w_120,h_120,m_fast`
                    }
                    return url
                }
            },
            badgecount(){
                return function(val){
                    return val==='video'?'视频':'图片'
                }
            },
            badgestyle(){
                return function(val){
                    return val==='video'?{backgroundColor: '#f50'}:{backgroundColor: '#52c41a'}
                }
            }
        },
        methods: {
            handleCancel() {
                this.previewVisible = false;
            },
            async handlePreview(file) {
                if (!file.url && !file.preview) {
                    file.preview = await getBase64(file.originFileObj);
                }
                this.isVideo = file.type === 'video' ? true : false
                this.previewImage = file.url || file.preview;
                this.previewVisible = true;
            },
            onRemove(file) {
                this.$refs.listImage.deleteFile(file.uid)
            },
            removefile(file) {
                this.onRemove(file)
                const fileList = this.fileList.filter(option => option.uid !== file.uid)
                this.handleChange({ fileList })
            },
            handleChange({ fileList }) {
                this.fileList = fileList;
            },
            //========================================================搜索图片中心的图片===============================================
            onSearch(e) {
                const params = this.search
                this.$refs.listImage.onSearch(params)
            },
            setFileList(fileList) {
                const newFileList = fileList.map(option => {
                    const itemOption = {
                        uid: option.id,
                        name: option.filename,
                        type: option.type,
                        url: option.url,
                        status: 'done'
                    }
                    return itemOption
                })
                this.fileList = newFileList
            },
            //========================================================拖拽===============================================
            onMove(e) {
                if (e.relatedContext.element.type === 'video') return false;
                return true;
            },
        }
    }
</script>
<style scoped lang="scss">
    .bw-upload {

        &::after {
            content: '';
            display: block;
            clear: both;
            visibility: hidden;
            height: 0;
            zoom: 1;
        }

        .upContent {
            float: left;
            width: 120px;
            height: 120px;
            border: 1px dashed #d9d9d9;
            border-radius: 5px;
            padding: 8px;
            margin: 0 16px 8px 0;
        }

        .upload {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            transition: all .3s;

            &:hover {
                border-color: #1890FF;
            }

            span {
                margin-top: 10px;
            }
        }

        .updone {
            border-style: solid;

            .content {
                position: relative;
                width: 100%;
                height: 100%;
                overflow: hidden;

                &::before {
                    content: '';
                    display: block;
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, .5);
                    transition: all .3s;
                    opacity: 0;
                }

                img {
                    object-fit: cover;
                }

                .tools {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    transition: all .3s;
                    color: #fff;
                    opacity: 0;

                    .toolsbutton {
                        transition: all .3s;
                        cursor: pointer;

                        &:first-of-type {
                            margin-right: 8px;
                        }

                        &:hover {
                            transform: scale(1.2);
                        }
                    }
                }

            }

            &:hover {
                .content {
                    &::before {
                        opacity: 1;
                    }

                    .tools {
                        opacity: 1;
                    }
                }
            }
        }
    }
</style>