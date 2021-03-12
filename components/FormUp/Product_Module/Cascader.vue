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
            },
        },
        data() {
            return {
                defaultValue: [],//默认数组
                selected: undefined,//默认值
                defaultCopy: [],
                options: [],
            }
        },
        mounted() {
            this.getSort()
        },
        methods: {
            //获取分类汇总
            async getSort() {
                const { data } = await getCommoditiesSort()
                const newOption = this.processing(data.data)
                this.options = newOption
                const id = this.$route.query.id
                const commodity_type_id = this.$route.query.commodity_type_id
                if (commodity_type_id) {
                    this.selected = commodity_type_id
                    this.redactPage()
                } else if (id) {
                    this.selected = id
                    this.redactPage()
                }
            },
            //数据处理
            processing(arr) {
                const newArray = new Array()
                const that = this
                arr.forEach(function (value, index) {
                    const newObj_A = new Object()
                    newObj_A.value = value.id
                    newObj_A.label = value.name
                    if (value.twoLevelCommodityTypes) {
                        const children = this.processing(value.twoLevelCommodityTypes)
                        if (children.length !== 0) newObj_A.children = children
                    } else if (value.threeLevelCommodityTypes) {
                        const children = this.processing(value.threeLevelCommodityTypes)
                        if (children.length !== 0) {
                            children.forEach(function (value, index) {
                                this.scene === "classify" ? value.disabled = true : value.disabled = false
                            }, this)
                            newObj_A.children = children
                        }
                    }
                    newArray[index] = newObj_A
                }, this)
                return newArray
            },
            //过滤搜索结果
            filter(inputValue, path) {
                return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
            },
            //获取关联父级
            processClassIfyOne() {
                const arr = this.options
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].value == this.selected) {
                        this.defaultCopy[0] = arr[i].value
                        break;
                    } else if (arr[i].children) {
                        const isFind = this.processClassIfytow(arr[i].value, arr[i].children)
                        if (isFind) break;
                    }
                }
            },
            processClassIfytow(key, arr) {
                let isFind = false
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].value == this.selected) {
                        this.defaultCopy[0] = key
                        this.defaultCopy[1] = arr[i].value
                        isFind = true
                        break
                    } else if (arr[i].children) {
                        const ischildFind = this.processClassIfytree(key, arr[i].value, arr[i].children)
                        if (ischildFind) {
                            isFind = true
                            break;
                        }
                    }
                }
                return isFind
            },
            processClassIfytree(key1, key2, arr) {
                let isFind = false
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].value == this.selected) {
                        this.defaultCopy[0] = key1
                        this.defaultCopy[1] = key2
                        this.defaultCopy[2] = arr[i].value
                        isFind = true
                        break
                    }
                }
                return isFind
            },
            //数据操作
            onChange(value) {
                this.defaultValue = value
                this.$emit("onSelectCallBack", value)
            },
            clearSelect() {
                const newSelect = new Array()
                this.defaultValue = newSelect
            },
            //编辑
            redactPage() {
                this.processClassIfyOne()
                const newArr = this.defaultCopy
                if (this.scene === "classify") {
                    newArr.pop()
                }
                this.defaultValue = newArr

            }
        }
    }
</script>
<style scoped lang="scss">

</style>