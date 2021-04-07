<template>
    <div class="SortForm">
        <a-form-model ref="sortForm" :rules="rules" layout="vertical" :model="form" class="aformmodel">
            <div class="left_form">
                <a-form-model-item prop="name">
                    <span slot="label">
                        标题
                        <a-tooltip title="填写商品的标题" placement="right" style="color: orange;">
                            <a-icon type="question-circle-o" />
                        </a-tooltip>
                    </span>
                    <a-input v-model="form.name" placeholder="例如夏季产品系列，低于100美元，官方推荐" />
                </a-form-model-item>
                <a-form-model-item prop="description">
                    <span slot="label">
                        描述
                        <a-tooltip title="分类的详情内容描述，可插入图片、视频、文本等内容，提供在线自定义编辑,内容限制2000个字符以内" placement="right"
                            style="color: orange;">
                            <a-icon type="question-circle-o" />
                        </a-tooltip>
                    </span>
                    <TinyEditor ref='editor' @getTinyValue="(val)=>{form.description=val}" />
                </a-form-model-item>
                <p>搜索引擎优化</p>
                <a-divider />
                <a-form-model-item prop="seo_title">
                    <span slot="label">
                        页面标题
                        <a-tooltip title="设置商品页面上浏览器标签的标题" placement="right" style="color: orange;">
                            <a-icon type="question-circle-o" />
                        </a-tooltip>
                    </span>
                    <a-input v-model="form.seo_title" placeholder="页面的标题 使用的字符长度不超过70" />
                </a-form-model-item>
                <a-form-model-item prop="seo_description">
                    <span slot="label">
                        描述
                        <a-tooltip title="设置商品页面上浏览器标签的描述" placement="right" style="color: orange;">
                            <a-icon type="question-circle-o" />
                        </a-tooltip>
                    </span>
                    <a-textarea v-model="form.seo_description" placeholder="页面的描述 使用的字符长度不超过320"
                        :auto-size="{ minRows: 5, maxRows: 10 }" />
                </a-form-model-item>
                <a-form-model-item prop="seo_url">
                    <span slot="label">
                        内部链接优化
                        <a-tooltip title="设置商品页面的访问地址链接" placement="right" style="color: orange;">
                            <a-icon type="question-circle-o" />
                        </a-tooltip>
                    </span>
                    <a-input v-model="form.seo_url" placeholder="自定义链接" />
                </a-form-model-item>
                <a-form-model-item :wrapper-col="{span:12,offset:12}">
                    <a-button-group v-if="!redactKey">
                        <a-button type="primary"  @click="onSubmit">
                            创建
                        </a-button>
                        <a-button  @click="resetForm">
                            重置
                        </a-button>
                    </a-button-group>
                    <a-button-group v-else>
                        <a-button type="primary"  @click="onEitor">
                            编辑
                        </a-button>
                    </a-button-group>
                </a-form-model-item>
            </div>
            <div class="right_form">
                <div class="right_form_content">
                    <a-form-model-item prop="main_img_url">
                        <span slot="label">
                            商品分类图片
                            <a-tooltip title="设置商品分类的主图" placement="right" style="color: orange;">
                                <a-icon type="question-circle-o" />
                            </a-tooltip>
                        </span>
                        <UpLoadFile ref="upLoadFile" @change="onFileChange" />
                    </a-form-model-item>
                    <a-form-model-item prop="commodity_type_id">
                        <span slot="label">
                            商品分类
                            <a-tooltip title="商品的归属" placement="right" style="color: orange;">
                                <a-icon type="question-circle-o" />
                            </a-tooltip>
                        </span>
                        <Cascader ref="cascader" :disabled="isDisabled" scene="classify"
                            @onSelectCallBack="onSelectCallBack" />
                    </a-form-model-item>
                    <a-form-model-item prop="attrSort">
                        <span slot="label">
                            置顶
                            <a-tooltip title="设置商品在分类中的排序" placement="right" style="color: orange;">
                                <a-icon type="question-circle-o" />
                            </a-tooltip>
                        </span>
                        <a-switch checked-children="置顶" un-checked-children="默认" :checked="isChecked"
                            @change="onSwitchChange" />
                    </a-form-model-item>
                    <a-form-model-item>
                        <span slot="label">
                            模板样式
                            <a-tooltip title="设置商品详情页的展示方式" placement="right" style="color: orange;">
                                <a-icon type="question-circle-o" />
                            </a-tooltip>
                        </span>
                        <TemplateSelect />
                    </a-form-model-item>
                </div>
            </div>
        </a-form-model>
    </div>
