<template>
    <div class="ProductForm">
        <a-form-model ref="productRuleForm" layout="vertical" :model="form" :rules="rules" class="aformmodel">
            <div class="left_form">
                <a-form-model-item prop="name">
                    <span slot="label">
                        标题
                        <a-tooltip title="填写商品的标题" placement="right" style="color: orange;">
                            <a-icon type="question-circle-o" />
                        </a-tooltip>
                    </span>
                    <a-input v-model="form.name" placeholder="短袖T恤" />
                </a-form-model-item>
                <a-form-model-item>
                    <span slot="label">
                        简介
                        <a-tooltip title="用以描述商品的用途和介绍，最多填写5栏，每栏限制200个字符" placement="right" style="color: orange;">
                            <a-icon type="question-circle-o" />
                        </a-tooltip>
                    </span>
                    <a-input v-model="form.synopsis[0].content" placeholder="可选：型号，参数，特色，卖点" />
                    <a-input v-model="form.synopsis[1].content" style="margin-top: 15px;" />
                    <a-input v-model="form.synopsis[2].content" style="margin-top: 15px;" />
                    <a-input v-model="form.synopsis[3].content" style="margin-top: 15px;" />
                    <a-input v-model="form.synopsis[4].content" style="margin-top: 15px;" />
                </a-form-model-item>
                <a-form-model-item prop="product_description">
                    <span slot="label">
                        描述
                        <a-tooltip title="商品的详情内容描述，可插入图片、视频、文本等内容，提供在线自定义编辑,内容限制2000个字符以内" placement="right"
                            style="color: orange;">
                            <a-icon type="question-circle-o" />
                        </a-tooltip>
                    </span>
                    <TinyEditor ref='editor' @getTinyValue="(val)=>form.product_description=val" />
                </a-form-model-item>
                <a-form-model-item prop="file_ids">
                    <a-row slot="label">
                        <a-col :span="12">
                            媒体中心
                            <a-tooltip title="用以商品的主图设置。每个商品可以绑定一个视频链接和5张商品主图" placement="right" style="color: orange;">
                                <a-icon type="question-circle-o" />
                            </a-tooltip>
                        </a-col>
                        <a-col :span="12" style="text-align: right;">
                            <a-dropdown>
                                <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                                    从URL添加媒体
                                    <a-icon type="caret-down" />
                                </a>
                                <a-menu slot="overlay">
                                    <a-menu-item>
                                        <a href="javascript:;">从URL添加图片</a>
                                    </a-menu-item>
                                    <a-menu-item>
                                        <a href="javascript:;">嵌入YouTube视频</a>
                                    </a-menu-item>
                                </a-menu>
                            </a-dropdown>
                        </a-col>
                    </a-row>
                    <CommodityImageAndMove ref="mce" @change="onMidoChange" />
                </a-form-model-item>
                <a-form-model-item>
                    <span slot="label">
                        多属性
                        <a-tooltip title="为商品提供多种属性设置,例如型号大小S/M/L/XL,或者颜色样式 红/蓝/黄，等规格分类.若商品无多属性请勿勾选" placement="right"
                            style="color: orange;">
                            <a-icon type="question-circle-o" />
                        </a-tooltip>
                    </span>
                    <MoreAttribute ref="moreAttribute" @change="onArrtChange" />
                </a-form-model-item>
                <p>搜索引擎优化</p>
                <a-divider />
                <a-form-model-item>
                    <span slot="label">
                        页面标题
                        <a-tooltip title="设置商品页面上浏览器标签的标题" placement="right" style="color: orange;">
                            <a-icon type="question-circle-o" />
                        </a-tooltip>
                    </span>
                    <a-input v-model="form.seo_title" placeholder="页面的标题 使用的字符长度不超过70" />
                </a-form-model-item>
                <a-form-model-item>
                    <span slot="label">
                        描述
                        <a-tooltip title="设置商品页面上浏览器标签的描述" placement="right" style="color: orange;">
                            <a-icon type="question-circle-o" />
                        </a-tooltip>
                    </span>
                    <a-textarea v-model="form.seo_description" placeholder="页面的描述 使用的字符长度不超过320"
                        :auto-size="{ minRows: 5, maxRows: 10 }" />
                </a-form-model-item>
                <a-form-model-item>
                    <span slot="label">
                        内部链接优化
                        <a-tooltip title="设置商品页面的访问地址链接" placement="right" style="color: orange;">
                            <a-icon type="question-circle-o" />
                        </a-tooltip>
                    </span>
                    <a-input v-model="form.seo_url" placeholder="自定义链接" />
                </a-form-model-item>
                <a-form-model-item :wrapper-col="{span:12,offset:12}">
                    <a-button-group v-if="isAdd">
                        <a-button type="primary" @click="onSubmit">
                            创建
                        </a-button>
                        <a-button>
                            重置
                        </a-button>
                    </a-button-group>
                    <a-button-group v-else>
                        <a-button type="primary" @click="onEitor">
                            编辑
                        </a-button>
                    </a-button-group>
                </a-form-model-item>
            </div>
            <div class="right_form">
                <div class="right_form_content">
                    <a-form-model-item>
                        <span slot="label">
                            产品状态
                            <a-tooltip title="设置商品是否发布到客户端" placement="right" style="color: orange;">
                                <a-icon type="question-circle-o" />
                            </a-tooltip>
                        </span>
                        <a-select :default-value="form.isShow" v-model="form.isShow">
                            <a-select-option v-for="item in isShowOption" :key="item.value" :value="item.value">
                                {{item.label}}
                            </a-select-option>
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item prop="commodity_type_ids">
                        <span slot="label">
                            产品分类 (多选)
                            <a-tooltip title="设置商品的归属,若无商品归属则商品无法在客户端查阅" placement="right" style="color: orange;">
                                <a-icon type="question-circle-o" />
                            </a-tooltip>
                        </span>
                        <SortTree ref="sortTree" @onCheck="ids=>form.commodity_type_ids=ids" />
                    </a-form-model-item>
                    <a-form-model-item>
                        <span slot="label">
                            置顶
                            <a-tooltip title="设置商品在分类中的排序" placement="right" style="color: orange;">
                                <a-icon type="question-circle-o" />
                            </a-tooltip>
                        </span>
                        <a-switch checked-children="置顶" un-checked-children="默认" :checked="computerSort"
                            @change="(checked)=>form.attrSort=checked?1:0" />
                    </a-form-model-item>
                    <a-form-model-item prop="tag_ids">
                        <span slot="label">
                            标签
                            <a-tooltip title="设置商品的标签，用以搜索引擎的抓取" placement="right" style="color: orange;">
                                <a-icon type="question-circle-o" />
                            </a-tooltip>
                        </span>
                        <TagsSelect ref="tagsSelect" @change="onTagsChange" />
                    </a-form-model-item>


                    <!-- 2021/4/2 隐藏模板样式 -->
                    <!-- <a-form-model-item>
                        <span slot="label">
                            模板样式
                            <a-tooltip title="设置商品详情页的展示方式" placement="right" style="color: orange;">
                                <a-icon type="question-circle-o" />
                            </a-tooltip>
                        </span>
                        <TemplateSelect />
                    </a-form-model-item> -->
                </div>
            </div>
        </a-form-model>
    </div>
