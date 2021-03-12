<template>
    <div class="ListTable">
        <div style="margin-bottom: 16px">
            <a-dropdown placement="bottomLeft">
                <a-button :loading="loading">批量操作</a-button>
                <a-menu slot="overlay">
                    <a-menu-item :disabled="!hasSelected">发布</a-menu-item>
                    <a-menu-item :disabled="!hasSelected">草稿</a-menu-item>
                    <a-menu-item :disabled="!hasSelected">归档</a-menu-item>
                    <a-menu-item :disabled="!hasSelected">置顶</a-menu-item>
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
            <!-- 筛选标签 -->
            <span style="margin-left: 8px">
                <a-tag color="#f50" closable v-if="goodsQuery.name" @close="log">
                    {{goodsQuery.name}}
                </a-tag>
                <a-tag color="#2db7f5" v-if="goodsQuery.commodityTypeIds.length!==0"
                    v-for="(tagitem,tagindex) in goodsQuery.commodityTypeIds" :key="tagitem" closable @close="log">
                    {{tagitem}}
                </a-tag>
                <a-tag color="orange" v-if="goodsQuery.isShow" closable @close="log">
                    {{goodsQuery.isShow|badgeText}}
                </a-tag>
            </span>
        </div>
        <a-table :columns="columns" :data-source="data" :pagination="pagination" :loading="loading"
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" @change="handleTableChange">
            <!-------------------------------------------------------------------- 表头设置 ------------------------------------------------------>
            <!-- 搜索名称 -->
            <div slot="filterNameDropdown" slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
                style="padding: 8px">
                <a-input v-ant-ref="c => (searchInput = c)" v-model="goodsQuery.name" :placeholder="`搜索${column.title}`"
                    style="width: 188px; margin-bottom: 8px; display: block;" />
            </div>
            <!-- 搜索分类 -->
            <div slot="filterSortDropdown" slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
                style="padding: 8px;max-height: 300px;overflow: auto;">
                <ClassifyTree @onCheck="onCheck" />
            </div>
            <!-- 排序筛选 -->
            <div slot="filterDateDropdown" slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
                style="padding: 8px">
                <a-radio-group style="display: block;">
                    <a-radio :style="radioStyle" :value="1">
                        按创建时间升序
                    </a-radio>
                    <a-radio :style="radioStyle" :value="2">
                        按创建时间降序
                    </a-radio>
                    <a-radio :style="radioStyle" :value="3">
                        按更新时间升序
                    </a-radio>
                    <a-radio :style="radioStyle" :value="4">
                        按更新时间降序
                    </a-radio>
                </a-radio-group>
            </div>
            <!-- 状态筛选 -->
            <div slot="filterStateDropdown"
                slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }" style="padding: 8px">
                <a-radio-group style="display: block;" v-model="goodsQuery.isShow">
                    <a-radio :style="radioStyle" value="0">
                        仓库
                    </a-radio>
                    <a-radio :style="radioStyle" value="1">
                        橱窗
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
                            <a href="javascript:;">复制</a>
                        </a-menu-item>
                        <a-menu-item>
                            <a href="javascript:;" @click="$emit('eitor',record)">编辑</a>
                        </a-menu-item>
                        <a-menu-item>
                            <a href="javascript:;">删除</a>
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

    export default {
        name: 'ListTable',
        props:{
            columns:{
                type:Array,
                default:function(){
                    return new Array()
                }
            },
            data:{
                type:Array,
                default:function(){
                    return new Array()
                }
            }
        },
        data() {

            return {
                radioStyle,
                pagination: {},
                loading: false,
                selectedRowKeys: [],
                goodsQuery: {},
            }
        },
        filters: {
            badgeColor: function (value) {
                return value === '1' ? 'processing' : 'default'
            },
            badgeText: function (value) {
                return value === '1' ? '橱窗' : '仓库'
            },
            stickColor: function (val) {
                return val === '1' ? '#f50' : '#87d068'
            },
            stickText: function (val) {
                return val === '1' ? '置顶中' : '默认'
            }
        },
        computed: {
            hasSelected() {
                return this.selectedRowKeys.length > 0;
            },
        },
        mounted() {
            this.fetch();
            this.resetGoodsQuery()
        },
        methods: {
            /*初始化*/
            resetGoodsQuery(params = {}) {
                const data = {
                    isShow: '',
                    name: '',
                    commodityTypeIds: [],
                    per_page: '15'
                }
                this.goodsQuery = Object.assign({}, data)
            },
            log(e) {
                console.log(e);
            },
            handleTableChange(pagination, filters, sorter) {
                console.log(pagination);
                const pager = { ...this.pagination };
                pager.current = pagination.current;
                this.pagination = pager;
                this.fetch({
                    results: pagination.pageSize,
                    page: pagination.current,
                    sortField: sorter.field,
                    sortOrder: sorter.order,
                    ...filters,
                });
            },
            fetch(params = {}) {
                this.loading = true;
                const data = {
                    results: 10,
                    ...params
                }
                user_GetList("https://randomuser.me/api", data)
                    .then(data => {
                        console.log('成功')
                        // const pagination = { ...this.pagination };
                        // // Read total count from server
                        // // pagination.total = data.totalCount;
                        // pagination.total = 200;
                        // this.loading = false;
                        // this.data = data.results;
                        // this.pagination = pagination;
                    })
                    .catch(err => {
                        console.log('失败')
                    })
                    .finally(() => {
                        this.loading = false;
                    })
            },
            onSelectChange(selectedRowKeys) {
                console.log('selectedRowKeys changed: ', selectedRowKeys);
                this.selectedRowKeys = selectedRowKeys;
            },
            onCheck(val) {
                this.goodsQuery.commodityTypeIds = val
            }
        },
    }
</script>
<style scoped lang="scss">
</style>