<template>
    <div class="ProductClassify" ref="ProductClassify">
        <a-row type="flex" justify="space-between">
            <a-col :span="12">
                <span style="font-size: 16px;">商品分类查询</span>
                <a-icon type="reload" :spin="loading" style="margin-left: 15px;" @click="refreshData" />
            </a-col>
            <a-col :span="12" style="text-align: end;">
                <span class="myTextButton">导入</span>
                <span class="myTextButton">导出</span>
                <a-button type="primary" @click="()=>{redactKey='';visible=true;modalTitle='新建分类';}">
                    添加分类
                </a-button>
            </a-col>
        </a-row>
        <a-divider />
        <ListTable ref="listTable" :columns="columns" :data="data" @eitor="onEitor" />
        <!-- 弹窗 -->
        <a-modal v-model="visible" :footer="null" :getContainer="()=>$refs.ProductClassify" width="1200px"
            :bodyStyle="{height:'700px',overflow:'auto'}" centered destroyOnClose>
            <span slot="title">
                {{modalTitle}}
                <a-tag color="#2db7f5">
                    {{modalTitle|tagTipTitle}}
                </a-tag>
                <a-progress :percent="percent" size="small" status="active" style="margin-top:15px;" v-if="upLoading" />
            </span>
            <a-spin wrapperClassName="mywrapperClassName" :spinning="upLoading">
                <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
                <SortForm :redactKey="redactKey" @onpercent="(val)=>{percent=val}" @changeLoading="(val)=>{upLoading=val}" />
            </a-spin>
        </a-modal>
    </div>
</template>
<script>
    import { getCommoditiesSort } from '@/assets/api'
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
            title: '时间',
            dataIndex: 'date',
            scopedSlots: {
                filterDropdown: 'filterDateDropdown',
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
        name: 'ProductClassify',
        data() {
            return {
                columns,
                data,
                loading: false,
                upLoading: false,
                visible: false,
                modalTitle: '',
                percent: 0,
                redactKey:''
            }
        },
        filters: {
            tagTipTitle: function (val) {
                let title
                switch (val) {
                    case '新建分类':
                        title = "正在创建"
                        break;
                    default:
                        title = "正在编辑"
                }
                return title
            }
        },
        mounted(){
            this.getSortData()
        },
        methods: {
            //刷新当前列表内容
            refreshData() {
                this.loading = true
                this.getSortData()
            },
            //进入编辑
            onEitor(params) {
                this.redactKey=params.key
                this.modalTitle = params.title
                this.visible = true
            },
            //获取分类数据
            getSortData() {
                this.$refs.listTable.changeLoading(true)
                getCommoditiesSort()
                    .then(({data:{data:sortData}})=>{
                        const gData=this.formattingData(sortData)
                        this.data=gData
                    })
                    .catch(() => {
                        this.$notification.open({
                            message: `失败通知`,
                            description:
                                `分类获取失败，正在为您尝试重新连接获取`,
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
            formattingData(arr){
                const newArr=arr.map(item=>{
                    const sourceItem={
                        key:item.id,
                        url:item.main_img_url,
                        title:item.name,
                        date:item.created_at,
                        stick:item.attrSort?'1':'0'
                    }
                    if(item.twoLevelCommodityTypes||item.threeLevelCommodityTypes){
                        const params=item.twoLevelCommodityTypes||item.threeLevelCommodityTypes
                        if(params.length!==0){
                            sourceItem.children=this.formattingData(params)
                        }
                    }
                    return Object.assign({},sourceItem)
                })
                return newArr
            }
        }
    }
</script>
<style scoped lang="scss">
    .ProductClassify {
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

        /* loding的样式改写 */
        .mywrapperClassName {
            &::v-deep div {
                .ant-spin {
                    max-height: 100%;
                }
            }
        }
    }
</style>