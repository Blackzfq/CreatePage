<template>
  <div class="BlogForm">
    <a-form-model ref="RefBlogForm" :rules="rules" layout="vertical" :model="form" class="aformmodel">
      <div class="left_form">
        <a-form-model-item prop="title" has-feedback validate-status="success">
          <span slot="label">
            标题
            <a-tooltip title="填写文章的标题" placement="right" style="color: orange;">
              <a-icon type="question-circle-o" />
            </a-tooltip>
          </span>
          <a-input v-model="form.title" placeholder="写点什么吧 . . ." />
        </a-form-model-item>
        <a-form-model-item prop="content">
          <span slot="label">
            内容
            <a-tooltip title="文章的详情内容描述，可插入图片、视频、文本等内容，提供在线自定义编辑,内容限制2000个字符以内" placement="right"
              style="color: orange;">
              <a-icon type="question-circle-o" />
            </a-tooltip>
          </span>
          <TinyEditor ref="editor" @getTinyValue="
              val => {
                form.content = val;
              }
            " />
        </a-form-model-item>
        <a-form-model-item prop="synopsis">
          <span slot="label">
            摘录
            <a-tooltip title="文章的简介" placement="right" style="color: orange;">
              <a-icon type="question-circle-o" />
            </a-tooltip>
          </span>
          <a-textarea v-model="form.synopsis" placeholder="input . . ." :rows="4" />
        </a-form-model-item>
        <!-- <a-form-model-item>
          <a-row slot="label">
            <a-col :span="12">
              媒体中心
              <a-tooltip
                title="用以文章的主图设置。每个文章可以绑定一个视频链接和5张文章主图"
                placement="right"
                style="color: orange;"
              >
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
          <a-upload
            class="avatar-uploader"
            action=" "
            :show-file-list="false"
            :before-upload="beforeUpLoadMainImg"
          >
            <img v-if="showImg" :src="showImg" class="avatar" />
            <a-icon v-else type="plus" />
          </a-upload>
        </a-form-model-item> -->
        <p>搜索引擎优化</p>
        <a-divider />
        <a-form-model-item>
          <span slot="label">
            页面标题
            <a-tooltip title="设置文章页面上浏览器标签的标题" placement="right" style="color: orange;">
              <a-icon type="question-circle-o" />
            </a-tooltip>
          </span>
          <a-input v-model="form.seo_title" placeholder="页面的标题 使用的字符长度不超过70" />
        </a-form-model-item>
        <a-form-model-item>
          <span slot="label">
            描述
            <a-tooltip title="设置文章页面上浏览器标签的描述" placement="right" style="color: orange;">
              <a-icon type="question-circle-o" />
            </a-tooltip>
          </span>
          <a-textarea v-model="form.seo_description" placeholder="页面的描述 使用的字符长度不超过320"
            :auto-size="{ minRows: 5, maxRows: 10 }" />
        </a-form-model-item>
        <a-form-model-item>
          <span slot="label">
            内部链接优化
            <a-tooltip title="设置文章页面的访问地址链接" placement="right" style="color: orange;">
              <a-icon type="question-circle-o" />
            </a-tooltip>
          </span>
          <a-input v-model="form.seo_url" placeholder="自定义链接" />
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 12, offset: 12 }">
          <a-button-group v-if="!redactKey">
            <a-button type="primary" @click="save">
              创建
            </a-button>
            <a-button @click="resetForm">
              重置
            </a-button>
          </a-button-group>
          <a-button-group v-else>
            <a-button type="primary"  @click="save">
              编辑
            </a-button>
          </a-button-group>
        </a-form-model-item>
      </div>
      <div class="right_form">
        <div class="right_form_content">
          <a-form-model-item>
            <span slot="label">
              博客主图
              <a-tooltip title="设置博客的封面图片" placement="right" style="color: orange;">
                <a-icon type="question-circle-o" />
              </a-tooltip>
            </span>
            <UpLoadFile ref="upLoadFile" @change="onFileChange" />
          </a-form-model-item>
          <a-form-model-item>
            <span slot="label">
              博客状态
              <a-tooltip title="设置文章是否发布到客户端" placement="right" style="color: orange;">
                <a-icon type="question-circle-o" />
              </a-tooltip>
            </span>
            <a-select v-model="form.isShow" @change="val => (val ? (form.isShow = 1) : (form.isShow = 0))">
              <a-select-option v-for="(item, i) in multipleOption" :value="item.value" :key="i">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item prop="blog_type_ids">
            <span slot="label">
              博客分类 (多选)
              <a-tooltip title="设置文章的归属,若无文章归属则文章无法在客户端查阅" placement="right" style="color: orange;">
                <a-icon type="question-circle-o" />
              </a-tooltip>
            </span>
            <CategoryLabel ref="RefTypeCategoryLabel" mode="type" :multipleOption="typeMultipleOption"
              @selectChangeType="arr => (form.blog_type_ids = arr)" />
          </a-form-model-item>
          <a-form-model-item>
            <span slot="label">
              置顶
              <a-tooltip title="设置文章在分类中的排序" placement="right" style="color: orange;">
                <a-icon type="question-circle-o" />
              </a-tooltip>
            </span>
            <a-switch checked-children="置顶" un-checked-children="默认" :checked="isChecked"
              @change="val => (val ? (form.attrSort = 1) : (form.attrSort = 0))" />
          </a-form-model-item>
          <a-form-model-item prop="blog_tag_ids">
            <span slot="label">
              标签
              <a-tooltip title="设置文章的标签，用以搜索引擎的抓取" placement="right" style="color: orange;">
                <a-icon type="question-circle-o" />
              </a-tooltip>
            </span>
            <CategoryLabel ref="RefTagCategoryLabel" mode="tag" :multipleOption="tagMultipleOption"
              @selectChangeTag="arr => (form.blog_tag_ids = arr)" @refreshTags="refreshTags" />
          </a-form-model-item>
          <a-form-model-item>
            <span slot="label">
              模板样式
              <a-tooltip title="设置文章详情页的展示方式" placement="right" style="color: orange;">
                <a-icon type="question-circle-o" />
              </a-tooltip>
            </span>
            <TemplateSelect />
          </a-form-model-item>
          <a-form-model-item>
            <span slot="label">
              作者
              <a-tooltip title="设置文章详情页的展示方式" placement="right" style="color: orange;">
                <a-icon type="question-circle-o" />
              </a-tooltip>
              <a-input v-model="userName">user</a-input>
            </span>
          </a-form-model-item>
        </div>
      </div>
    </a-form-model>
  </div>
