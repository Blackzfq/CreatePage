<template>
    <div class="ProductList" ref="ProductList">
        <a-row type="flex" justify="space-between">
            <a-col :span="12">
                <span style="font-size: 16px;">商品列表查询</span>
                <a-icon type="reload" :spin="loading" style="margin-left: 15px;" @click="refreshData(pagination)" />
            </a-col>
            <a-col :span="12" style="text-align: end;">
                <span class="myTextButton">导入</span>
                <span class="myTextButton" @click="downloadExcel">导出</span>
                <a-button type="primary" @click="onAddProduct">
                    添加商品
                </a-button>
            </a-col>
        </a-row>
        <a-divider />
        <ListTable ref="listTable" :columns="columns" :data="data" :pagination="pagination" @eitor="onEitor"
            @fetch="refreshData" @clone="onClone" @batch="batchManage" @remove="onRemove" />
        <!-- 弹窗 -->
        <a-modal :visible="visible" :footer="null" :bodyStyle="{padding:'0'}" :getContainer="()=>$refs.ProductList"
            width="1200px" @cancel="onCancel" centered forceRender>
            <span slot="title">
                {{modalTitle}}
                <a-tag :color="tagTip|tagTipColor">
                    {{tagTip|tagTipTitle}}
                </a-tag>
            </span>
            <a-spin :tip="formTip" :spinning="spinning">
                <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
                <div class="loading" style="height:700px;overflow:auto;padding:25px;">
                    <ProductForm ref="productForm" :isAdd="isAdd" @onClose="changeVisible"
                        @change="refreshData(pagination)" />
                </div>
            </a-spin>
        </a-modal>
    </div>
