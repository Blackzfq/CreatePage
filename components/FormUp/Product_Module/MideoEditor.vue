<template>
    <div class="MideoEditor">
        <a-upload-dragger name="file" :multiple="true" action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            @change="handleChange">
            <p class="ant-upload-drag-icon">
                <a-icon type="inbox" />
            </p>
            <p class="ant-upload-text">
                单击或拖动文件到此区域进行上传
            </p>
            <p class="ant-upload-hint">
                支持单个或批量上传。严禁上传除公司资料外的其他文件
            </p>
        </a-upload-dragger>
    </div>
</template>
<script>
    export default {
        name: 'MideoEditor',
        data() {

            return {

            }
        },
        methods: {
            handleChange(info) {
                const status = info.file.status;
                if (status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (status === 'done') {
                    this.$message.success(`${info.file.name} file uploaded successfully.`);
                } else if (status === 'error') {
                    this.$message.error(`${info.file.name} file upload failed.`);
                }
            },
        },
    }
</script>
<style scoped lang="scss">
</style>