</template>
<script>
  import {
    addBlog,
    updataBlog,
    getBlogInfo,
    getBlogTypeList,
    getBlogTagsList
  } from "@/assets/api";
  //用于生产uid
  function createdUid() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  export default {
    name: "BlogForm",
    props: {
      redactKey: {
        type: [String, Number],
        default: ""
      }
    },
    data() {
      return {
        userName: "userName",
        form: {
          title: "",
          content: "",
          attrSort: 0,
          synopsis: "",
          isShow: 0,
          main_img_url: "",
          seo_title: "",
          seo_description: "",
          seo_url: "",
          blog_type_ids: [],
          blog_tag_ids: []
        },
        multipleOption: [
          { label: "橱窗", value: 1 },
          { label: "仓库", value: 0 }
        ],
        // 表单验证规则
        rules: {
          title: [
            { required: true, message: "博客标题不能为空", trigger: "blur" },
            { min: 3, message: "博客标题不少于3个字符", trigger: "change" }
          ],
          content: [
            { required: true, message: "博客内容不能为空", trigger: "change" }
          ],
          synopsis: [
            { required: true, message: "博客摘录不能为空", trigger: "change" }
          ],
          blog_type_ids: [
            { required: true, message: "请选择博客分类", trigger: "change" }
          ],
          blog_tag_ids: [
            { required: true, message: "请选择博客标签", trigger: "change" }
          ]
        },
        showImg: "",
        typeMultipleOption: [], //分类 => 下拉选项
        tagMultipleOption: [] //标签 => 下拉选项
      };
    },
    mounted() {
      this.initForm();
      this.initBlogType();
      this.initBlogTag();
    },
    methods: {
      // *初始化表单
      async initForm() {
        if (this.redactKey) {
          try {
            const {
              data: { data: res }
            } = await getBlogInfo(this.redactKey);
            this.form.title = res.title;
            this.$refs.editor.initialize(res.content);
            this.form.attrSort = res.attrSort ? 1 : 0;
            this.form.isShow = res.isShow;
            this.$refs.upLoadFile.initialize([
              {
                uid: createdUid(),
                name: res.title,
                status: "done",
                url: `${res.main_img_url}?round=${Math.random()}`
              }
            ]);
            this.form.synopsis = res.synopsis;
            this.form.seo_title = res.seo_title;
            this.form.seo_description = res.seo_description;
            this.form.seo_url = res.seo_url;
            this.form.blog_type_ids = res.blog_types.map(item => item.id);
            this.form.blog_tag_ids = res.blog_tags.map(item => item.id);
            setTimeout(() => {
              this.$refs.RefTypeCategoryLabel.initData(res.blog_types);
              this.$refs.RefTagCategoryLabel.initData(res.blog_tags);
              console.log(this.form.main_img_url);
            }, 500);
          } catch (err) {
            this.$notification.open({
              message: `失败提醒`,
              description: `博客数据获取失败，请尝试重新获取`,
              placement: "bottomRight",
              duration: 0,
              icon: <a-icon type="bug" style="color: #eb2f96" />
            });
          }
        } else {
        }
      },
      // *获取所有博客分类
      async initBlogType() {
        const {
          data: { data: res }
        } = await getBlogTypeList();
        this.typeMultipleOption = res.map((item, i) => {
          return {
            label: item.name,
            id: item.id,
            value: i
          };
        });
      },
      // *获取所有博客标签
      async initBlogTag() {
        const {
          data: { data: res }
        } = await getBlogTagsList();
        this.tagMultipleOption = res.map((item, i) => {
          return {
            label: item.name,
            id: item.id,
            value: i
          };
        });
      },

      // *保存
      save() {
        this.$refs.RefBlogForm.validate(async valid => {
          if (valid) {
            this.redactKey ? this.editUpload(this.redactKey) : this.addUpload();
          }
        });
      },

      // *编辑上传
      async editUpload(id) {
        const formData = this.upFormData(this.form);
        try {
          const data = await updataBlog(id, formData);
          setTimeout(() => {
            this.$notification.open({
              message: `成功通知`,
              description: `博客 ${this.form.title} 已更新成功`,
              placement: "topRight",
              icon: <a-icon type="rocket" style="color: #108ee9" />
            });
          }, 500);
          this.$emit("close");
        } catch (err) {
          this.$notification.open({
            message: `失败通知`,
            description: `博客 ${this.form.title} 更新失败`,
            placement: "bottomRight",
            icon: <a-icon type="bug" style="color: #eb2f96" />
          });
        } finally {
        }
      },
      // *新建上传
      async addUpload() {
        let formData = this.upFormData();
        try {
          const data = await addBlog(formData);
          this.$emit("close");
          setTimeout(() => {
            this.$notification.open({
              message: `成功通知`,
              description: `博客 ${this.form.title} 创建成功`,
              placement: "topRight",
              icon: <a-icon type="rocket" style="color: #108ee9" />
            });
          }, 500);
        } catch (err) {
          this.$notification.open({
            message: `失败通知`,
            description: `博客创建失败`,
            placement: "bottomRight",
            icon: <a-icon type="bug" style="color: #eb2f96" />
          });
        } finally {
        }
      },

      /**
       * 上传的表单数据
       * i : key
       * this.form[i] : value
       */
      upFormData() {
        let Data = new FormData();
        const upLoadForm = this.form;
        for (let key in upLoadForm) {
          if (Array.isArray(upLoadForm[key]) && upLoadForm[key].length === 0) {
            if (key === "blog_type_ids") {
              Data.append("blog_type_ids", "null");
            } else {
              Data.append("blog_tag_ids", "null");
            }
          } else if (
            Array.isArray(upLoadForm[key]) &&
            upLoadForm[key].length !== 0
          ) {
            upLoadForm[key].forEach((option, index) => {
              Data.append(`${key}[${index}]`, option);
            });
          } else {
            if (upLoadForm[key] || upLoadForm[key] === 0) {
              Data.append(key, upLoadForm[key]);
            }
          }
        }
        return Data;
        // let Data = new FormData();
        // for (let i in this.form) {
        //   if (i === "blog_type_ids") {
        //     this.formData[i].forEach((item, j) => {
        //       Data.append("blog_type_ids[" + j + "]", item);
        //     });
        //   } else if (i === "blog_tag_ids") {
        //     this.formData[i].forEach((item, j) => {
        //       Data.append("blog_tag_ids[" + j + "]", item);
        //     });
        //   } else {
        //     Data.append(i, this.form[i]);
        //   }
        // }
        // return Data;
      },

      // *重置表单
      resetForm() {
        this.form = {
          title: "",
          content: "1",
          attrSort: 0,
          synopsis: "",
          isShow: 0,
          main_img_url: "",
          seo_title: "",
          seo_description: "",
          seo_url: "",
          blog_type_ids: [],
          blog_tag_ids: []
        };
        this.$refs.RefBlogForm.resetFields();
        this.$refs.editor.initialize();
        this.$refs.RefTagCategoryLabel.reset();
        this.$refs.RefTypeCategoryLabel.reset();
        this.$refs.upLoadFile.initialize();
      },
      // *刷新博客标签列表
      refreshTags() {
        this.initBlogTag();
      },

      // *主图上传
      beforeUpLoadMainImg(file) {
        const isLt1M = file.size / 1024 / 1024 < 1;
        if (!isLt1M) {
          this.$message.error("图片大小不能超过 1MB!");
          return false;
        } else {
          console.log(file);
          this.form.main_img_url = file;
          this.showImg = URL.createObjectURL(file);
        }
      },

      onFileChange(fileList) {
        this.form.main_img_url = fileList[0] ? fileList[0].file : "";
      }
    },

    computed: {
      isChecked() {
        return this.form.attrSort == null || this.form.attrSort == 0
          ? false
          : true;
      }
    }
  };
</script>
<style scoped lang="scss"></style>