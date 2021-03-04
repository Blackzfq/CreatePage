<template>
    <div class="PageDetilForm">
        <a-form-model ref="ruleForm" :model="formdata" :rules="rules">
            <a-form-model-item ref="name" label="页面名称" prop="name">
                <a-input v-model="formdata.name" @blur="
                      () => {
                        $refs.name.onFieldBlur();
                      }
                    " />
            </a-form-model-item>
            <a-form-model-item ref="url" label="页面网址" prop="url">
                <a-input v-model="formdata.url" @blur="
                      () => {
                        $refs.url.onFieldBlur();
                      }
                    " />
                <span style="color: #999999;">* 网页地址只能是唯一值。</span>
            </a-form-model-item>
            <a-form-model-item ref="title" label="页面标题Title" prop="title">
                <a-input v-model="formdata.title" @blur="
                      () => {
                        $refs.title.onFieldBlur();
                      }
                    " />
            </a-form-model-item>
            <a-form-model-item label="网页描述 Description" prop="description">
                <a-input v-model="formdata.description" placeholder="填写对网页内容的简要介绍。" type="textarea"
                    :auto-size="{ minRows: 3, maxRows: 5 }" />
                <span style="color: #999999;">* 填写对网页内容的简要介绍，也是对网页标题的补充，一般不超过100字。</span>
            </a-form-model-item>
            <a-form-model-item label="网页关键词 Keywords" prop="keywords">
                <a-input v-model="formdata.keywords" placeholder="填写页面中主要的关键词，数量控制在三到六个内" type="textarea"
                    :auto-size="{ minRows: 3, maxRows: 8 }" />
                <span style="color: #999999;">* 以逗号分割的多个关键词，数量控制在三到六个以内</span>
            </a-form-model-item>
        </a-form-model>
    </div>
</template>
<script>
    export default {
        name: 'PageDetilForm',
        props: {
            formdata: {
                type: Object,
                default: function () {
                    const form = {
                        name: '',
                        url: '',
                        title: '',
                        description: '',
                        keywords: '',
                    }
                    return form
                }
            }
        },
        data() {

            return {
                rules: {
                    name: [
                        { required: true, message: '需要填写页面名称', trigger: 'blur' },
                        { min: 3, max: 20, message: '内容长度在3-20个字符之间', trigger: 'blur' },
                    ],
                    url: [
                        { required: true, message: '需要填写页面地址', trigger: 'blur' },
                        { min: 3, max: 20, message: '内容长度在3-20个字符之间', trigger: 'blur' },
                    ],
                    title: [
                        { required: true, message: '需要填写页面标题', trigger: 'blur' },
                        { min: 3, max: 20, message: '内容长度在3-20个字符之间', trigger: 'blur' },
                    ],
                    description: [
                        { required: true, message: '需要填写页面描述', trigger: 'blur' },
                        { min: 3, max: 200, message: '内容长度在3-200个字符之间', trigger: 'blur' },
                    ],
                    keywords: [
                        { required: true, message: '需要填写网页关键词', trigger: 'blur' },
                        { min: 3, max: 100, message: '内容长度在3-100个字符之间', trigger: 'blur' },
                    ],
                },
            }
        },
        methods: {
            onSubmit() {
                let verify
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        console.log('submit!!');
                        verify=true
                    } else {
                        console.log('error submit!!');
                        verify=false
                        return false;
                    }
                });
                return verify
            },
            resetForm() {
                this.$refs.ruleForm.resetFields();
            },
        },
    }
</script>
<style scoped lang="scss">
</style>