</template>
<script>
    import { addNewCommodity, upDataCommodity } from '@/assets/api'
    const form = {
        name: '',//商品名称 string  *
        synopsis: [{ content: '' }, { content: '' }, { content: '' }, { content: '' }, { content: '' }],//商品简介 json
        product_description: '',//商品描述 string  *
        file_ids: [],//商品列表图 array  *
        main_img_url: null,//商品主图 暂无 file
        attribute: null,//商品属性 json
        isShow: 1,//1橱窗：0仓库  默认橱窗  *
        commodity_type_ids: [],//商品分类 array  *
        attrSort: 0,// 1置顶：0常规  默认常规  *
        tag_ids: [],// 商品标签 array  *

        seo_title: '',//网页标题 string
        seo_description: '',//网页描述 string
        seo_url: '',//自定义url string
    }

    const loadingForm = {}

    const checkFileIds = (rule, value, callback) => {
        if (value.length === 0) {
            callback(new Error('请选择至少一张商品主图或者视频'));
        } else {
            callback();
        }
    }
    const checkSortIds = (rule, value, callback) => {
        if (value.length === 0) {
            callback(new Error('请至少勾选一项商品分类'));
        } else {
            callback();
        }
    }
    const checkTagIds = (rule, value, callback) => {
        if (value.length === 0) {
            callback(new Error('请选择至少一项商品标签'));
        } else {
            callback();
        }
    }
    const rules = {
        name: [
            { required: true, whitespace: true, message: '请填写必要的商品名称', trigger: 'blur' },
            { min: 3, max: 60, message: '标题字符限制为3-60个字节，符号为1个字节，汉字为2个字节', trigger: 'change' }
        ],
        product_description: [
            { required: true, whitespace: true, message: '请填写必要的商品描述信息', trigger: 'blur' },
            { min: 3, max: 30000, message: '标题字符限制为3-30000个字节，符号为1个字节，汉字为2个字节', trigger: 'change' }
        ],
        file_ids: [{ validator: checkFileIds, trigger: 'blur' }],
        commodity_type_ids: [{ validator: checkSortIds, trigger: 'blur' }],
        tag_ids: [{ validator: checkTagIds, trigger: 'blur' }]


    }

    const isShowOption = [
        {
            label: '橱窗',
            value: 1
        },
        {
            label: '仓库',
            value: 0
        }
    ]
    export default {
        name: 'ProductForm',
        props: {
            isAdd: {//判断场景    创建||编辑  true||false
                type: Boolean,
                default: true
            }
        },
        data() {

            return {
                form,
                loadingForm,//编辑模式下的对照组
                rules,
                isShowOption,
                ask: false,
                key: null,
                saveCreateImageList:null,//保存未上传的图库
            }
        },
        computed: {
            computerSort: function () {
                return this.form.attrSort ? true : false
            }
        },
        methods: {
            onMidoChange(fileList) {
                this.form.file_ids = fileList.map(item => item.uid)
                localStorage.setItem('BWPRODUCT_ADD_FILE', JSON.stringify(fileList))
            },
            onArrtChange(val) {
                this.form.attribute = val
            },
            onTagsChange(tagList) {
                this.form.tag_ids = tagList.map(item => item.key)
            },
            //验证表单
            onSubmit() {
                this.$refs.productRuleForm.validate(valid => {
                    if (valid) {
                        let filterForm
                        let _this = this
                        filterForm = this.onFilterString(this.form)
                        filterForm = this.onFilterArr(filterForm)
                        if (this.ask) {
                            this.$confirm({
                                title: '警告',
                                content: '检测到商品属性有部分项键值对未填写，继续上传将忽略未填写完整的键值对，是否继续？',
                                okText: '继续上传',
                                cancelText: '返回补全',
                                onOk() {
                                    _this.onUpLoading(filterForm)
                                },
                                onCancel() {
                                    _this.ask = false
                                    return
                                },
                            })
                        } else {
                            this.onUpLoading(filterForm)
                        }
                    } else {
                        this.$message.error('上传验证失败，请核对提示信息并作出修改')
                        return false;
                    }
                });
            },
            //验证编辑
            onEitor() {
                const loadingForm = this.form
                const originalForm = this.loadingForm
                this.$refs.productRuleForm.validate(valid => {
                    if (valid && JSON.stringify(originalForm) !== JSON.stringify(loadingForm)) {
                        let _this = this
                        let filterForm = loadingForm
                        filterForm = this.onFilterArr(filterForm)
                        filterForm = this.onFilterNull(filterForm)
                        if (this.ask) {
                            this.$confirm({
                                title: '警告',
                                content: '检测到商品属性有部分项键值对未填写，继续上传将忽略未填写完整的键值对，是否继续？',
                                okText: '继续上传',
                                cancelText: '返回补全',
                                onOk() {
                                    _this.onUpLoadingEdior(filterForm)
                                },
                                onCancel() {
                                    _this.ask = false
                                    return
                                },
                            })
                        } else {
                            this.onUpLoadingEdior(filterForm)
                        }
                    } else if (valid && JSON.stringify(originalForm) === JSON.stringify(loadingForm)) {
                        this.$message.error('未检测到任何信息变动，系统无法做出响应')
                        console.log(loadingForm)
                        console.log(originalForm)
                    } else {
                        this.$message.error('上传验证失败，请核对提示信息并作出修改')
                        return false;
                    }
                })
            },
            //上传创建数据
            onUpLoading(filterForm) {
                const data = this.appendFormData(filterForm)
                addNewCommodity(data)
                    .then(res => {
                        this.$notification.success({
                            message: `成功提醒`,
                            description: 
                                `商品上传成功`,
                            placement: 'bottomRight',
                        });
                        this.$emit('onClose', false)
                        this.$emit('change')
                    })
                    .catch(err => {
                        this.$notification.error({
                            message: `失败提醒`,
                            description:
                                `商品上传失败`,
                            placement: 'bottomRight',
                            duration: 0,
                        });
                    })
                    .finally(() => {
                        this.ask = false
                    })
            },
            // 上传修改数据
            onUpLoadingEdior(filterForm) {
                const data = this.appendFormData(filterForm)
                upDataCommodity(this.key, data)
                    .then(res => {
                        this.$notification.success({
                            message: `成功提醒`,
                            description:
                                `商品编辑成功`,
                            placement: 'bottomRight',
                        });
                        this.$emit('onClose', false)
                        this.$emit('change')
                    })
                    .catch(err => {
                        this.$notification.error({
                            message: `失败提醒`,
                            description:
                                `商品编辑失败`,
                            placement: 'bottomRight',
                            duration: 0,
                        });
                    })
                    .finally(() => {
                        this.ask = false
                    })
            },
            // 将上传数据插入formData
            appendFormData(filterForm) {
                const formData = new FormData()
                for (let key in filterForm) {
                    if (filterForm.hasOwnProperty(key) && !Array.isArray(filterForm[key])) {
                        formData.append(key, filterForm[key])
                    } else if (filterForm.hasOwnProperty(key) && Array.isArray(filterForm[key]) && filterForm[key].some(o => o.constructor == Object)) {
                        // 以数组对象的形式上传
                        // const disposeData = function (name, data, formData) {
                        //     data.forEach((o, i) => {
                        //         for (let j in o) {
                        //             if (typeof o[j] === 'string') {//判断字符串
                        //                 formData.append(`${name}[${i}][${j}]`, data[i][j])
                        //             } else {//判断数组对象[{}]
                        //                 disposeData(`${name}[${i}][${j}]`, data[i][j], formData)
                        //             }
                        //         }
                        //     })
                        // }
                        // disposeData(key, filterForm[key], formData)

                        //2021/3/26 修改成以JSON.stringify
                        formData.append(key, JSON.stringify(filterForm[key]))
                    } else {
                        filterForm[key].forEach((item, index) => {
                            formData.append(`${key}[${index}]`, item)
                        })
                    }
                }
                return formData
            },
            //过滤空字符串
            onFilterString(form) {
                const findForm = Object.assign({}, form)
                for (let key in findForm) {
                    if (findForm.hasOwnProperty(key) && !(findForm[key]) && typeof findForm[key] === 'string') {
                        delete findForm[key];
                    } else if (findForm.hasOwnProperty(key) && !(findForm[key]) && findForm[key] == null) {
                        delete findForm[key];
                    }
                }
                return findForm
            },
            //过滤空数组和空数组对象 
            onFilterArr(form) {
                const findForm = Object.assign({}, form)
                for (let key in findForm) {
                    if (findForm.hasOwnProperty(key) && Array.isArray(findForm[key]) && findForm[key].length === 0) {
                        delete findForm[key];
                    } else if (findForm.hasOwnProperty(key) && Array.isArray(findForm[key]) && findForm[key].some(o => !o)) {
                        findForm[key] = findForm[key].filter(item => item)
                        if (findForm[key].length === 0) delete findForm[key];
                    } else if (findForm.hasOwnProperty(key) && Array.isArray(findForm[key]) && findForm[key].some(o => Object.values(o).some(t => !t))) {
                        findForm[key] = findForm[key].filter(item => !Object.values(item).some(o => o.length === 0))
                        if (findForm[key].length === 0) delete findForm[key];
                        if (!this.ask) this.ask = true
                    } else if (findForm.hasOwnProperty(key) && Array.isArray(findForm[key]) && findForm[key].some(o => Object.values(o).some(t => Array.isArray(t) && t.length === 0))) {
                        findForm[key] = findForm[key].filter(item => !Object.values(item).some(o => o.length === 0))
                        if (findForm[key].length === 0) delete findForm[key];
                        if (!this.ask) this.ask = true
                    }
                }
                return findForm
            },
            // 编辑状态下转换null
            onFilterNull(form) {
                const findForm = Object.assign({}, form)
                for (let key in findForm) {
                    if (findForm[key] == null && key === 'main_img_url') {
                        delete findForm[key]
                    }
                }
                return findForm
            },
            // 重置表单
            restform(formData) {
                if (!formData) {
                    this.form = {
                        name: '',
                        synopsis: [{ content: '' }, { content: '' }, { content: '' }, { content: '' }, { content: '' }],
                        product_description: '',
                        file_ids: [],
                        main_img_url: null,
                        attribute: null,
                        isShow: 1,
                        commodity_type_ids: [],
                        attrSort: 0,
                        tag_ids: [],
                        seo_title: '',
                        seo_description: '',
                        seo_url: '',
                    }
                    this.$refs.editor.initialize('')//赋值 富文本
                    this.$refs.mce.restFile([]) //赋值 媒体中心的图片
                    this.$refs.moreAttribute.restAttribute(null) // 赋值 多属性的内容
                    this.$refs.sortTree.restSortTree([]) // 赋值 产品分类
                    this.$refs.tagsSelect.restTagesSelect(null) // 赋值 商品标签
                } else {
                    let {
                        product_description,
                        file_ids,
                        attribute,
                        commodity_type_ids,
                        tag_ids,
                    } = formData
                    this.form = Object.assign({}, formData)
                    this.$refs.editor.initialize(product_description)//赋值 富文本
                    this.$refs.mce.restFile(file_ids) //赋值 媒体中心的图片
                    this.$refs.moreAttribute.restAttribute(attribute) // 赋值 多属性的内容
                    this.$refs.sortTree.restSortTree(commodity_type_ids) // 赋值 产品分类
                    this.$refs.tagsSelect.restTagesSelect_planm_B(tag_ids) // 赋值 商品标签
                }
            },

            /******************************************************供父组件调用的方法******************************************************/

            saveForm() {
                return this.form
            },

            clearValidate() {
                this.$refs.productRuleForm.clearValidate()
            },

            editorForm({ id, name, product_description, synopsis, files, main_img_url, attribute, isShow, commodity_types, attrSort, tags, seo_title, seo_description, seo_url }) {
                this.restform()
                const formData = Object.assign({}, this.form)
                formData.name = name || ''
                formData.product_description = product_description || ''
                formData.main_img_url = main_img_url || null
                formData.isShow = isShow || 0
                formData.attrSort = attrSort || 0
                formData.seo_title = seo_title || ''
                formData.seo_description = seo_description || ''
                formData.seo_url = seo_url || ''
                formData.commodity_type_ids = commodity_types.map(o => o.id) || []
                formData.tag_ids = tags.map(o => o.id) || []
                formData.file_ids = files.map(o => o.id) || []
                formData.attribute = JSON.parse(attribute) || null
                if (synopsis && synopsis !== 'null') {
                    JSON.parse(synopsis).forEach((option, index) => {
                        formData.synopsis[index] = option
                    })
                }
                this.key = id //赋值 商品id
                this.$refs.editor.initialize(product_description)//赋值 富文本
                this.$refs.mce.restFile(files) //赋值 媒体中心的图片
                this.$refs.moreAttribute.restAttribute(JSON.parse(attribute) || null) // 赋值 多属性的内容
                this.$refs.sortTree.restSortTree(commodity_types) // 赋值 产品分类
                this.$refs.tagsSelect.restTagesSelect(tags || 'null' || null) // 赋值 商品标签

                this.form = formData
                this.loadingForm = Object.assign({}, formData)//编辑模式下的对照组
            },
        }
    }
</script>
<style scoped lang="scss">
</style>