<template>
    <div class="bw-upload">
        <!-- <draggable v-model="files" @end="onEnd"> -->
            <div class="upContent updone" v-for="item in fileList" :key="item.key">
                <div class="content">
                    <img :src="item.url" :alt="item.name" width="100%" height="100%">
                    <span class="tools">
                        <a-icon class="toolsbutton" type="eye" @click="preview(item)" />
                        <a-icon class="toolsbutton" type="delete" @click="removefile(item)" />
                    </span>
                </div>
            </div>
        <!-- </draggable> -->
        <div class="upContent upload" v-if="fileList.length < fileLength" @click="opendialog">
            <a-icon type="plus" style="font-size: 20px;" />
            <span>添加主图</span>
        </div>
    </div>
</template>
<script>
    // import draggable from 'vuedraggable'
    export default {
        name: 'BwUpload',
        // components: {
        //     draggable,
        // },
        props: {
            fileList: {
                type: Array,
                default: function () {
                    return new Array()
                }
            },
            fileLength: {
                type: Number,
                default: 6
            }
        },
        watch: {
            fileList: function (newVal) {
                this.files = newVal
            },
            files:function(newVal){
                this.fileListChange(newVal)
            },
            deep: true
        },
        data() {

            return {
                files: this.fileList
            }
        },
        methods: {
            opendialog() {
                try {
                    this.$emit('open')
                } catch (error) {
                    return false
                }
            },
            preview(file) {
                try {
                    this.$emit('preview', file)
                } catch (error) {
                    return false
                }
            },
            removefile(file) {
                try {
                    const fileList = this.fileList.filter(option => option.uid !== file.uid)
                    this.$emit('removefile', file)
                    this.fileListChange(fileList)
                } catch (error) {
                    return false
                }
            },
            fileListChange(fileList) {
                try {
                    this.$emit('change', { fileList })
                } catch (error) {
                    return false
                }
            },
            //开始拖拽事件
            onStart() {
                this.drag = true;
            },
            //拖拽结束事件
            onEnd(e) {
                console.log()
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
            margin: 0 8px 8px 0;
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