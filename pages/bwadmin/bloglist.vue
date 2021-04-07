<template>
    <div id="BlogList" ref="BlogList">
        <a-row type="flex" justify="space-between">
            <a-col :span="12">
                <span style="font-size: 16px;">博客列表查询</span>
                <a-icon type="reload" :spin="loading" style="margin-left: 15px;" @click="refreshData(pagination)" />
            </a-col>
            <a-col :span="12" style="text-align: end;">
                <span class="myTextButton">导入</span>
                <span class="myTextButton">导出</span>
                <a-button type="primary" @click="addBlog">
                    新增博客
                </a-button>
            </a-col>
        </a-row>
        <a-divider />
        <ListTable ref="listTable" :columns="columns" :data="data" :pagination="pagination" @eitor="onEitor"
            @fetch="refreshData" @clone="onClone" @batch="batchManage" @remove="onRemove" />
        <!-- 弹窗 -->
        <a-modal v-model="visible" :footer="null" :getContainer="() => $refs.BlogList" width="1200px"
            :bodyStyle="{ height: '700px', overflow: 'auto' }" centered destroyOnClose>
            <span slot="title">
                {{ modalTitle }}
                <a-tag :color="tagTip | tagTipColor">
                    {{ tagTip | tagTipTitle }}
                </a-tag>
            </span>
            <BlogForm :redactKey="redactKey" @onpercent="val => {percent = val;}"
                @changeLoading="val => {upLoading = val;}" @close="close" />
        </a-modal>
    </div>
