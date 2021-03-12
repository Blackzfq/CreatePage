<template>
    <div class="MideoEditor">
        <a-upload-dragger name="file" :multiple="true" :customRequest="onUp" list-type="picture" @change="handleChange">
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
    import { upMedioFiles } from "@/assets/api"
    export default {
        name: 'MideoEditor',
        data() {

            return {

            }
        },
        methods: {
            async onUp({ file, onProgress, onSuccess, onError }) {
                const formData = new FormData()
                const upConfig = {
                    onUploadProgress(progress) {
                        onProgress({ percent: Math.round(progress.loaded / progress.total) * 100 }, file)
                    }
                }
                formData.append('files[0]', file)
                upMedioFiles(formData, upConfig)
                    .then(({ data: { data: dataList } }) => {
                        onSuccess(dataList);
                    })
                    .catch(({ response }) => {
                        onError(response, response.data.message)
                    })
            },
            async handleChange(info) {
                const status = info.file.status
                if (status === 'done') {
                    this.$emit('succee',info.file.response[0])
                } else if (status === 'error') {
                    console.log('文件上传失败');
                }
            },
        },
    }
</script>
<style scoped lang="scss">
</style>