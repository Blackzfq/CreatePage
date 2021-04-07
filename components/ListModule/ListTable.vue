<template>
    <div class="ListTable">
        <div style="margin-bottom: 16px" v-if="scene==='list'">
            <a-dropdown placement="bottomLeft">
                <a-button :loading="loading">批量操作</a-button>
                <a-menu slot="overlay">
                    <a-menu-item :disabled="!hasSelected" @click="$emit('batch','isShow',selectedRowKeys,1)">橱窗
                    </a-menu-item>
                    <a-menu-item :disabled="!hasSelected" @click="$emit('batch','isShow',selectedRowKeys,0)">仓库
                    </a-menu-item>
                    <a-menu-item :disabled="!hasSelected" @click="$emit('batch','attrSort',selectedRowKeys,0)">归档
                    </a-menu-item>
                    <a-menu-item :disabled="!hasSelected" @click="$emit('batch','attrSort',selectedRowKeys,1)">置顶
                    </a-menu-item>
                    <a-menu-item :disabled="!hasSelected" @click="onRemove(selectedRowKeys)">删除</a-menu-item>
                    <a-sub-menu key="test" title="一键操作" :disabled="hasSelected">
                        <a-menu-item>
                            一键上架
                            <a-tooltip title="将仓库中的所有商品全部发布到橱窗中" placement="right" style="color: orange;">
                                <a-icon type="question-circle-o" />
                            </a-tooltip>
                        </a-menu-item>
                        <a-menu-item>
                            一键下架
                            <a-tooltip title="将橱窗中的所有商品全部下架归入仓库" placement="right" style="color: orange;">
                                <a-icon type="question-circle-o" />
                            </a-tooltip>
                        </a-menu-item>
                        <a-menu-item>
                            一键分类
                            <a-tooltip title="为全店商品设置统一的分类" placement="right" style="color: orange;">
                                <a-icon type="question-circle-o" />
                            </a-tooltip>
                        </a-menu-item>
                    </a-sub-menu>
                </a-menu>
            </a-dropdown>
            <span style="margin-left: 8px">
                <template v-if="hasSelected">
                    {{ `已选择 ${selectedRowKeys.length} 项` }}
                </template>
            </span>
        </div>
        <a-table :columns="columns" :data-source="data" :pagination="pagination" :loading="loading"
            :row-selection="rowSelection" @change="handleTableChange">
            <!-------------------------------------------------------------------- 表头设置 ------------------------------------------------------>
            <!-- 搜索名称 -->
            <div slot="filterNameDropdown" slot-scope="{confirm, clearFilters, column }" style="padding: 8px">
                <a-input v-model="pagination.name||pagination.title" :placeholder="`搜索${column.title}`"
                    style="width: 188px; margin-bottom: 8px; display: block;" />
            </div>
            <!-- 搜索分类 -->
            <div slot="filterSortDropdown" slot-scope="{confirm, clearFilters, column }"
                style="padding: 8px;max-height: 300px;overflow: auto;">
                <SortTree :scene="sortTreeScene" @onCheck="(val)=>pagination.commodityTypeIds?pagination.commodityTypeIds=val:pagination.blogTypeIds=val" />
            </div>
            <!-- 排序筛选 -->
            <div slot="filterDateDropdown" slot-scope="{confirm, clearFilters, column }" style="padding: 8px">
                <a-radio-group style="display: block;" v-model="pagination.time">
                    <a-radio v-for="item in sortRadio" :key="item.value" :style="radioStyle" :value="item.value">
                        {{item.label}}
                    </a-radio>
                </a-radio-group>
            </div>
            <!-- 状态筛选 -->
            <div slot="filterStateDropdown" slot-scope="{confirm, clearFilters, column }" style="padding: 8px">
                <a-radio-group style="display: block;" v-model="pagination.isShow">
                    <a-radio v-for="item in isShowRadio" :key="item.value" :style="radioStyle" :value="item.value">
                        {{item.label}}
                    </a-radio>
                </a-radio-group>
            </div>
            <!-- 搜索图标 -->
            <a-icon slot="searchIcon" slot-scope="filtered" type="search"
                :style="{ color: filtered ? '#108ee9' : undefined }" />
            <!-- 筛选图标 -->
            <a-icon slot="filtereIcon" slot-scope="filtered" type="filter"
                :style="{ color: filtered ? '#108ee9' : undefined }" />
            <!-------------------------------------------------------------------- 表格内容 ------------------------------------------------------>
            <!-- 名称列 -->
            <span slot="name" slot-scope="text,record">
                <a-tooltip placement="top">
                    <template slot="title">
                        <img :src="record.url" alt="" style="width: 100px;height: 100px;">
                    </template>
                    {{text}}
                </a-tooltip>
            </span>
            <!-- 分类列 -->
            <span slot="classfly" slot-scope="text">
                <a-tag color="blue" v-for="item in text" :key="item.key">
                    {{item.title}}
                </a-tag>
            </span>
            <!-- 状态列 -->
            <span slot="state" slot-scope="text">
                <a-badge :status="text|badgeColor" :text="text|badgeText" />
            </span>
            <!-- 标签列 -->
            <span slot="stick" slot-scope="text">
                <a-tag :color="text|stickColor">
                    {{text|stickText}}
                </a-tag>
            </span>
            <!-- 功能列 -->
            <span slot="action" slot-scope="text, record">
                <a>预览</a>
                <a-divider type="vertical" />
                <a-dropdown>
                    <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                        更多
                    </a>
                    <a-menu slot="overlay">
                        <a-menu-item>
                            <a @click="$emit('clone',record)">复制</a>
                        </a-menu-item>
                        <a-menu-item>
                            <a @click="$emit('eitor',record)">编辑</a>
                        </a-menu-item>
                        <a-menu-item>
                            <a @click="onRemove(record)">删除</a>
                        </a-menu-item>
                    </a-menu>
                </a-dropdown>
            </span>
        </a-table>
    </div>
