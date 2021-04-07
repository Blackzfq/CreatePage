<template>
    <div class="LabelManagement">
        <h1>
            <span>T</span>
            <span>A</span>
            <span>G</span>
            <span>S</span>
            <span>标</span>
            <span>签</span>
            <span>管</span>
            <span>理</span>
        </h1>
        <a-input-search placeholder="请输入要搜索的标签名" style="width: 1000px" size="large" @search="onSearch" />
        <div class="tip" style="width: 1000px;margin-top:8px;">
            <span :style="{ marginRight: 8 }">标签类别:</span>
            <template v-for="tag in tags">
                <a-checkable-tag :key="tag" :checked="selectedTags.indexOf(tag) > -1"
                    @change="checked => handleChange(tag, checked)">
                    {{ tag }}
                </a-checkable-tag>
            </template>
        </div>
        <div class="tagListConeten">
            <h2 class="animate__animated  animate__rubberBand animate__infinite" v-if="loading">正在努力检索中......</h2>
            <template v-for="(item,index) in labels" v-else>
                <a-tag  :color="colorList[Math.floor(Math.random()*10)]"
                    class="animate_tag animate__animated animate__zoomInUp animate__fast"
                    :style="delay(index,labels.length)" v-if="item.id">
                    {{item.name}}
                </a-tag>
                <a-divider v-else />
            </template>
        </div>
    </div>
</template>
<script>
    import { getCommodityLabelList, getBlogTagsList } from '@/assets/api'
    export default {
        name: 'LabelManagement',
        data() {

            return {
                loading: false,
                tags: ['博客标签', '商品标签'],
                selectedTags: ['博客标签'],
                labels: [],
                colorList: ['#a333c8', '#00b5ad', '#db2828', '#f2711c', '#6435c9', '#21ba45', '#a5673f', '#b5cc18', '#2185d0', '#e03997']
            }
        },
        computed: {
            delay() {
                return function (val, total) {
                    const deleaydate = (total - val + 1) * 0.2
                    return {
                        'animation-delay': `${deleaydate}s`
                    }
                }
            }
        },
        mounted() {
            this.getLabelData()
        },
        methods: {
            handleChange(tag, checked) {
                const { selectedTags } = this;
                if (!checked && selectedTags.length > 1) {
                    const nextSelectedTags = selectedTags.filter(t => t !== tag);
                    this.selectedTags = nextSelectedTags;
                } else if (checked) {
                    const nextSelectedTags = [...selectedTags, tag]
                    this.selectedTags = nextSelectedTags;
                }
            },
            //初始化
            async getLabelData(params = {}) {
                const selectedTags = this.selectedTags

                this.loading = true
                if (selectedTags.length !== 2 && selectedTags.some(o => o === '商品标签')) {
                    getCommodityLabelList(params)
                        .then(({ data: { data: labels } }) => {
                            this.labels = [...labels]
                        })
                        .catch(() => {
                            this.$notification.open({
                                message: `失败提醒`,
                                description:
                                    `标签列表获取失败，请尝试重新获取`,
                                placement: 'bottomRight',
                                duration: 0,
                            })
                        }
                        )
                        .finally(() => {
                            setTimeout(() => {
                                this.loading = false
                            }, 3000)
                        })
                } else if (selectedTags.length !== 2 && selectedTags.some(o => o === '博客标签')) {
                    getBlogTagsList(params)
                        .then(({ data: { data: labels } }) => {
                            this.labels = [...labels]
                        })
                        .catch(() => {
                            this.$notification.open({
                                message: `失败提醒`,
                                description:
                                    `标签列表获取失败，请尝试重新获取`,
                                placement: 'bottomRight',
                                duration: 0,
                            })
                        }
                        )
                        .finally(() => {
                            setTimeout(() => {
                                this.loading = false
                            }, 3000)
                        })
                } else {
                    const productLabels=await getCommodityLabelList(params)
                    const blogLabels=await getBlogTagsList(params)
                    this.labels=[...productLabels.data.data,...blogLabels.data.data]
                    this.loading = false
                }
            },
            onSearch(val) {
                const params = {
                    name: val
                }
                this.loading = true
                this.labels = new Array()
                this.getLabelData(params)
            }
        },
    }
</script>
<style scoped lang="scss">
    .LabelManagement {
        padding: 24px;
        background-color: #FFF;
        min-width: 1100px;
        overflow: auto;
        position: relative;
        height: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-direction: column;


        h1 {
            font-size: 40px;
            font-weight: 700;
            font-family: 'Helvetica Neue', Arial, Helvetica, sans-serif;

            span:nth-child(1) {
                color: #4285f4;
            }

            span:nth-child(2) {
                color: #db4437;
            }

            span:nth-child(3) {
                color: #f4b400;
            }

            span:nth-child(4) {
                color: #4285f4;
            }

            span:nth-child(5) {
                color: #0f9d58;
            }

            span:nth-child(6) {
                color: #db4437;
            }

            span:nth-child(7) {
                color: #f4b400;
            }

            span:nth-child(8) {
                color: #4285f4;
            }
        }

        .tagListConeten {
            width: 1100px;
            margin-top: 30px;
            text-align: center;
        }
    }


    .animate_tag {
        margin: 0 8px 8px 0;
        line-height: 30px;
        border-radius: 25px;
        /* display: inline-block; */
    }
</style>