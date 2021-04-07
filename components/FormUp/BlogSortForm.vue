<template>
  <div class="BlogSortForm">
    <a-form-model ref="RefSortForm" :rules="rules" layout="vertical" :model="form">
      <div class="left_form">
        <a-form-model-item prop="name" has-feedback validate-status="success">
          <span slot="label">
            标题
            <a-tooltip title="填写博客分类的标题" placement="right" style="color: orange;">
              <a-icon type="question-circle-o" />
            </a-tooltip>
          </span>
          <a-input v-model="form.name" placeholder="例如SEO博客,社区博客,企业博客,产品博客" />
        </a-form-model-item>
        <a-form-model-item prop="description">
          <span slot="label">
            描述
            <a-tooltip title="博客分类的详情内容描述" placement="right" style="color: orange;">
              <a-icon type="question-circle-o" />
            </a-tooltip>
          </span>
          <!-- <a-textarea
            v-model="form.description"
            placeholder="input. . ."
            :rows="4"
          /> -->
          <TinyEditor ref="editor" @getTinyValue="
              val => {
                form.description = val;
              }
            " />
          <a-form-model-item prop="attrSort" style="padding:10px 0;">
            <span slot="label">
              置顶
              <a-tooltip title="设置博客在分类中的排序" placement="right" style="color: orange;">
                <a-icon type="question-circle-o" />
              </a-tooltip>
            </span>
            <a-switch checked-children="置顶" un-checked-children="默认" :checked="isChecked" @change="onSwitchChange" />
          </a-form-model-item>

        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 12, offset: 11 }">
          <a-button-group>
            <a-button type="primary" v-if="!redactKey" @click="onSubmit">
              创建
            </a-button>
            <a-button v-if="!redactKey" @click="resetForm">
              重置
            </a-button>
            <a-button type="primary" v-else @click="onEitor">
              编辑
            </a-button>
          </a-button-group>
        </a-form-model-item>
      </div>
      <div class="right_form">
        <div class="right_form_content">
          <a-form-model-item prop="blog_type_id" style="display:none">
            <span slot="label">
              博客分类
              <a-tooltip title="博客的归属" placement="right" style="color: orange;">
                <a-icon type="question-circle-o" />
              </a-tooltip>
            </span>
            <Cascader ref="cascader" :disabled="isDisabled" scene="classify" @onSelectCallBack="onSelectCallBack" />
          </a-form-model-item>
        </div>
      </div>
    </a-form-model>
  </div>
