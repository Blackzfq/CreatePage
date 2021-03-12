<!--
自定义：
Listnumber 最多可上传多少张                     Number             默认为1         

a-upload：     
customRequest                                  通过覆盖默认的上传行为，可以自定义自己的上传实现	          Function
@preview 点击文件链接或预览图标时的回调          Function(file)

-->




<template>
    <div class="UpLoadFile">
        <!-- 文件上传区域 -->
        <a-upload list-type="picture-card" :customRequest="upLoadFile" :file-list="fileList" @preview="handlePreview"
            :remove="removeFile" :beforeUpload="beforeUpload">
            <div v-if="fileList.length < Listnumber">
                <a-icon type="plus" />
                <div class="ant-upload-text">
                    点击上传
                </div>
            </div>
        </a-upload>
        <!-- 文件预览 -->
        <a-modal centered width="1000px" :visible="previewVisible" :footer="null" :closable="false"
            @cancel="handleCancelpreview">
            <img style="width: 100%" :src="previewImage" />
        </a-modal>
        <!-- 文件裁剪 -->
        <a-modal :visible="cropperVisible" :confirmLoading="spinning" title="图片裁剪" width="800px"
            @cancel="handleCancelcropper" ok-text="裁剪" cancel-text="取消" @ok="okCutter">
            <div style="text-align: center;margin-bottom: 24px;">
                <a-radio-group default-value="auto" button-style="solid" @change="onChangeRadio">
                    <a-radio-button :value="radioItem.value" v-for="(radioItem,radioIndex) in options"
                        :key="radioIndex">
                        {{radioItem.label}}
                    </a-radio-button>
                </a-radio-group>
            </div>
            <!-- 裁剪工具 -->
            <a-spin :spinning="spinning">
                <div class="cropperImgBox" style="width: 100%;height: 500px;">
                    <VueCropper centerBox autoCrop full  ref="cropper" :img="cropperImage" :fixed="fixed"
                        :fixedNumber="fixedNumber" outputType="jpeg" mode="100%" />
                </div>
            </a-spin>
        </a-modal>
    </div>
</template>
<script>
    // 裁剪框的尺寸比例
    const options = [
        {
            label: '自由裁剪',
            value: 'auto'
        },
        {
            label: '1:1',
            value: [1, 1]
        },
        {
            label: '2:3',
            value: [2, 3]
        },
        {
            label: '3:4',
            value: [3, 4]
        },
        {
            label: '16:9',
            value: [16, 9]
        },
        {
            label: '16:10',
            value: [16, 10]
        }
    ]
    // 将文件转成Base64格式
    function getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        })
    };
    //用于生产uid
    function createdUid() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    export default {
        name: 'UpLoadFile',
        watch: {
            fileList:function(newVal){
                this.$emit('change',newVal)
            },
            deep:true
        },
        props: {
            // 上传文件的最大数量
            Listnumber: {
                type: Number,
                default: 1
            }
        },
        data() {

            return {
                spinning: false,//加载状态
                previewVisible: false,//预览文件的弹窗
                cropperVisible: false,//裁剪工具的弹窗
                cropperImgName: null,//裁剪的文件的名称
                previewImage: undefined,//预览的文件
                cropperImage: undefined,//裁剪工具内的文件
                options,// 裁剪框的尺寸比例集合
                fixedNumber: undefined,//裁剪工具的裁剪框的比例 需要设置fixed为true
                fixed: false,//裁剪工具的裁剪框是否固定比例
                fileList: [],//待传文件列表
            };
        },
        methods: {
            // 预览文件Modal对话框 点击遮罩层或右上角叉或取消按钮的回调
            handleCancelpreview() {
                this.previewVisible = false
            },
            // 裁剪工具Modal对话框 点击遮罩层或右上角叉或取消按钮的回调
            handleCancelcropper() {
                this.cropperVisible = false;
            },
            // 预览图片
            async handlePreview(file) {
                if (!file.url && !file.preview) {
                    file.preview = await getBase64(file.originFileObj);
                }
                this.previewImage = file.url || file.preview;
                this.previewVisible = true;
            },
            // 上传前调用 核对文件格式和大小
            beforeUpload(file) {
                const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                if (!isJpgOrPng) {
                    this.$message.error('图片仅支持jpge和png两种格式');
                }
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    this.$message.error('图片体积过载，请压缩到2M以内重新上传');
                }
                return isJpgOrPng && isLt2M;
            },
            // 移除文件
            removeFile(file) {
                const uid = file.uid
                this.fileList = this.fileList.filter(item => item.uid !== uid)
            },
            //上传文件
            upLoadFile({ file }) {
                const that = this
                this.$confirm({
                    title: '是否启用图片裁剪功能?',
                    content: h => <div style="color:red;">该功能可以进行图片大小尺寸的调整</div>,
                    cancelText: '不裁剪',
                    okText: '裁剪',
                    onOk() {
                        that.openCropper(file)
                    },
                    onCancel() {
                        that.insertFileList(file)
                    },
                    class: 'cropperOrUncropper',
                });
            },
            // 将未裁剪的文件插入文件待传列表
            async insertFileList(file, params = {}) {
                params.uid = file.uid
                params.name = file.name
                params.status = 'done'
                params.url = await getBase64(file)
                params.file= file
                this.fileList.push(params)
            },
            // 将经过裁剪的文件插入文件待传列表
            async insertCropperFileList(file, params = {}) {
                params.uid = await createdUid()
                params.name = this.cropperImgName
                params.status = 'done'
                params.url = file
                params.file= await this.dataURLtoFile(file)
                this.fileList.push(params)
            },
            //========================================================图片裁剪===============================================
            // 选择裁剪框的默认裁剪比例
            onChangeRadio(e) {
                const value = e.target.value
                if (value === 'auto') {
                    this.fixed = false
                } else {
                    this.fixed = true
                    this.fixedNumber = value
                }
                this.$refs.cropper.refresh()
            },
            // 打开裁剪工具
            openCropper(file) {
                this.cropperImgName = file.name
                let reader = new FileReader()
                reader.readAsDataURL(file);
                reader.onload = () => {
                    this.cropperImage = reader.result
                    this.cropperVisible = true//打开图片裁剪模块
                }
            },
            //确认裁剪
            okCutter() {
                let _this = this
                this.$refs.cropper.getCropData(data => {
                    _this.insertCropperFileList(data)
                    _this.handleCancelcropper()
                })
            },
            //把base64格式转成file文件
            dataURLtoFile(dataurl) {
                var arr = dataurl.split(","),
                    mime = arr[0].match(/:(.*?);/)[1],
                    bstr = atob(arr[1]),
                    n = bstr.length,
                    u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                return new File([u8arr], this.cropperImgName, { type: mime });
            },
            //==================================================存储到上传文件的显示列表===============================================
            // fileList: [
            // {
            // uid: 'uid',      // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
            // name: 'xx.png',   // 文件名
            // status: 'done', // 状态有：uploading done error removed
            // response: '{"status": "success"}', // 服务端响应内容
            // linkProps: '{"download": "image"}', // 下载链接额外的 HTML 属性
            // xhr: 'XMLHttpRequest{ ... }', // XMLHttpRequest Header
            // }
            // ],

        },
    }
</script>
<style scoped lang="scss">
    .ant-upload-select-picture-card i {
        font-size: 32px;
        color: #999;
    }

    .ant-upload-select-picture-card .ant-upload-text {
        margin-top: 8px;
        font-size: 12px;
        color: #666;
    }
</style>