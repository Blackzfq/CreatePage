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
                <a-button type="primary" @click="()=>{visible=true;modalTitle='新建分类'}">
                    添加分类
                </a-button>
            </a-col>
        </a-row>
        <a-divider />
        <ListTable :columns="columns" :data="data" @eitor="onEitor" />
        <!-- 弹窗 -->
        <a-modal v-model="visible" :footer="null" :getContainer="()=>$refs.ProductClassify" width="1200px" :bodyStyle="{height:'700px',overflow:'auto'}" centered>
            <span slot="title">
                {{modalTitle}}
                <a-tag color="#2db7f5">
                    {{modalTitle|tagTipTitle}}
                </a-tag>
            </span>
            <SortForm />
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
    const data = [
        {
            key: '1',
            url: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1091405991,859863778&fm=26&gp=0.jpg',
            title: 'John Brown',
            date: '2021-3-5',
            stick: '0',
            children: [
                {
                    key: '1-1',
                    url: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1091405991,859863778&fm=26&gp=0.jpg',
                    title: 'John Brown',
                    date: '2021-3-5',
                    stick: '1',
                },
                {
                    key: '1-2',
                    url: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1091405991,859863778&fm=26&gp=0.jpg',
                    title: 'John Brown',
                    date: '2021-3-5',
                    stick: '0',
                    children: [
                        {
                            key: '1-1-1',
                            url: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1091405991,859863778&fm=26&gp=0.jpg',
                            title: 'John Brown',
                            date: '2021-3-5',
                            stick: '1',
                        }
                    ]
                }
            ]
        },
        {
            key: '2',
            url: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1625564583,4245123740&fm=26&gp=0.jpg',
            title: 'Jim Green',
            date: '2021-3-5',
            stick: '1'
        }
    ];
    export default {
        name: 'ProductClassify',
        data() {
            return {
                columns,
                data,
                loading: false,
                visible: false,
                modalTitle: '',
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
        methods: {
            refreshData() {
                this.loading = true
                setTimeout(() => {
                    this.loading = false
                }, 1000)
            },
            onEitor(params) {
                this.visible = true
                this.modalTitle = params.title
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
    }
</style>