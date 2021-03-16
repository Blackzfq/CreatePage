<template>
    <div class="ListImage" @scroll="onScroll">
        <div class="ImageList">
            <a-card hoverable style="width: 100%" v-for="(imageData,imageIndex) in data" :key="imageData.id"
                @click="setSelect(imageData.id)">
                <div slot="title" class="titleConent">
                    <a-icon type="check-circle" v-if="selectAll(imageData.id)"
                        style="font-size: 28px;color: rgb(82,196,26)" />
                    <div class="circle" v-else> </div>
                </div>
                <img slot="cover" alt="example" :src="imageData.url" width="100%" height="166px" />
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
            }
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
                    return this.selection.some(item => item === key)
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
                const total_pages = this.pagination.total_pages
                const current_page = this.pagination.current_page
                if (total_pages === current_page) {
                    this.isScroll = false
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
                        })
                }
            },
            //选择图片
            setSelect(key) {
                const selectList = this.selection
                if (selectList.some(item => item === key)) {
                    this.selection = selectList.filter(selectitem => selectitem !== key)
                } else if (selectList.length < 6) {
                    this.selection.push(key)
                } else {
                    this.$message.error('最多选择6项')
                    return
                }
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

    .titleConent {
        display: flex;
        justify-content: flex-end;
    }

    .circle {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 2px solid #666666;
        text-align: center;
        vertical-align: middle;
    }
</style>