</template>
<script>
  import { getBlogTypeInfo, updateBlogType, addBlogType } from "@/assets/api";
  const form = {
    name: "", //分类名称
    description: "", //分类描述
    attrSort: 0, //排序 0默认|1置顶
    type: "oneLevel", //分类级别 oneLevel|twoLevel|threeLevel
    blog_type_id: null
  };
  const rules = {
    name: [
      { required: true, message: "分类名称不能为空", trigger: "blur" },
      { min: 3, message: "分类名称应不少于3个字符", trigger: "change" }
    ]
  };
  // const treeData = [];
  //用于生产uid
  function createdUid() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  const key = "updatable";
  export default {
    name: "BlogSortForm",
    data() {
      return {
        cacheName: "",
        form,
        rules
        // treeData
      };
    },
    props: {
      redactKey: {
        type: [String, Number],
        default: ""
      }
    },
    computed: {
      isDisabled() {
        return this.redactKey ? true : false;
      },

      isChecked() {
        return this.form.attrSort == null || this.form.attrSort == 0
          ? false
          : true;
      }
    },
    mounted() {
      this.initialize();
    },
    methods: {
      // *初始化
      initialize() {
        let _this = this;
        if (this.redactKey) {
          // 编辑分类
          const headerConfig = {
            onDownloadProgress(progress) {
              let persent = Math.round(progress.loaded / progress.total) * 100; //下载进度百分比
              _this.$emit("onpercent", persent);
            }
          };
          this.$emit("changeLoading", true);
          getBlogTypeInfo(this.redactKey, headerConfig)
            .then(({ data: { data: res } }) => {
              this.form.name = res.name;
              this.cacheName = res.name;
              this.form.attrSort = res.attrSort ? 1 : 0;
              this.form.type = res.type;
              this.form.blog_type_id = res.blog_type_id;
              this.$refs.editor.initialize(res.description);
              this.$refs.cascader.getSort(res.id);
            })
            .catch(() => {
              this.$notification.open({
                message: `失败提醒`,
                description: `博客分类数据获取失败，请尝试重新获取`,
                placement: "bottomRight",
                duration: 0,
                icon: <a-icon type="bug" style="color: #eb2f96" />
              });
            })
            .finally(() => {
              this.$emit("changeLoading", false);
              this.$emit("onpercent", 0);
            });
        } else {
          // 创建分类
          const form = {
            name: "", //分类名称
            description: "", //分类描述
            attrSort: 0, //排序 0默认|1置顶
            type: "oneLevel", //分类级别 oneLevel|twoLevel|threeLevel
            blog_type_id: null //父级id
          };
          this.form = form;
        }
      },
      // *点击创建
      onSubmit() {
        let _this = this;
        this.$refs.RefSortForm.validate(async valid => {
          if (valid) {
            const headerConfig = {
              onUploadProgress(progress) {
                let persent = Math.round(progress.loaded / progress.total) * 100; //上传进度百分比
                _this.$emit("onpercent", persent);
              }
            };
            this.$emit("changeLoading", true);
            addBlogType(this.form)
              .then(() => {
                this.$message.loading({ content: "Loading...", key });
                setTimeout(() => {
                  this.resetForm();
                  this.$message.success({ content: "Loaded!", key, duration: 2 });
                }, 500);
                this.$notification.open({
                  message: `成功通知`,
                  description: `博客分类 ${this.form.name} 已成功创建`,
                  placement: "topRight",
                  icon: <a-icon type="rocket" style="color: #108ee9" />
                });
              })
              .catch(() => {
                this.$notification.open({
                  message: `失败提醒`,
                  description: `博客分类 ${this.form.name} 创建失败，请重新提交上传`,
                  placement: "bottomRight",
                  duration: 1000,
                  icon: <a-icon type="bug" style="color: #eb2f96" />
                });
              })
              .finally(() => {
                this.$emit("refreshList");
                this.$emit("changeLoading", false);
                this.$emit("onpercent", 0);
              });
          } else {
            console.log(this.form);
            return false;
          }
        });
      },
      // *点击编辑
      onEitor() {
        let _this = this;
        const headerConfig = {
          onUploadProgress(progress) {
            let persent = Math.round(progress.loaded / progress.total) * 100; //上传进度百分比
            _this.$emit("onpercent", persent);
          }
        };
        this.$emit("changeLoading", true);
        if (this.cacheName === this.form.name) {
          let form = Object.assign({}, this.form);
          delete form.name;
          this.update(this.redactKey, form, headerConfig);
        } else {
          let form = this.form;
          this.update(this.redactKey, form, headerConfig);
        }
      },
      // *表单提交
      update(id, form, headerConfig) {
        updateBlogType(id, form, headerConfig)
          .then(() => {
            this.$notification.open({
              message: `更新成功通知`,
              description: `博客分类 ${this.form.name} 已成功更新`,
              placement: "topRight",
              icon: <a-icon type="rocket" style="color: #108ee9" />
            });
          })
          .catch(() => {
            this.$notification.open({
              message: `更新失败提醒`,
              description: `博客分类 ${this.form.name} 更新失败，请重新提交上传`,
              placement: "bottomRight",
              icon: <a-icon type="bug" style="color: #eb2f96" />
            });
          })
          .finally(() => {
            this.$emit("refreshList");
            this.$emit("changeLoading", false);
            this.$emit("onpercent", 0);
          });
      },

      // *信息重置
      resetForm() {
        this.form = {
          name: "", //分类名称
          description: "", //分类描述
          attrSort: 0, //排序 0默认|1置顶
          type: "oneLevel", //分类级别 oneLevel|twoLevel|threeLevel
          blog_type_id: null
        };
        this.$refs.editor.initialize();
        //   this.$refs.upLoadFile.initialize();
        //   this.$refs.cascader.initialize();
      },

      //分类选择的回调
      onSelectCallBack(arr) {
        let isLevel;
        const level = arr.length;
        switch (level) {
          case 0:
            isLevel = "oneLevel";
            break;
          case 1:
            isLevel = "twoLevel";
            break;
          case 2:
            isLevel = "threeLevel";
            break;
        }
        this.form.type = isLevel;
        level > 0
          ? (this.form.blog_type_id = arr[level - 1])
          : (this.form.blog_type_id = null);
      },
      //是否置顶
      onSwitchChange(checked) {
        checked ? (this.form.attrSort = 1) : (this.form.attrSort = 0);
      }
    }
  };
</script>
<style scoped lang="scss"></style>