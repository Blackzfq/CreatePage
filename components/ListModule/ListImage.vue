<!-- API
     事件
     change      选择状态改变的回调            function(fileList)
     insertion   获取图片的url地址             function(url)
     removeFile  移除某项图片                  function(file) 
-->
<template>
    <div class="ListImage" @scroll="onScroll">
        <div class="ImageList">
            <a-card hoverable style="width: 100%" v-for="(imageData,imageIndex) in data" :key="imageData.id"
                @click="setSelect(imageData)">
                <template slot="cover">
                    <div class="coverimage">
                        <img alt="example" :src="screenshot(imageData)" width="100%" height="166px" />
                        <div class="circlebox" v-if="multiple">
                            <a-icon type="check-circle" v-if="selectAll(imageData.id)"
                                style="font-size: 20px;color: rgb(82,196,26)" />
                            <div class="circle" v-else> </div>
                        </div>
                    </div>
                </template>
                <template slot="actions" class="ant-card-actions">
                    <a-tooltip placement="top" v-if="!scene">
                        <template slot="title">
                            <span>复制链接到剪贴板</span>
                        </template>
                        <a-icon key="setting" type="copy" v-clipboard:copy="imageData.url" v-clipboard:success="onCopy"
                            v-clipboard:error="onError" />
                    </a-tooltip>
                    <a-tooltip placement="top" v-if="!scene">
                        <template slot="title">
                            <span>编辑图片详情</span>
                        </template>
                        <a-icon key="edit" type="edit" />
                    </a-tooltip>
                    <a-tooltip placement="top" v-if="!scene">
                        <template slot="title">
                            <span>更多内容设置</span>
                        </template>
                        <a-icon key="ellipsis" type="setting" />
                    </a-tooltip>
                    <a-tooltip placement="top" v-else>
                        <template slot="title">
                            <span>将该图片插入详情</span>
                        </template>
                        <a-icon key="select" type="select" @click="insertionImage(imageData.url)" />
                    </a-tooltip>
                </template>
                <a-card-meta :title="imageData.filename" :description="imageData.updated_at" />
            </a-card>
        </div>
        <div class="example" style="text-align: center;" v-if="loading">
            <a-spin>
                <a-icon slot="indicator" type="loading" style="font-size: 24px;margin-top: 24px;" spin />
            </a-spin>
        </div>
        <a-empty :description="false" v-if="data.length==0 && !loading" />
    </div>
</template>
<script>
    import { getMedioList } from '@/assets/api'
    const data = []
    const selection = []
    export default {
        name: 'ListImage',
        props: {
            scene: {
                type: Boolean,
                default: false
            },
            updeData: {
                type: Object,
                default: null
            },
            multiple: {
                type: Boolean,
                default: false
            },
        },
        watch: {
            updeData: function (newVal) {
                this.data.unshift(newVal)
            },
            deep: true
        },
        data() {

            return {
                data,
                selection,
                loading: true,
                isScroll: true,
                keyword: '',
                pagination: {}
            }
        },
        computed: {
            selectAll() {
                return function (key) {
                    return this.selection.some(item => item.id === key)
                }
            },
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
            }
        },
        created() {
            this.resetImageList()
        },
        methods: {
            // 拉取图片数据
            async resetImageList(params = {}) {

                this.data = new Array()
                this.pagination = new Object()
                this.loading = true
                this.isScroll = true

                params.page = 1
                params.keyword = this.keyword
                getMedioList(params)
                    .then(({ data: { data: listData, meta: { pagination } } }) => {
                        this.data = listData
                        this.pagination = pagination

                    })
                    .catch(err => {
                        this.$message.error('图片加载失败')
                    })
                    .finally(() => {
                        this.loading = false
                    })
            },
            // 图片搜索
            onSearch(val) {
                this.keyword = val
                this.resetImageList()
            },
            // 翻页拉取图片数据
            getImageList(params = {}) {
                this.isScroll = false
                const total_pages = this.pagination.total_pages
                const current_page = this.pagination.current_page
                if (total_pages === current_page) {
                    this.$message.success('已经全部加载完毕了')
                    return
                } else {
                    this.loading = true
                    params.page = current_page + 1
                    params.keyword = this.keyword
                    getMedioList(params)
                        .then(({ data: { data: listData, meta: { pagination } } }) => {
                            this.data = [...this.data, ...listData]
                            this.pagination = pagination
                        })
                        .catch(err => {
                            this.$message.error('图片加载失败')
                        })
                        .finally(() => {
                            this.loading = false
                            this.isScroll = true
                        })
                }
            },
            //选择图片
            setSelect(option) {
                const key = option.id
                if (!this.multiple) return
                const selectList = this.selection
                if (selectList.some(item => item.id === key)) {
                    this.selection = selectList.filter(selectitem => selectitem.id !== key)
                } else if (selectList.length < 6) {
                    this.selection.push(option)
                } else {
                    this.$message.error('最多选择6项')
                    return
                }
                this.$emit('change', this.selection)
            },
            // 移除选择的图片
            deleteFile(key) {
                this.selection = this.selection.filter(item => item.id !== key)
                // console.log(this.selection)
            },
            // 复制成功时的回调函数
            onCopy(e) {
                this.$message.success("内容已复制到剪切板！")
            },
            // 复制失败时的回调函数
            onError(e) {
                this.$message.error("抱歉，复制失败！")
            },
            //插入图片中心的图片
            insertionImage(val) {
                this.$emit('insertion', val)
            },
            //滚动监听
            onScroll(e) {
                let ele = e.srcElement ? e.srcElement : e.target;
                if (ele.scrollTop + ele.offsetHeight === ele.scrollHeight) { //监听滚动到div底部
                    if (this.isScroll) {
                        this.getImageList()
                    }
                }
            }
        }
    }
</script>
<style scoped lang="scss">
    .ListImage {
        height: calc(100% - 84px);
        overflow-y: auto;
    }

    .ImageList {
        display: grid;
        grid-template-columns: repeat(5, 18.4%);
        grid-column-gap: 2%;
        grid-row-gap: 15px;
    }

    .coverimage {
        position: relative;

        .circlebox {
            position: absolute;
            top: 5px;
            right: 5px;
        }
    }

    .circle {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, .5);
        text-align: center;
        vertical-align: middle;
    }
</style>