<!--
自定义：
Listnumber 最多可上传多少张                     Number             默认为1
saveAliOss 是否存储到阿里云                     Boolen             默认为true           为false则存储到本地服务器
onTailor   是否开启裁剪功能                     Boolen             默认为true           为false则不开启裁剪
scene      文件应用的场景                       String             article 添加文章文件 commodity 添加商品文件
@getFile   返回图片裁剪后的图片文件              File
@remove    返回当前移除的图片                   function           saveAliOss为false时,为移除封面图片/为true时，为移除详情列表，返回剩余的图片列表
initialize 初始化图片列表                       function           this.$refs.childComponent.initialize()
fixedNumber截图的宽高比例                       Array              默认为[1,1]               



a-upload：     
customRequest                                  通过覆盖默认的上传行为，可以自定义自己的上传实现	          Function
@preview 点击文件链接或预览图标时的回调          Function(file)
@change 上传文件改变时的状态                    Function 


a-modal:
visible 对话框是否可见                          boolean
footer  底部内容                               底部内容，当不需要默认底部按钮时，可以设为 :footer="null"
@cancel                                       点击遮罩层或右上角叉或取消按钮的回调                 function(e)
-->




<template>
    <div class="UpMainImg">
        <a-upload list-type="picture-card" :customRequest="upAliOssAdmin" :file-list="fileList" @preview="handlePreview"
            :remove="removeFile" :beforeUpload="beforeUpload">
            <div v-if="fileList.length < Listnumber">
                <a-icon type="plus" />
                <div class="ant-upload-text">
                    点击上传
                </div>
            </div>
        </a-upload>
        <a-modal :visible="previewVisible" title="图片预览" :footer="null" @cancel="handleCancelpreview">
            <img style="width: 100%" :src="previewImage" />
        </a-modal>
        <a-modal :visible="cropperVisible" :confirmLoading="spinning" title="图片裁剪" width="800px"
            @cancel="handleCancelcropper" ok-text="裁剪" cancel-text="取消" @ok="uploading">
            <div style="text-align: center;margin-bottom: 24px;">
                <a-radio-group default-value="auto" button-style="solid" @change="onChangeRadio">
                    <a-radio-button :value="radioItem.value" v-for="(radioItem,radioIndex) in options"
                        :key="radioIndex">
                        {{radioItem.label}}
                    </a-radio-button>
                </a-radio-group>
            </div>
            <a-spin :spinning="spinning">
                <div class="cropperImgBox" style="width: 100%;height: 500px;">
                    <VueCropper centerBox autoCrop ref="cropper" :img="cropperImage" :fixed="fixed"
                        :fixedNumber="fixedNumber" outputType="jpeg" mode="100%" />
                </div>
            </a-spin>
        </a-modal>
    </div>
