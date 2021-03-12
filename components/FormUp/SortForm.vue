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
                <a-form-model-item>
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
                    <a-button-group>
                        <a-button type="primary" @click="onSubmit">
                            创建
                        </a-button>
                        <a-button @click="resetForm">
                            重置
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
                        <UpLoadFile @change="onFileChange"/>
                    </a-form-model-item>
                    <a-form-model-item>
                        <span slot="label">
                            商品分类
                            <a-tooltip title="商品的归属" placement="right" style="color: orange;">
                                <a-icon type="question-circle-o" />
                            </a-tooltip>
                        </span>
                        <Cascader ref="cascader" :disabled="isredact" scene="classify" :checked="isSlect"
                            @onSelectCallBack="onSelectCallBack" />
                    </a-form-model-item>
                    <a-form-model-item>
                        <span slot="label">
                            置顶
                            <a-tooltip title="设置商品在分类中的排序" placement="right" style="color: orange;">
                                <a-icon type="question-circle-o" />
                            </a-tooltip>
                        </span>
                        <a-switch checked-children="置顶" un-checked-children="默认" @change="onSwitchChange"/>
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
    import { addNewCommoditiesSort } from '@/assets/api'
    const form = {
        name: '',//分类名称
        main_img_url: '',//分类主图
        description: '',//分类描述
        seo_title: '',//seo标题
        seo_description: '',//seo描述
        seo_url: '',//seo链接
        attrSort: undefined,//排序 0默认|1置顶
        type: undefined,//分类级别 oneLevel|twoLevel|threeLevel
        commodity_type_id: null,//父级id
    }
    const rules = {
        name: [
            { required: true, message: '分类名称不能为空', trigger: 'blur' },
            { min: 3, message: '分类名称应不少于3个字符', trigger: 'change' }],
        main_img_url: [
            { required: true, message: '分类主图不能为空', trigger: 'change' }
        ],
    }
    const treeData = []
    export default {
        name: 'SortForm',
        data() {

            return {
                form,
                rules,
                treeData
            }
        },
        props:{
            redactKey:{
                type:[String,Number],
                default:''
            }
        },
        computed: {
            isSlect() {
                return !!this.formData.recommend
            },
        },
        methods: {
            // 信息验证
            onSubmit() {
                this.$refs.sortForm.validate(valid => {
                    if (valid) {
                        console.log(this.form)
                    } else {
                        console.log(this.form)
                        return false;
                    }
                });
            },
            //信息重置
            resetForm() {
                this.$refs.sortForm.resetFields();
            },
            //分类选择的回调
            onSelectCallBack(val) {
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
            onFileChange(fileList){
                this.form.main_img_url=fileList[0]?fileList[0].file:''
            },
            //是否置顶
            onSwitchChange(checked){
                checked ? this.form.attrSort = 1 : this.form.attrSort = 0
            }
        }
    }
</script>
<style scoped lang="scss">
</style>