</template>
<script>
    import { user_GetList } from '@/assets/api'
    const radioStyle = {
        display: 'block',
        height: '30px',
        lineHeight: '30px'
    }

    const sortRadio = [
        {
            value: '',
            label: '默认排序'
        },
        {
            value: 0,
            label: '创建时间倒序'
        },
        {
            value: 1,
            label: '创建时间顺序'
        },
        {
            value: 2,
            label: '修改时间倒序'
        },
        {
            value: 3,
            label: '修改时间顺序'
        }
    ];

    const isShowRadio = [
        {
            value: '',
            label: "全部"
        },
        {
            value: 0,
            label: "仓库"
        },
        {
            value: 1,
            label: "橱窗"
        },
    ]

    export default {
        name: 'ListTable',
        props: {
            scene: {
                type: String,
                default: 'list'// 列表|列表树  'list'|'listTree'
            },
            columns: {
                type: Array,
                default: function () {
                    return new Array()
                }
            },
            pagination: {
                type: Object,
                default: function () {
                    return new Object()
                }
            },
            data: {
                type: Array,
                default: function () {
                    return new Array()
                }
            }
        },
        data() {

            return {
                radioStyle,
                sortRadio,
                isShowRadio,
                loading: false,
                selectedRowKeys: [],
            }
        },
        filters: {
            badgeColor: function (value) {
                value += ''
                return value === '1' ? 'processing' : 'default'
            },
            badgeText: function (value) {
                value += ''
                return value === '1' ? '橱窗' : '仓库'
            },
            stickColor: function (val) {
                val += ''
                return val === '1' ? '#f50' : '#87d068'
            },
            stickText: function (val) {
                val += ''
                return val === '1' ? '置顶中' : '默认'
            }
        },
        computed: {
            hasSelected() {
                return this.selectedRowKeys.length > 0;
            },
            rowSelection() {
                let rowSelection
                if(this.scene==='list'){
                    rowSelection = { selectedRowKeys: this.selectedRowKeys, onChange: this.onSelectChange}
                }else{
                    rowSelection=null
                }
                return rowSelection
            },
            sortTreeScene(){
                return this.pagination.blogTypeIds?'blog':'product'
            }
        },
        methods: {
            // 切换loading状态
            changeLoading(val) {
                this.loading = val
            },
            handleTableChange(pagination) {
                const pager = { ...this.pagination };
                pager.current = pagination.current;
                this.$emit('fetch', pager)
            },
            onSelectChange(selectedRowKeys) {
                this.selectedRowKeys = selectedRowKeys;
            },
            onRemove(record) {
                const _this = this
                this.$confirm({
                    title: `您正在进行内容删除！`,
                    content: '本次删除不可逆，请谨慎操作',
                    okText: '删除',
                    okType: 'danger',
                    cancelText: '取消',
                    onOk() {
                        _this.$emit('remove', record)
                    },
                    onCancel() {
                        _this.$notification.open({
                            message: `已取消`,
                            description:
                                `操作已取消，内容不做任何更改`,
                            placement: 'bottomRight',
                        });
                    },
                });
            }
        },
    }
</script>
<style scoped lang="scss">
</style>