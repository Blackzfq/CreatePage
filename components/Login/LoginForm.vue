<template>
    <div class="LoginForm">
        <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules">
            <a-form-model-item has-feedback label="UserName" prop="name">
                <a-input v-model="ruleForm.name" type="password" autocomplete="off" />
            </a-form-model-item>
            <a-form-model-item has-feedback label="Password" prop="password">
                <a-input v-model="ruleForm.password" type="password" autocomplete="off" />
            </a-form-model-item>
            <a-form-model-item>
                <a-row>
                    <a-col :span="8">
                        <a>Can't&nbsp;login？</a>
                    </a-col>
                    <a-col :span="8" :offset="8">
                        <a-button type="primary" @click="submitForm('ruleForm')" style="width: 100%;">
                            Login
                        </a-button>
                    </a-col>
                </a-row>
            </a-form-model-item>
        </a-form-model>
    </div>
</template>
<script>
    export default {
        name: 'LoginForm',
        data() {
            let validateUserName = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('Please input the login name'));
                } else {
                    if (this.ruleForm.name !== '') {
                        this.$refs.ruleForm.validateField('checkPass');
                    }
                    callback();
                }
            };
            let validatePassword = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('Please input the password'));
                } else if (value.length<6) {
                    callback(new Error("Password less than 6 characters"));
                } else {
                    callback();
                }
            };
            return {
                ruleForm: {
                    name: '',
                    password: '',
                },
                rules: {
                    name: [{ validator: validateUserName, trigger: 'change' }],
                    password: [{ validator: validatePassword, trigger: 'change' }],
                }
            }
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        alert('submit!');
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        },
    }
</script>
<style scoped lang="scss">
</style>