</template>
<script>
    import { getCommodity, deleteCommodity, copyCommodity, batchCommodity } from '@/assets/api'
    const pagination = {
        position: 'bottom',
        name: '',//查找的对象
        isShow: '',// 0|1 未发布|已发布
        commodityTypeIds: [],//按商品分类查找
        time: '',// 0|1|2|3|4  创建时间倒叙|创建时间顺序|编辑时间倒叙|编辑时间顺序
        pageSize: 10,//每页的条数
        current: 1,//当前页
        total: 0//总页数
    };
    const data = [];
    export default {
        name: 'ProductList',
        data() {
            return {
                pagination,
                data,
                loading: false,
                visible: false,
                isAdd: true,
                modalTitle: '',

                //加载遮罩 spin
                spinning: false,
                tagTip: '',
                formTip: '数据加载中，请稍后',
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
        computed: {
            columns() {
                let { name, isShow, commodityTypeIds, time } = this.pagination
                const _this = this
                name = name.length !== 0 ? [name] : null
                isShow = isShow === 0 || isShow === 1 ? [isShow] : null
                commodityTypeIds = commodityTypeIds.length !== 0 ? commodityTypeIds : null
                time = time === 0 || time === 1 || time === 2 || time === 3 ? [time] : null
                const columns = [
                    {
                        title: '名称',
                        dataIndex: 'title',
                        width: '20%',
                        scopedSlots: {
                            customRender: 'name',
                            filterDropdown: 'filterNameDropdown',
                            filterIcon: 'searchIcon',
                        },
                        filteredValue: name || null,
                        onFilterDropdownVisibleChange: (visible) => {
                            if (!visible) {
                                _this.pagination.current = 1
                                _this.refreshData(_this.pagination)
                            }
                        }
                    },
                    {
                        title: '分类',
                        dataIndex: 'classfly',
                        scopedSlots: {
                            customRender: 'classfly',
                            filterDropdown: 'filterSortDropdown',
                            filterIcon: 'filtereIcon',
                        },
                        filteredValue: commodityTypeIds || null,
                        onFilterDropdownVisibleChange: (visible) => {
                            if (!visible) {
                                _this.pagination.current = 1
                                _this.refreshData(_this.pagination)
                            }
                        }
                    },
                    {
                        title: '时间',
                        dataIndex: 'date',
                        scopedSlots: {
                            filterDropdown: 'filterDateDropdown',
                            filterIcon: 'filtereIcon',
                        },
                        filteredValue: time || null,
                        onFilterDropdownVisibleChange: (visible) => {
                            if (!visible) {
                                _this.pagination.current = 1
                                _this.refreshData(_this.pagination)
                            }
                        }
                    },
                    {
                        title: '状态',
                        dataIndex: 'state',
                        scopedSlots: {
                            customRender: 'state',
                            filterDropdown: 'filterStateDropdown',
                            filterIcon: 'filtereIcon',
                        },
                        filteredValue: isShow || null,
                        onFilterDropdownVisibleChange: (visible) => {
                            if (!visible) {
                                _this.pagination.current = 1
                                _this.refreshData(_this.pagination)
                            }
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
                return columns;
            }
        },
        mounted() {
            this.getGoods()
        },
        methods: {
            //关闭Modal的回调
            onCancel(e) {
                // console.log('关闭的回调')
                // this.$refs.productForm.saveForm()
                const _this = this
                const oldSeveData = localStorage.getItem('BWPRODUCT_ADD')
                const newSeveData = this.$refs.productForm.saveForm()
                if (this.isAdd && !oldSeveData) {
                    localStorage.setItem('BWPRODUCT_ADD', JSON.stringify(newSeveData))
                    this.$notification.success({
                        message: `温馨提示`,
                        description:
                            `已为您自动存储当前新增的表单内容`,
                        placement: 'bottomRight',
                    });
                    _this.visible = false
                } else if (this.isAdd && oldSeveData !== JSON.stringify(newSeveData)) {
                    this.$confirm({
                        title: '正在关闭新建商品',
                        content: h => <div style="color:red;">检测到您有部分数据更新，是否为您进行离线存储？</div>,
                        okText: '离线保存',
                        onOk() {
                            localStorage.setItem('BWPRODUCT_ADD', JSON.stringify(newSeveData))
                            _this.visible = false
                        },
                        cancelText: '不了,谢谢！',
                        onCancel() {
                            _this.visible = false
                        }
                    })
                } else if (!this.isAdd) {
                    this.$confirm({
                        title: `正在退出商品名为 ${_this.modalTitle} 的列表编辑 `,
                        content: h => <div style="color:red;">退出编辑后将无法保存您所做的更改</div>,
                        okText: '继续离开',
                        onOk() {
                            _this.visible = false
                        },
                        cancelText: '返回编辑',
                        onCancel() {
                            return
                        }
                    })
                } else {
                    _this.visible = false
                }
            },
            //重置当前列表
            refreshData(params) {
                this.loading = true
                this.getGoods(params)
            },
            // 新增商品
            onAddProduct() {
                const _this = this
                const oldSeveData = localStorage.getItem('BWPRODUCT_ADD')
                if (oldSeveData) {
                    this.$confirm({
                        title: `检测到您有未编辑完毕的内容`,
                        content: h => <div style="color:red;">是否继续上一次未完成的编辑？</div>,
                        okText: '继续未完成的编辑',
                        onOk() {
                            _this.modalTitle = '新建商品';
                            _this.tagTip = '未完成的编辑'
                            _this.isAdd = true
                            _this.visible = true;
                            _this.$refs.productForm.restform(JSON.parse(oldSeveData))
                        },
                        cancelText: '放弃并开始新内容',
                        onCancel() {
                            localStorage.removeItem('BWPRODUCT_ADD')
                            localStorage.removeItem('BWPRODUCT_ADD_FILE')
                            _this.$refs.productForm.restform()
                            _this.modalTitle = '新建商品';
                            _this.tagTip = ''
                            _this.isAdd = true
                            _this.visible = true;
                        }
                    })
                } else {
                    _this.visible = true;
                    _this.modalTitle = '新建商品';
                    _this.tagTip = ''
                    _this.isAdd = true
                    _this.$refs.productForm.restform()
                }
                this.$refs.productForm.clearValidate()

            },
            //进入编辑
            onEitor(params) {
                this.isAdd = false
                this.modalTitle = params.title
                this.tagTip = params.state
                this.visible = true
                this.$refs.productForm.editorForm(params.root)
                this.$refs.productForm.clearValidate()
            },
            //删除数据
            onRemove(params) {
                if (!Array.isArray(params)) {//单个删除
                    const data = { ids: [params.key] }
                    deleteCommodity(data)
                        .then(() => {
                            this.$notification.open({
                                message: `成功通知`,
                                description:
                                    `商品${params.title}已经成功删除`,
                                placement: 'bottomRight',
                            });
                            this.refreshData(this.pagination)
                        })
                        .catch(() => {
                            this.$notification.open({
                                message: `失败通知`,
                                description:
                                    `商品删除出现错误,请稍后重试`,
                                placement: 'bottomRight',
                            });
                        })
                        .finally(
                            () => {
                                this.loading = false
                                this.$refs.listTable.changeLoading(false)
                            }
                        )
                } else {//批量删除
                    const data = { ids: params }
                    deleteCommodity(data)
                        .then(() => {
                            this.$notification.open({
                                message: `成功通知`,
                                description:
                                    `所选商品已全部删除`,
                                placement: 'bottomRight',
                            });
                            this.$refs.listTable.onSelectChange(new Array())
                            this.refreshData(this.pagination)
                        })
                        .catch(() => {
                            this.$notification.open({
                                message: `失败通知`,
                                description:
                                    `商品删除出现错误,请稍后重试`,
                                placement: 'bottomRight',
                            });
                        })
                        .finally(
                            () => {
                                this.loading = false
                                this.$refs.listTable.changeLoading(false)

                            }
                        )
                }
            },
            // 克隆商品
            onClone(params) {
                copyCommodity(params.key)
                    .then(() => {
                        this.$notification.open({
                            message: `成功通知`,
                            description:
                                `商品拷贝成功，已为您添加到数据库`,
                            placement: 'bottomRight',
                        });
                        this.refreshData(this.pagination)
                    })
                    .catch(() => {
                        this.$notification.open({
                            message: `失败通知`,
                            description:
                                `商品复制失败，请稍后再试`,
                            placement: 'bottomRight',
                        });
                    })
                    .finally(() => {
                        this.loading = false
                        this.$refs.listTable.changeLoading(false)
                    })
            },
            // 批量处理 上架|下架|置顶
            batchManage(name, params, val) {
                const data = {
                    ids: params
                }
                switch (name) {
                    case 'isShow':
                        data.isShow = val
                        break;
                    case 'attrSort':
                        data.attrSort = val
                        break;
                }
                batchCommodity(data)
                    .then(() => {
                        this.$notification.open({
                            message: `成功通知`,
                            description:
                                `商品批量处理完成`,
                            placement: 'bottomRight',
                        });
                        this.refreshData(this.pagination)
                    })
                    .catch(() => {
                        this.$notification.open({
                            message: `失败通知`,
                            description:
                                `商品批量处理失败，请稍后再试`,
                            placement: 'bottomRight',
                        });
                    })
                    .finally(() => {
                        this.loading = false
                        this.$refs.listTable.changeLoading(false)
                    })
            },
            //拉取列表数据
            getGoods(params) {
                this.pagination = params ? params : {
                    position: 'bottom',
                    name: '',
                    isShow: '',
                    commodityTypeIds: [],
                    time: '',
                    pageSize: 10,
                    current: 1,
                    total: 0
                }
                const filterPagination = function (pageData) {
                    const newPageData = Object.assign({}, pageData)
                    for (let key in newPageData) {
                        if (newPageData[key] == null || newPageData[key] === '' || newPageData[key].length === 0) delete newPageData[key]
                    }
                    newPageData.page = newPageData.current
                    newPageData.per_page = newPageData.pageSize
                    delete newPageData.total
                    delete newPageData.position
                    delete newPageData.current
                    delete newPageData.pageSize
                    return newPageData
                }

                this.$refs.listTable.changeLoading(true)
                getCommodity(filterPagination(this.pagination))
                    .then(({ data: { data: goodsData, meta: { pagination: goodPagination } } }) => {
                        if (goodsData.length === 0 && goodPagination.current_page > 1 && goodPagination.total_pages > 1) {
                            let { current } = this.pagination
                            const page = { ...this.pagination }
                            page.current = current - 1
                            this.getGoods(page)
                        } else {
                            this.data = this.formattingData(goodsData)
                            this.pagination.total = goodPagination.total_pages * 10
                        }
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
                        classfly: item.commodity_types.map(type => {
                            const commodityType = {
                                key: type.id,
                                title: type.name
                            }
                            return Object.assign({}, commodityType)
                        }),
                        date: item.created_at,
                        stick: item.attrSort ? '1' : '0',
                        state: item.isShow ? '1' : '0',
                        root: item
                    }
                    return Object.assign({}, sourceItem)
                })
                return newArr
            },
            /*********************************************************供子组件调用*********************************************************/
            changeVisible(val) {
                this.visible = val
            },
            /*********************************************************表格的导出*********************************************************/
            downloadExcel() {
                /*表格内的数据*/
                let _data = [
                    ['是否置顶', '创建时间', '商品ID', '商品状态', '商品主图', '商品标题', '商品详情', 'SEO标题', 'SEO描述', 'SEO地址', '最近一次编辑']
                ];

                const _ListData = [...this.data].map(option => option.root)

                _ListData.forEach(item => {
                    const _Child_List_Data_ = new Array()
                    let { attrSort, created_at, id, isShow, main_img_url, name, product_description, seo_title, seo_description, seo_url, updated_at } = item
                    attrSort=attrSort?'置顶':'默认'
                    isShow=isShow?'橱窗中':'仓库中'
                    product_description=product_description.replace(/(\n)/g, "").replace(/(\t)/g, "").replace(/(\r)/g, "").replace(/<\/?[^>]*>/g, "").replace(/[&nbsp;]{2,}/g, " ")
                    _Child_List_Data_.push(attrSort,created_at,id,isShow,main_img_url,name,product_description,seo_title,seo_description,seo_url,updated_at)
                    _data.push(_Child_List_Data_)
                })

                const ws = this.XLSX.utils.aoa_to_sheet(_data);

                /*设置表格样式,!cols为列宽*/
                // const options = {
                //     '!cols': [
                //         { wpx: 200 },
                //         { wpx: 200 },
                //         { wpx: 200 },
                //         { wpx: 200 },
                //         { wpx: 200 },
                //         { wpx: 200 },
                //         { wpx: 200 },
                //         { wpx: 200 },
                //         { wpx: 200 },
                //         { wpx: 600 },
                //     ]
                // };

                // ws['!cols'] = options['!cols'];

                /* 生成工作簿并添加工作表 */
                const wb = this.XLSX.utils.book_new();
                this.XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

                /* 保存文件 */
                this.XLSX.writeFile(wb, '商品明细单.xlsx');
            },
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

        &::v-deep .ant-spin-nested-loading>div>.ant-spin {
            max-height: 700px;
        }
    }
</style>