</template>
<script>
    import { getBlogList, delBlog } from "@/assets/api";
    const pagination = {
        position: 'bottom',
        title: '',//查找的对象
        isShow: '',// 0|1 未发布|已发布
        blogTypeIds: [],//按商品分类查找
        time: '',// 0|1|2|3|4  创建时间倒叙|创建时间顺序|编辑时间倒叙|编辑时间顺序
        pageSize: 10,//每页的条数
        current: 1,//当前页
        total: 0//总页数
    };
    const data = [];
    export default {
        name: "ProductList",
        data() {
            return {
                pagination,
                data,
                loading: false,
                visible: false,
                modalTitle: "",
                tagTip: "",
                redactKey: ""
            };
        },
        filters: {
            tagTipColor: function (val) {
                let color;
                switch (val) {
                    case "0":
                        color = "#f50";
                        break;
                    case "1":
                        color = "#2db7f5";
                        break;
                    default:
                        color = "#87d068";
                }
                return color;
            },
            tagTipTitle: function (val) {
                let title;
                switch (val) {
                    case "0":
                        title = "仓库内";
                        break;
                    case "1":
                        title = "橱窗中";
                        break;
                    default:
                        title = "正在创建";
                }
                return title;
            }
        },
        computed: {
            columns() {
                let { title, isShow, blogTypeIds, time } = this.pagination
                const _this = this
                title = title.length !== 0 ? [title] : null
                isShow = isShow === 0 || isShow === 1 ? [isShow] : null
                blogTypeIds = blogTypeIds.length !== 0 ? blogTypeIds : null
                time = time === 0 || time === 1 || time === 2 || time === 3 ? [time] : null
                const columns = [
                    {
                        title: "名称",
                        dataIndex: "title",
                        width: "20%",
                        scopedSlots: {
                            customRender: "name",
                            filterDropdown: "filterNameDropdown",
                            filterIcon: "searchIcon"
                        },
                        filteredValue: title || null,
                        onFilterDropdownVisibleChange: (visible) => {
                            if (!visible) {
                                _this.pagination.current = 1
                                _this.refreshData(_this.pagination)
                            }
                        }
                    },
                    {
                        title: "分类",
                        dataIndex: "classfly",
                        scopedSlots: {
                            customRender: "classfly",
                            filterDropdown: "filterSortDropdown",
                            filterIcon: "filtereIcon"
                        },
                        filteredValue: blogTypeIds || null,
                        onFilterDropdownVisibleChange: (visible) => {
                            if (!visible) {
                                _this.pagination.current = 1
                                _this.refreshData(_this.pagination)
                            }
                        }
                    },
                    {
                        title: "时间",
                        dataIndex: "date",
                        scopedSlots: {
                            filterDropdown: "filterDateDropdown",
                            filterIcon: "filtereIcon"
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
                        title: "状态",
                        dataIndex: "state",
                        scopedSlots: {
                            customRender: "state",
                            filterDropdown: "filterStateDropdown",
                            filterIcon: "filtereIcon"
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
                        title: "置顶",
                        dataIndex: "stick",
                        scopedSlots: { customRender: "stick" }
                    },
                    {
                        title: "功能区",
                        dataIndex: "action",
                        scopedSlots: { customRender: "action" }
                    }
                ];
                return columns
            }
        },
        mounted() {
            this.getGoods();
        },
        methods: {
            // *重置当前列表
            refreshData(params) {
                this.loading = true;
                this.getGoods(params);
            },
            // *操作区 => 删除
            onEitor(row) {
                this.redactKey = row.key;
                this.visible = true;
                this.modalTitle = row.title;
                this.tagTip = row.state;
            },
            // // *操作区 => 删除
            // onDelete(row) {
            //     // 单选
            //     if (row.key) {
            //         let that = this;
            //         this.$confirm({
            //             title: "确定删除?",
            //             okText: "确定",
            //             okType: "danger",
            //             cancelText: "取消",
            //             onOk() {
            //                 let ids = [];
            //                 ids.push(row.key);
            //                 delBlog({ params: { ids: ids } })
            //                     .then(() => {
            //                         that.$notification.open({
            //                             message: `成功提醒`,
            //                             description: `博客 ${row.title} 删除成功`,
            //                             placement: "topRight",
            //                             duration: 1000,
            //                             icon: <a-icon type="rocket" style="color: #108ee9" />
            //                         });
            //                         that.refreshData();
            //                     })
            //                     .catch(() => {
            //                         that.$notification.open({
            //                             message: `失败提醒`,
            //                             description: `博客 ${row.title} 删除失败`,
            //                             placement: "bottomRight",
            //                             icon: <a-icon type="bug" style="color: #eb2f96" />
            //                         });
            //                     });
            //             },
            //             onCancel() {
            //                 console.log("Cancel");
            //             }
            //         });
            //     } else {
            //     }
            // },
            // // *监听多选
            // handleSelectd(val) {
            //     console.log(val);
            // },
            //删除数据
            onRemove(params) {
                if (!Array.isArray(params)) {//单个删除
                    const data = { ids: [params.key] }
                    delBlog(data)
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
                    delBlog(data)
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
            // 批量处理 上架|下架|置顶
            batchManage(name, params, val) {
                this.$message.error('暂无该功能')
                // const data = {
                //     ids: params
                // }
                // switch (name) {
                //     case 'isShow':
                //         data.isShow = val
                //         break;
                //     case 'attrSort':
                //         data.attrSort = val
                //         break;
                // }
                // batchCommodity(data)
                //     .then(() => {
                //         this.$notification.open({
                //             message: `成功通知`,
                //             description:
                //                 `商品批量处理完成`,
                //             placement: 'bottomRight',
                //         });
                //         this.refreshData(this.pagination)
                //     })
                //     .catch(() => {
                //         this.$notification.open({
                //             message: `失败通知`,
                //             description:
                //                 `商品批量处理失败，请稍后再试`,
                //             placement: 'bottomRight',
                //         });
                //     })
                //     .finally(() => {
                //         this.loading = false
                //         this.$refs.listTable.changeLoading(false)
                //     })
            },
            // 克隆商品
            onClone(params) {
                this.$message.error('暂不支持该功能')
                // copyCommodity(params.key)
                //     .then(() => {
                //         this.$notification.open({
                //             message: `成功通知`,
                //             description:
                //                 `商品拷贝成功，已为您添加到数据库`,
                //             placement: 'bottomRight',
                //         });
                //         this.refreshData(this.pagination)
                //     })
                //     .catch(() => {
                //         this.$notification.open({
                //             message: `失败通知`,
                //             description:
                //                 `商品复制失败，请稍后再试`,
                //             placement: 'bottomRight',
                //         });
                //     })
                //     .finally(() => {
                //         this.loading = false
                //         this.$refs.listTable.changeLoading(false)
                //     })
            },
            //拉取列表数据
            getGoods(params) {
                this.pagination = params ? params : {
                    position: 'bottom',
                    title: '',
                    isShow: '',
                    blogTypeIds: [],
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
                getBlogList(filterPagination(this.pagination))
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
                        title: item.title,
                        classfly: item.blog_types.map(o => {
                            const commodityType = {
                                key: o.id,
                                title: o.name
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
            //新增博客
            addBlog() {
                this.redactKey = "";
                this.visible = true;
                this.modalTitle = "新建商品";
                this.tagTip = "";
            },
            close() {
                this.visible = false;
                this.refreshData();
            }
        }
    };
</script>
<style scoped lang="scss">
    #BlogList {
        background-color: #fff;
        padding: 24px;
        // min-width: 1100px;

        .myTextButton {
            padding-right: 40px;
            cursor: pointer;
            transition: all 0.3s;

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