<template>
    <div class="ProductList" ref="ProductList">
        <a-row type="flex" justify="space-between">
            <a-col :span="12">
                <span style="font-size: 16px;">商品列表查询</span>
                <a-icon type="reload" :spin="loading" style="margin-left: 15px;" @click="refreshData" />
            </a-col>
            <a-col :span="12" style="text-align: end;">
                <span class="myTextButton">导入</span>
                <span class="myTextButton">导出</span>
                <a-button type="primary" @click="()=>{visible=true;modalTitle='新建商品';tagTip=''}">
                    添加商品
                </a-button>
            </a-col>
        </a-row>
        <a-divider />
        <ListTable ref="listTable" :columns="columns" :data="data" @eitor="onEitor" />
        <!-- 弹窗 -->
        <a-modal v-model="visible" :footer="null" :getContainer="()=>$refs.ProductList" width="1200px"
            :bodyStyle="{height:'700px',overflow:'auto'}" centered>
            <span slot="title">
                {{modalTitle}}
                <a-tag :color="tagTip|tagTipColor">
                    {{tagTip|tagTipTitle}}
                </a-tag>
            </span>
            <ProductForm />
        </a-modal>
    </div>
</template>
<script>
    import { getCommodity } from '@/assets/api'
    const columns = [
        {
            title: '名称',
            dataIndex: 'title',
            width: '20%',
            scopedSlots: {
                customRender: 'name',
                filterDropdown: 'filterNameDropdown',
                filterIcon: 'searchIcon',
            }
        },
        {
            title: '分类',
            dataIndex: 'classfly',
            scopedSlots: {
                customRender: 'classfly',
                filterDropdown: 'filterSortDropdown',
                filterIcon: 'searchIcon',
            }
        },
        {
            title: '时间',
            dataIndex: 'date',
            scopedSlots: {
                filterDropdown: 'filterDateDropdown',
                filterIcon: 'filtereIcon',
            }
        },
        {
            title: '状态',
            dataIndex: 'state',
            scopedSlots: {
                customRender: 'state',
                filterDropdown: 'filterStateDropdown',
                filterIcon: 'filtereIcon',
            }
        },
        {
            title: '置顶',
            dataIndex: 'stick',
            scopedSlots: { customRender: 'stick' },
        },
        {
            title: '功能区',
            dataIndex: 'action',
            scopedSlots: { customRender: 'action' },
        },
    ];
    const data = [];
    export default {
        name: 'ProductList',
        data() {
            return {
                columns,
                data,
                loading: false,
                visible: false,
                modalTitle: '',
                tagTip: '',
            }
        },
        filters: {
            tagTipColor: function (val) {
                let color
                switch (val) {
                    case '0':
                        color = "#f50"
                        break;
                    case '1':
                        color = "#2db7f5"
                        break;
                    default:
                        color = "#87d068"
                }
                return color
            },
            tagTipTitle: function (val) {
                let title
                switch (val) {
                    case '0':
                        title = "仓库内"
                        break;
                    case '1':
                        title = "橱窗中"
                        break;
                    default:
                        title = "正在创建"
                }
                return title
            }
        },
        mounted(){
            this.getGoods()
        },
        methods: {
            //重置当前列表
            refreshData() {
                this.loading = true
                this.getGoods()
            },
            //进入编辑
            onEitor(params) {
                this.visible = true
                this.modalTitle = params.title
                this.tagTip = params.state
            },
            //拉取列表数据
            getGoods() {
                this.$refs.listTable.changeLoading(true)
                getCommodity()
                    .then(({ data: { data: goodsData } }) => {
                        this.data = this.formattingData(goodsData)
                    })
                    .catch(() => {
                        this.$notification.open({
                            message: `失败通知`,
                            description:
                                `商品列表信息获取失败，正在为您尝试重新连接获取`,
                            placement: 'bottomRight',
                        });
                    })
                    .finally(
                        () => {
                            this.loading = false
                            this.$refs.listTable.changeLoading(false)
                        }
                    )
            },
            //处理分类数据
            formattingData(arr) {
                const newArr = arr.map(item => {
                    const sourceItem = {
                        key: item.id,
                        url: item.main_img_url,
                        title: item.name,
                        classfly:item.commodity_types.map(type=>{
                            const commodityType={
                                key:type.id,
                                title:type.name
                            } 
                            return Object.assign({}, commodityType)
                        }),
                        date: item.created_at,
                        stick: item.attrSort ? '1' : '0',
                        state: item.isShow ? '1' : '0'
                    }
                    return Object.assign({}, sourceItem)
                })
                return newArr
            }
        }
    }
</script>
<style scoped lang="scss">
    .ProductList {
        background-color: #fff;
        padding: 24px;
        min-width: 1100px;

        .myTextButton {
            padding-right: 40px;
            cursor: pointer;
            transition: all .3s;

            &:hover {
                color: #1890ff;
            }
        }

        &::v-deep .aformmodel {
            display: grid;
            grid-template-columns: auto 200px;
            grid-column-gap: 24px;

            .right_form {
                position: relative;

                .right_form_content {
                    position: sticky;
                    top: 0;
                }
            }
        }
    }
</style>