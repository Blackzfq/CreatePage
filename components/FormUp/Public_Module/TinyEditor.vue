<!-- 
自定义方法：
initialize  初始化文本数据   Function    this.$refs.editor.initialize() 
-->

<template>
    <div class="TinyEditor" ref="TinyEditor">
        <Editor v-model="value" :init="init"></Editor>
        <a-modal v-model="visible" width="1100px" :footer="null" :getContainer="()=>$refs.TinyEditor" :mask="false"
            :bodyStyle="{height:'600px',overflow:'auto'}" centered>
            <span slot="title">
                图片管理
                <a-input-search placeholder="请输入图片的名称进行检索" style="width:300px;margin-left:24px;" v-model="search"
                    @change="onSearch" />
                <a-button type="primary" @click="()=>Upvisible=true">
                    添加文件
                </a-button>
                <a-icon type="reload" :spin="loading" style="margin-left: 15px;" @click="refreshData"/>
            </span>
            <ListImage scene ref="listImage" :updeData="updata" @insertion="setImage" />
        </a-modal>
        <!-- 上传图片弹窗 -->
        <a-modal v-model="Upvisible" title="上传图片" height="800px" :footer="null" :getContainer="()=>$refs.TinyEditor"
            :mask="false" :bodyStyle="{height:'600px',overflow:'auto'}" centered>
            <MideoEditor @succee="onSuccee"/>
        </a-modal>
    </div>
</template>
<script>
    // 引入基本文件
    import Editor from '@tinymce/tinymce-vue'
    //在客户端环境引入
    let tinymce
    if (process.client) {
        tinymce = require('tinymce/tinymce')
        require('tinymce/themes/silver')
        require('tinymce/icons/default/icons.min.js')
        //引入编辑器的插件
        require('tinymce/plugins/image')// 插入上传图片插件
        require('tinymce/plugins/media')// 插入视频插件
        require('tinymce/plugins/table')// 插入表格插件
        require('tinymce/plugins/lists')// 列表插件
        require('tinymce/plugins/wordcount')// 字数统计插件
        require('tinymce/plugins/link')
        require('@/static/tinymce/powerpaste/plugin.min.js')
    }

    //引入方法
    // import { getOssSignatures, upFiletoAlioss } from '@/assets/api'



    export default {
        name: 'TinyEditor',
        components: { Editor },
        watch: {
            value(newVal) {
                this.propsParent(newVal)
            }
        },
        props: {
            scene: {
                type: String,
                default: "article"
            }
        },
        data() {

            return {
                visible: false,
                Upvisible:false,
                updata:null,
                loading:false,
                search: '',
                value: '',
                editor: null,
                init: {
                    language_url: '/tinymce/langs/zh_CN.js',// 语言包的路径
                    language: 'zh_CN',//语言
                    external_plugins: { 'powerpaste': '/tinymce/powerpaste/plugin.min.js' },
                    plugins: [
                        'powerpaste', // plugins中，用powerpaste替换原来的paste
                        //...
                    ],
                    powerpaste_word_import: 'propmt',// 参数可以是propmt, merge, clear，效果自行切换对比
                    powerpaste_html_import: 'propmt',// propmt, merge, clear
                    powerpaste_allow_local_images: true,
                    paste_data_images: true,
                    //配置
                    skin_url: '/tinymce/skins/ui/oxide',// skin路径
                    height: 600,//编辑器高度
                    branding: false,//是否禁用“Powered by TinyMCE”
                    // menubar: 'edit',//顶部菜单栏显示,
                    menubar: 'edit insert view format table tools fontsizeselect fontselect',
                    menu: {
                        edit: { title: '编辑', items: 'undo redo | cut copy paste pastetext | selectall' },
                        insert: { title: '插入', items: 'link image media | template hr' },
                        view: { title: '查看', items: 'visualaid' },
                        format: { title: '格式', items: 'bold italic underline strikethrough superscript subscript | formats | removeformat' },
                        table: { title: '表格', items: 'inserttable tableprops deletetable | cell row column' },
                        tools: { title: '工具', items: 'spellchecker code' }
                    },
                    content_style: "p{color: #666666;} span{color: #666666;}",
                    table_default_styles: { 'border-color': '#000000', 'width': '100%' },
                    fontsize_formats: '11px 12px 14px 16px 18px 24px 36px 48px 50px 56px 60px 64px',
                    plugins: 'lists image media table wordcount link',
                    toolbar: 'undo redo | fontsizeselect |  formatselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | CardBtn image',
                    placeholder: '本网页无缓存功能，请不要再编辑时刷新，以免内容丢失。可插入图片或YouTube视频',
                    setup: (editor) => {
                        const that = this
                        // 注册一个icon
                        editor.ui.registry.addIcon(
                            "shopping-cart",
                            `<svg viewBox="64 64 896 896" data-icon="folder-open" width="1.5em" height="1.5em" fill="currentColor" aria-hidden="true" focusable="false" class=""><path d="M928 444H820V330.4c0-17.7-14.3-32-32-32H473L355.7 186.2a8.15 8.15 0 0 0-5.5-2.2H96c-17.7 0-32 14.3-32 32v592c0 17.7 14.3 32 32 32h698c13 0 24.8-7.9 29.7-20l134-332c1.5-3.8 2.3-7.9 2.3-12 0-17.7-14.3-32-32-32zM136 256h188.5l119.6 114.4H748V444H238c-13 0-24.8 7.9-29.7 20L136 643.2V256zm635.3 512H159l103.3-256h612.4L771.3 768z"></path></svg>`
                        );
                        // 注册一个自定义的按钮
                        editor.ui.registry.addButton("CardBtn", {
                            icon: `shopping-cart`,
                            title: `图片管理中心`,
                            //自定义按钮的方法
                            onAction: function (_) {
                                that.editor = editor
                                that.visible = true
                            }
                        });
                    }
                }
            }
        },
        created() {
            const that = this
            // Initialize the app
            this.$nextTick(() => {
                if (process.client) {
                    window.tinymce.init({});
                }
            })
        },
        methods: {
            initialize(val) {
                this.value = val ? val : ''
            },
            propsParent(val) {
                this.$emit('getTinyValue', val)
            },
            //========================================================上传阿里云服务器===============================================
            async upImgFiletoAlioss(fromdata) {
                try {
                    await upFiletoAlioss(fromdata)
                    console.log('上传alioss成功')

                } catch (error) {
                    console.log('上传失败了')
                    console.log(error)
                }
            },
            //========================================================插入图片中心的图片===============================================
            setImage(val) {
                if (val.type === 'image') {
                    this.editor.insertContent(
                        `<img class='goodsImg' src='${val.url}'/>`
                    )
                } else if (val.type === 'video') {
                    this.editor.insertContent(
                        `<iframe width="893" height="415" src="https://backstage-public.oss-accelerate.aliyuncs.com/video/test.mp4" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe> `
                    )
                }

            },
            //========================================================搜索图片中心的图片===============================================
            onSearch(e) {
                const params = this.search
                this.$refs.listImage.onSearch(params)
            },
            async refreshData() {
                this.loading = true
                await this.$refs.listImage.resetImageList()
                this.loading=false
            },
            onSuccee(value){
                this.updata=value
            }
        }
    }
</script>
<style scoped lang="scss">
</style>