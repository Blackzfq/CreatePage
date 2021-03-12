<template>
    <div class="LoginForm">
        <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules">
            <a-form-model-item has-feedback label="登录名" prop="username">
                <a-input v-model="ruleForm.username" type="text123456" autocomplete="off" />
            </a-form-model-item>
            <a-form-model-item has-feedback label="密码" prop="password">
                <a-input v-model="ruleForm.password" type="password" autocomplete="off" />
            </a-form-model-item>
            <a-form-model-item>
                <a-row>
                    <a-col :span="8">
                        <a>忘记密码？</a>
                    </a-col>
                    <a-col :span="8" :offset="8">
                        <a-button type="primary" @click="submitForm('ruleForm')" style="width: 100%;">
                            <span v-if="!loading">登录</span>
                            <a-spin :indicator="indicator" v-else/>
                        </a-button>
                    </a-col>
                </a-row>
            </a-form-model-item>
        </a-form-model>
    </div>
</template>
<script>
    import { login } from '@/assets/api'
    import { setToken } from '@/assets/axios/token'
    export default {
        name: 'LoginForm',
        data() {
            let validateUserName = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入登录名'));
                } else {
                    if (this.ruleForm.name !== '') {
                        this.$refs.ruleForm.validateField('checkPass');
                    }
                    callback();
                }
            };
            let validatePassword = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入登录密码'));
                } else if (value.length < 6) {
                    callback(new Error("密码长度不少于6位"));
                } else {
                    callback();
                }
            };
            return {
                ruleForm: {
                    grant_type: "password",
                    client_id: 2,
                    client_secret: "8i7aAk3czn0CjnqW5nzkyqzdocO4FLMznK3Adpp1",
                    username: '',
                    password: '',
                    scope: ''
                },
                rules: {
                    username: [{ validator: validateUserName, trigger: 'change' }],
                    password: [{ validator: validatePassword, trigger: 'change' }],
                },
                loading:false,
                indicator:<a-icon type="loading" style="font-size: 16px;color:#FFF" spin />
            }
        },
        methods: {
            //信息验证
            submitForm(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.loading=true
                        this.onLogin()
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //用户登录
            onLogin() {
                const formData = this.ruleForm
                login(formData)
                    .then(res => {
                        setToken(res.data.access_token)
                        this.$router.push('/bwadmin/homecms')
                    })
                    .catch(err => {
                        this.$notification.open({
                            message: '警告',
                            description:'登录失败，请重新核对您的账户名和密码以确保正确',
                            placement:'topLeft'
                        });
                    })
                    .finally(() => {
                        this.loading = false
                    })
            }

        },
    }
</script>
<style scoped lang="scss">
</style>