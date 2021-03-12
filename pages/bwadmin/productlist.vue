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
        <ListTable :columns="columns" :data="data" @eitor="onEitor" />
        <!-- 弹窗 -->
        <a-modal v-model="visible" :footer="null" :getContainer="()=>$refs.ProductList"
            width="1200px" :bodyStyle="{height:'700px',overflow:'auto'}" centered>
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
    const data = [
        {
            key: '1',
            url:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1091405991,859863778&fm=26&gp=0.jpg',
            title: 'John Brown',
            classfly: 'A',
            date: '2021-3-5',
            state: '0',
            stick: '0'
        },
        {
            key: '2',
            url:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1625564583,4245123740&fm=26&gp=0.jpg',
            title: 'Joe Black',
            classfly: 'B',
            date: '2021-3-5',
            state: '1',
            stick: '0'
        },
        {
            key: '3',
            url:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1091405991,859863778&fm=26&gp=0.jpg',
            title: 'Jim Green',
            classfly: 'A',
            date: '2021-3-5',
            state: '1',
            stick: '1'
        },
        {
            key: '4',
            url:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1601825257,855529558&fm=11&gp=0.jpg',
            title: 'Jim Red',
            classfly: 'C',
            date: '2021-3-5',
            state: '0',
            stick: '1'
        },
    ];
    export default {
        name: 'ProductList',
        data() {
            return {
                columns,
                data,
                loading: false,
                visible: false,
                modalTitle:'',
                tagTip:'',
            }
        },
        filters: {
            tagTipColor:function(val){
                let color
                switch(val){
                    case '0':
                    color="#f50"
                    break;
                    case '1':
                    color="#2db7f5"
                    break;
                    default:
                    color="#87d068"
                }
                return color
            },
            tagTipTitle:function(val){
                let title
                switch(val){
                    case '0':
                    title="仓库内"
                    break;
                    case '1':
                    title="橱窗中"
                    break;
                    default:
                    title="正在创建"
                }
                return title
            }
        },
        methods: {
            refreshData() {
                this.loading = true
                setTimeout(() => {
                    this.loading = false
                }, 1000)
            },
            onEitor(params) {
                this.visible = true
                this.modalTitle=params.title
                this.tagTip=params.state
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