</template>
<script>
    // import { getOssSignatures, upFiletoAlioss, deleteToAlioss } from '~/assets/api'
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
    function getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
    export default {
        name: 'UpMainImg',
        watch: {
            cropperImgName(newValue) {
                this.signatures_form.fileName = newValue
            },
            copyFileList: {
                handler: function (val) {
                    this.fileList = this.copyFileList
                    console.log(val)
                },
                deep: true
            },
            file_main_url(newValue) {
                const fileList = {
                    uid: -99,
                    name: '1',
                    status: 'done',
                    url: newValue
                }
                this.copyFileList.push(fileList)
            },
            file_img_url_list: {
                handler: function (newVal) {
                    const list = new Array()
                    for (let i in newVal) {
                        const fileList = {
                            uid: -newVal[i].id,
                            name: newVal[i].filename,
                            status: 'done',
                            url: newVal[i].url
                        }
                        list.push(fileList)
                    }
                    this.copyFileList = list
                },
                deep: true
            }
        },
        props: {
            Listnumber: {
                type: Number,
                default: 1
            },
            scene: {
                type: String,
                default: 'article'
            },
            saveAliOss: {
                type: Boolean,
                default: true
            },
            file_main_url: {
                type: String,
                default: ''
            },
            file_img_url_list: {
                type: Array,
                default: function () {
                    return []
                }
            }
        },
        data() {

            return {
                spinning: false,
                previewVisible: false,
                cropperVisible: false,
                options,
                fixedNumber: undefined,
                fixed: false,
                onTailor: false,
                cropperImgName: '',
                previewImage: '',
                cropperImage: '',
                status: 'done',// 状态有：uploading done error removed
                total: -1,
                fileList: [],
                copyFileList: [],
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
                signatures_form: {
                    bucket: 'public',
                    // scene: this.scene,
                    type: 'image',
                    fileName: ''
                },
                aliOss_form: {
                    key: '',
                    policy: '',
                    OSSAccessKeyId: '',
                    success_action_status: 200,
                    signature: '',
                    callback: '',
                    file: undefined
                }
            };
        },
        methods: {
            initialize() {
                this.copyFileList = []
            },
            handleCancelpreview() {
                this.previewVisible = false
            },
            handleCancelcropper() {
                this.cropperVisible = false;
            },
            async handlePreview(file) {
                if (!file.url && !file.preview) {
                    file.preview = await getBase64(file.originFileObj);
                }
                this.previewImage = file.url || file.preview;
                this.previewVisible = true;
            },
            handleChange({ fileList }) {
                this.fileList = fileList;
            },
            beforeUpload(file) {
                const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                if (!isJpgOrPng) {
                    this.$message.error('图片格式不太对劲...可能不是jpg格式的文件呢');
                }
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    this.$message.error('图片太臃肿啦~~~赶紧压缩到2M以内吧!');
                }
                return isJpgOrPng && isLt2M;
            },
            // 移除文件
            removeFile(file) {
                if (this.saveAliOss) {
                    const { url, uid } = file
                    const id = Math.abs(uid)
                    deleteToAlioss(id)
                        .then(res => {
                            console.log(res)
                            const finalArr = this.copyFileList.filter((item) => {
                                return !url.includes(item.url)
                            })
                            this.copyFileList = finalArr
                            this.$emit('remove', finalArr)
                        })
                        .catch(err => {
                            const str = err.response.data.message
                            const result = str.match('No query results for model')
                            if (result) {
                                const finalArr = this.copyFileList.filter((item) => {
                                    return !url.includes(item.url)
                                })
                                this.copyFileList = finalArr
                                this.$emit('remove', finalArr)
                            } else {
                                this.$message.error("图片删除失败")
                            }
                        })

                } else {
                    this.$emit('remove')
                    this.initialize()
                }
            },
            upAliOssAdmin({ file }) {
                const that = this
                this.$confirm({
                    title: '是否启用图片裁剪功能?',
                    content: h => <div style="color:red;">该功能可以进行图片大小尺寸的调整</div>,
                    cancelText: '不裁剪',
                    okText: '裁剪',
                    onOk() {
                        that.onTailor = true
                        that.openCropper(file)
                    },
                    onCancel() {
                        that.onTailor = false
                        that.cropperImgName = file.name
                        that.imgSaveToFile(file)
                    },
                    class: 'cropperOrUncropper',
                });
            },
            //========================================================图片裁剪===============================================
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
            openCropper(file) {
                this.cropperImgName = file.name
                let reader = new FileReader()
                reader.readAsDataURL(file);
                reader.onload = () => {
                    this.cropperImage = reader.result
                    this.cropperVisible = true//打开图片裁剪模块
                }
            },
            uploading() {
                let _this = this
                this.$refs.cropper.getCropData(data => {
                    _this.imgSaveToFile(data)
                })
            },
            async imgSaveToFile(data) {//存储转换后的图片文件
                let imgFile
                this.onTailor ? imgFile = this.dataURLtoFile(data) : imgFile = data
                this.spinning = true
                if (this.saveAliOss) {//存储到阿里云
                    // const imgBase64 = data
                    const params = this.signatures_form
                    params.scene = this.scene
                    try {
                        const { data } = await getOssSignatures(params)
                        const upLoadingImgData = new FormData()
                        upLoadingImgData.append("key", data.data.dir)
                        upLoadingImgData.append("policy", data.data.policy)
                        upLoadingImgData.append("OSSAccessKeyId", data.data.access_id)
                        upLoadingImgData.append("signature", data.data.signature)
                        upLoadingImgData.append("callback", data.data.callback)
                        upLoadingImgData.append("file", imgFile)
                        await this.upImgFiletoAlioss(upLoadingImgData, `https://xintai-test-public.oss-cn-hangzhou.aliyuncs.com/${data.data.dir}`)
                        this.$emit('getFile', this.fileList)
                    } catch (error) {
                        this.$message.error(`图片上传失败`)
                        this.spinning = false
                        console.log(error)
                    }
                } else {//存储到服务器
                    this.status = "done"
                    if (this.onTailor) {
                        this.saveToFileList(data)
                    } else {
                        const newBase64 = await this.getBase64(data)
                        this.saveToFileList(newBase64)
                    }
                    this.$emit('getFile', imgFile)
                    this.spinning = false
                    this.cropperVisible = false
                }
                //开始上传阿里云服务器
                //...
            },
            dataURLtoFile(dataurl) {//把base64格式转成file文件
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
            async getBase64(file) {//把file格式转成base64文件
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = error => reject(error);
                });
            },
            //========================================================上传阿里云服务器===============================================
            async upImgFiletoAlioss(fromdata, url) {
                try {
                    await upFiletoAlioss(fromdata)
                    console.log('上传alioss成功')
                    this.status = "done"
                    this.saveToFileList(url)
                    this.spinning = false
                    this.cropperVisible = false

                } catch (error) {
                    this.spinning = false
                    this.status = "error"
                    this.saveToFileList(url)
                    console.log('上传失败了')
                    console.log(error)
                }
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
            saveToFileList(imgURL) {
                const fileListItem = {
                    uid: this.total,
                    name: this.cropperImgName,
                    status: this.status,
                    url: imgURL
                }
                this.copyFileList.push(fileListItem)
                this.total -= 1
            }

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