<template>
    <a-select labelInValue mode="multiple" style="width: 100%" placeholder="商品标签" @focus="onFocus" @change="handleChange">
        <div slot="dropdownRender" slot-scope="menu">
            <v-nodes :vnodes="menu" />
            <a-divider style="margin: 4px 0;" />
            <div style="padding: 4px 8px; cursor: pointer;" @mousedown="e => e.preventDefault()" @click="addItem">
                <a-icon type="plus" /> 新增标签
            </div>
        </div>
        <a-spin v-if="fetching" slot="notFoundContent" size="small" />
        <a-select-option v-for="i in labels" :key="i.id">
            {{i.name}}
        </a-select-option>
    </a-select>
</template>
<script>
    import { getCommodityLabelList, addCommodityLabel } from '@/assets/api'
    export default {
        name: 'TagsSelect',
        data() {
            return {
                labels: [],
                editor: false,
                fetching: true,
            }
        },
        components: {
            VNodes: {
                functional: true,
                render: (h, ctx) => ctx.props.vnodes,
            },
        },
        methods: {
            handleChange(value) {
                this.editor = false
                this.$emit('change',value)
            },
            getLabels() {
                this.fetching=true
                getCommodityLabelList()
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
                    })
                    .finally(()=>{
                        this.fetching = false
                    })
            },
            addItem() {
                const _this = this
                this.$confirm({
                    title: '新增数据',
                    content: (
                        <a-input ref="addInputBox" placeholder="Basic usage" />
                    ),
                    onOk() {
                        return new Promise((resolve, reject) => {
                            addCommodityLabel({ name: _this.$refs.addInputBox.stateValue })
                                .then(() => {
                                    _this.labels = new Array()
                                    _this.fetching = true
                                    setTimeout(resolve, 2000)
                                })
                                .catch(() => {
                                    setTimeout(reject, 2000)
                                })
                        }).catch(() => {
                            _this.$message.error('标签新增失败')
                        });
                    },
                    onCancel() { },
                });
            },
            onFocus() {
                if (this.fetching||this.labels.length===0) {
                    this.getLabels()
                }
            }
        },
    };
</script>

<style scoped lang="scss">

</style>