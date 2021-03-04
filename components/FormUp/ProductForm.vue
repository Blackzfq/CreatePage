<template>
    <div class="ProductForm">
        <a-form-model layout="vertical" :model="form" class="aformmodel">
            <div class="left_form">
                <div class="basic_information_left">
                    <a-form-model-item>
                        <span slot="label">
                            标题
                            <a-tooltip title="填写商品的标题" placement="right" style="color: orange;">
                                <a-icon type="question-circle-o" />
                            </a-tooltip>
                        </span>
                        <a-input v-model="form.fieldA" placeholder="短袖T恤" />
                    </a-form-model-item>
                    <a-form-model-item>
                        <span slot="label">
                            简介
                            <a-tooltip title="用以描述商品的用途和介绍，最多填写5栏，每栏限制200个字符" placement="right" style="color: orange;">
                                <a-icon type="question-circle-o" />
                            </a-tooltip>
                        </span>
                        <a-input v-model="form.fieldB" placeholder="可选：型号，参数，特色，卖点" />
                        <a-input style="margin-top: 15px;" />
                        <a-input style="margin-top: 15px;" />
                        <a-input style="margin-top: 15px;" />
                        <a-input style="margin-top: 15px;" />
                    </a-form-model-item>
                    <a-form-model-item >
                        <span slot="label">
                            描述
                            <a-tooltip title="商品的详情内容描述，可插入图片、视频、文本等内容，提供在线自定义编辑,内容限制2000个字符以内" placement="right" style="color: orange;">
                                <a-icon type="question-circle-o" />
                            </a-tooltip>
                        </span>
                        <TinyEditor ref='editor' />
                    </a-form-model-item>
                </div>
                <div class="basic_information_left">
                    <a-form-model-item>
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
                        <MideoEditor />
                    </a-form-model-item>
                </div>
                <div class="basic_information_left">
                    <a-form-model-item>
                        <span slot="label">
                            多属性
                            <a-tooltip title="为商品提供多种属性设置,例如型号大小S/M/L/XL,或者颜色样式 红/蓝/黄，等规格分类.若商品无多属性请勿勾选" placement="right" style="color: orange;">
                                <a-icon type="question-circle-o" />
                            </a-tooltip>
                        </span>
                        <MoreAttribute />
                    </a-form-model-item>
                </div>
                <div class="basic_information_left">
                    <p>搜索引擎优化</p>
                    <a-divider/>
                    <a-form-model-item>
                        <span slot="label">
                            页面标题
                            <a-tooltip title="设置商品页面上浏览器标签的标题" placement="right" style="color: orange;">
                                <a-icon type="question-circle-o" />
                            </a-tooltip>
                        </span>
                        <a-input v-model="form.fieldA" placeholder="页面的标题 使用的字符长度不超过70" />
                    </a-form-model-item>
                    <a-form-model-item>
                        <span slot="label">
                            描述
                            <a-tooltip title="设置商品页面上浏览器标签的描述" placement="right" style="color: orange;">
                                <a-icon type="question-circle-o" />
                            </a-tooltip>
                        </span>
                        <a-textarea v-model="form.fieldA" placeholder="页面的描述 使用的字符长度不超过320"
                            :auto-size="{ minRows: 5, maxRows: 10 }" />
                    </a-form-model-item>
                    <a-form-model-item>
                        <span slot="label">
                            内部链接优化
                            <a-tooltip title="设置商品页面的访问地址链接" placement="right" style="color: orange;">
                                <a-icon type="question-circle-o" />
                            </a-tooltip>
                        </span>
                        <a-input v-model="form.fieldA" placeholder="自定义链接" />
                    </a-form-model-item>
                    <a-form-model-item :wrapper-col="{span:12,offset:12}">
                        <a-button-group>
                            <a-button type="primary">
                                创建
                            </a-button>
                            <a-button>
                                重置
                            </a-button>
                        </a-button-group>
                    </a-form-model-item>
                </div>
            </div>
            <div class="right_form">
                <div class="right_form_content">
                    <div class="basic_information_right">
                        <a-form-model-item >
                            <span slot="label">
                                产品状态
                                <a-tooltip title="设置商品是否发布到客户端" placement="right" style="color: orange;">
                                    <a-icon type="question-circle-o" />
                                </a-tooltip>
                            </span>
                            <a-select default-value="lucy">
                                <a-select-option value="jack">
                                    上架
                                </a-select-option>
                                <a-select-option value="lucy">
                                    仓库
                                </a-select-option>
                            </a-select>
                        </a-form-model-item>
                    </div>
                    <div class="basic_information_right">
                        <a-form-model-item>
                            <span slot="label">
                                产品分类 (多选)
                                <a-tooltip title="设置商品的归属,若无商品归属则商品无法在客户端查阅" placement="right" style="color: orange;">
                                    <a-icon type="question-circle-o" />
                                </a-tooltip>
                            </span>
                            <ClassifyTree />
                        </a-form-model-item>
                    </div>
                    <div class="basic_information_right">
                        <a-form-model-item>
                            <span slot="label">
                                置顶
                                <a-tooltip title="设置商品在分类中的排序" placement="right" style="color: orange;">
                                    <a-icon type="question-circle-o" />
                                </a-tooltip>
                            </span>
                            <a-switch checked-children="置顶" un-checked-children="默认" />
                        </a-form-model-item>
                    </div>
                    <div class="basic_information_right">
                        <a-form-model-item>
                            <span slot="label">
                                标签
                                <a-tooltip title="设置商品的标签，用以搜索引擎的抓取" placement="right" style="color: orange;">
                                    <a-icon type="question-circle-o" />
                                </a-tooltip>
                            </span>
                            <TagsSelect />
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
            </div>
        </a-form-model>
    </div>
</template>
<script>
    export default {
        name: 'ProductForm',
        data() {

            return {
                form: {
                    fieldA: '',
                    fieldB: '',
                },
            }
        },
    }
</script>
<style scoped lang="scss">
    .basic_information_left {
        background-color: #FFF;
        padding: 15px;

        &:not(:first-child) {
            margin-top: 20px;
        }
    }

    .basic_information_right {
        background-color: #FFF;
        padding: 15px;

        &:not(:first-child) {
            margin-top: 20px;
        }
    }
</style>