</template>
<script>
    import { addNewCommoditiesSort, getCommoditiesSortDetails, upDataCommoditiesSort } from '@/assets/api' 
    const form = {
        name: '',//分类名称
        main_img_url: '',//分类主图
        description: '',//分类描述
        seo_title: '',//seo标题
        seo_description: '',//seo描述
        seo_url: '',//seo链接
        attrSort: 0,//排序 0默认|1置顶
        type: 'oneLevel',//分类级别 oneLevel|twoLevel|threeLevel
        commodity_type_id: null,//父级id
    }
    const rules = {
        name: [
            { required: true, message: '分类名称不能为空', trigger: 'blur' },
            { min: 3, message: '分类名称应不少于3个字符', trigger: 'change' }],
        seo_title: [
            { required: true, message: 'SEO标题不能为空', trigger: 'blur' },
            { min: 3, message: 'SEO标题不少于3个字符', trigger: 'change' }
        ],
        seo_description: [
            { required: true, message: 'SEO描述不能为空', trigger: 'blur' },
            { min: 3, message: 'SEO描述不少于3个字符', trigger: 'change' }
        ],
        // main_img_url: [
        //     { required: true, message: '分类主图不能为空', trigger: 'change' }
        // ],
    }
    const treeData = []
    //用于生产uid
    function createdUid() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    export default {
        name: 'SortForm',
        data() {

            return {
                form,
                rules,
                treeData,
            }
        },
        props: {
            redactKey: {
                type: [String, Number],
                default: ''
            }
        },
        computed: {
            isDisabled() {
                return this.redactKey ? true : false
            },

            isChecked() {
                return this.form.attrSort == null || this.form.attrSort == 0 ? false : true
            },
        },
        mounted() {
            this.initialize()
        },
        methods: {
            // 初始化
            initialize() {
                let _this = this
                if (this.redactKey) {
                    // 编辑分类
                    const headerConfig = {
                        onDownloadProgress(progress) {
                            let persent = Math.round(progress.loaded / progress.total) * 100  //下载进度百分比
                            _this.$emit('onpercent', persent)
                        }
                    }
                    this.$emit('changeLoading', true)
                    getCommoditiesSortDetails(this.redactKey, headerConfig)
                        .then(({ data: { data: objData } }) => {
                            this.form.name = objData.name
                            this.form.seo_title = objData.seo_title
                            this.form.seo_description = objData.seo_description
                            this.form.seo_url = objData.seo_url
                            this.form.attrSort = objData.attrSort ? 1 : 0
                            this.form.type = objData.type
                            this.form.commodity_type_id = objData.commodity_type_id
                            this.$refs.editor.initialize(objData.description)
                            this.$refs.upLoadFile.initialize([{
                                uid: createdUid(),
                                name: objData.name,
                                status: 'done',
                                url: objData.main_img_url
                            }])
                            this.$refs.cascader.getSort(objData.id)
                        })
                        .catch(() => {
                            this.$notification.open({
                                message: `失败提醒`,
                                description:
                                    `商品分类数据获取失败，请尝试重新获取`,
                                placement: 'bottomRight',
                                duration: 0,
                            });
                        })
                        .finally(() => {
                            this.$emit('changeLoading', false)
                            this.$emit('onpercent', 0)
                        })
                } else {
                    // 创建分类
                    const form = {
                        name: '',//分类名称
                        main_img_url: '',//分类主图
                        description: '',//分类描述
                        seo_title: '',//seo标题
                        seo_description: '',//seo描述
                        seo_url: '',//seo链接
                        attrSort: 0,//排序 0默认|1置顶
                        type: 'oneLevel',//分类级别 oneLevel|twoLevel|threeLevel
                        commodity_type_id: null,//父级id
                    }
                    this.form = form
                }
            },
            // 信息验证
            onSubmit() {
                let _this = this
                this.$refs.sortForm.validate(valid => {
                    if (valid) {
                        const filterForm = this.filterForm(this.form)
                        const headerConfig = {
                            onUploadProgress(progress) {
                                let persent = Math.round(progress.loaded / progress.total) * 100  //上传进度百分比
                                _this.$emit('onpercent', persent)
                            }
                        }
                        this.$emit('changeLoading', true)
                        addNewCommoditiesSort(filterForm, headerConfig)
                            .then(() => {
                                this.$notification.open({
                                    message: `成功通知`,
                                    description:
                                        `商品分类 ${this.form.name} 已成功创建`,
                                    placement: 'bottomRight',
                                });
                                this.resetForm()
                            })
                            .catch(() => {
                                this.$notification.open({
                                    message: `失败提醒`,
                                    description:
                                        `商品分类 ${this.form.name} 创建失败，请重新提交上传`,
                                    placement: 'bottomRight',
                                    duration: 0,
                                });
                            })
                            .finally(() => {
                                this.$emit('changeLoading', false)
                                this.$emit('onpercent', 0)
                            })
                    } else {
                        console.log(this.form)
                        return false;
                    }
                });
            },
            // 提交编辑
            onEitor() {
                let _this = this
                const filterForm = this.filterForm(this.form)
                const headerConfig = {
                    onUploadProgress(progress) {
                        let persent = Math.round(progress.loaded / progress.total) * 100  //上传进度百分比
                        _this.$emit('onpercent', persent)
                    }
                }
                this.$emit('changeLoading', true)
                upDataCommoditiesSort(this.redactKey, filterForm, headerConfig)
                    .then(() => {
                        this.$notification.open({
                            message: `更新成功通知`,
                            description:
                                `商品分类 ${this.form.name} 已成功更新`,
                            placement: 'bottomRight',
                        });
                    })
                    .catch(() => {
                        this.$notification.open({
                            message: `更新失败提醒`,
                            description:
                                `商品分类 ${this.form.name} 更新失败，请重新提交上传`,
                            placement: 'bottomRight',
                            duration: 0,
                        });
                    })
                    .finally(() => {
                        this.$emit('changeLoading', false)
                        this.$emit('onpercent', 0)
                    })
            },
            // 信息重置
            resetForm() {
                this.$refs.sortForm.resetFields();
                this.$refs.editor.initialize()
                this.$refs.upLoadFile.initialize()
                this.$refs.cascader.initialize()
            },
            // 过滤未填写信息
            filterForm(obj) {
                const formData = new FormData()
                for (let i in obj) {
                    if (obj[i] || obj[i] === 0) {
                        formData.append(i, obj[i])
                    }
                }
                return formData
            },
            //分类选择的回调
            onSelectCallBack(arr) {
                let isLevel
                const level = arr.length
                switch (level) {
                    case 0:
                        isLevel = 'oneLevel'
                        break;
                    case 1:
                        isLevel = 'twoLevel'
                        break;
                    case 2:
                        isLevel = 'threeLevel'
                        break;
                }
                this.form.type = isLevel
                level > 0 ? this.form.commodity_type_id = arr[level - 1] : this.form.commodity_type_id = null
            },
            //分类主图改变回调
            onFileChange(fileList) {
                this.form.main_img_url = fileList[0] ? fileList[0].file : ''
            },
            //是否置顶
            onSwitchChange(checked) {
                checked ? this.form.attrSort = 1 : this.form.attrSort = 0
            }
        }
    }
</script>
<style scoped lang="scss">
</style>