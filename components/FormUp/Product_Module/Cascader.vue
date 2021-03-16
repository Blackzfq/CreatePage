<!-- 参数说明：
options：数据源 数组对象
value：选中数据 数组
disabled：是否可选

方法
@change:选中数据改变后的回调函数 -->

<template>
    <div class="Cascader">
        <a-cascader :options="options" :value='defaultValue' :disabled="disabled" :show-search="{ filter }"
            placeholder="选择分类归属" change-on-select @change="onChange" />
    </div>
</template>

<script>
    import { getCommoditiesSort, getCommoditiesSortDetails } from '@/assets/api'
    export default {
        name: "Cascader",
        props: {
            disabled: {
                type: Boolean,
                default: false
            },
            scene: {
                type: String,
                default: 'commodity'
            }
        },
        data() {
            return {
                defaultValue: [],//默认数组
                options: [],
            }
        },
        mounted() {
            this.getSort()
        },
        methods: {
            //初始化选择器
            initialize() {
                this.defaultValue = new Array()
            },
            //获取分类汇总
            async getSort(key) {
                const { data } = await getCommoditiesSort()
                const newOption = this.processing(data.data, false)
                this.options = newOption
                if (key && this.scene === 'classify') {
                    this.defaultValue=this.findParent(newOption,key)
                    this.defaultValue.pop()
                } else if (key) {
                    this.defaultValue=this.findParent(newOption,key)
                }
            },
            //数据处理 2021/3/15 改
            processing(arr, isDisabled) {
                const newOption = arr.map(item => {
                    const newItem = {
                        value: item.id,
                        label: item.name,
                        disabled: isDisabled
                    }
                    if (item.twoLevelCommodityTypes) {
                        const params = item.twoLevelCommodityTypes
                        if (params.length !== 0) {
                            newItem.children = this.processing(params, false)
                        }
                    } else if (item.threeLevelCommodityTypes) {
                        const params = item.threeLevelCommodityTypes
                        if (params.length !== 0) {
                            newItem.children = this.processing(params, true)
                        }
                    }
                    return Object.assign({}, newItem)
                })
                return newOption
            },
            //过滤树节点返回结果  2021/3/15 改
            findParent(tree, key) {
                let stack = new Array()
                let going = true
                let walker = (tree, key) => {
                    tree.forEach(item => {
                        if (!going) return
                        stack.push(item.value)
                        if (item.value === key) {
                            going = false
                        } else if (item.children) {
                            walker(item.children, key)
                        } else {
                            stack.pop()
                        }
                    })
                    if (going) stack.pop()
                }
                walker(tree, key)
                return stack
            },
            //过滤搜索结果
            filter(inputValue, path) {
                return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
            },
            //数据操作
            onChange(value) {
                this.defaultValue = value
                this.$emit("onSelectCallBack", value)
            },
            clearSelect() {
                const newSelect = new Array()
                this.defaultValue = newSelect
            }
        }
    }
</script>
<style scoped lang="scss">

</style>