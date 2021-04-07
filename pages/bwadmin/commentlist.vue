<template>
    <div id="CommentList">
      <a-tabs default-active-key="1" @change="callback">
        <a-tab-pane key="1" tab="全部"> </a-tab-pane>
        <a-tab-pane key="2" tab="待回复" force-render> </a-tab-pane>
        <a-tab-pane key="3" tab="待审核" force-render> </a-tab-pane>
      </a-tabs>
      <Comment
        :data="data"
        :mode="mode"
        @reply="reply"
        @remove="remove"
        @revive="revive"
        @del="del"
      />
      <a-button @click="openBlogList">我亲自出马</a-button>
      <a-modal v-model="blogListVisible" class="selfModal">
        <a-list
          item-layout="vertical"
          size="large"
          :pagination="pagination"
          :data-source="blogListData"
        >
          <a-list-item
            slot="renderItem"
            key="item.title"
            slot-scope="item, index"
          >
            <div slot="actions">
              <a-textarea
                v-model="item.reply"
                style="width:30vw;margin-top:70px"
                placeholder="给你一个神评的机会. . . "
                :auto-size="{ minRows: 1, maxRows: 6 }"
              />
              <a-button @click="makeComment(item)">发表</a-button>
            </div>
            <img slot="extra" width="272" alt="logo" :src="item.main_img_url" />
            <a-list-item-meta :description="item.description">
              <a slot="title" :href="item.href">{{ item.title }}</a>
            </a-list-item-meta>
  
            {{ item.created_at }}
            <br />
            {{ $delHtmlTag(item.content) }}
          </a-list-item>
        </a-list>
      </a-modal>
      <a-modal v-model="visible" :title="replyTitle" @ok="handleOk">
        <a-form-model layout="horizontal" :model="replyData">
          <a-form-model-item has-feedback label="用户名">
            <a-input v-model="replyData.userName" autocomplete="off"
              ><a-icon slot="prefix" type="user" />
              <a-tooltip slot="suffix" title="填入当前的用户名,不填则为匿名用户">
                <a-icon type="info-circle" style="color: rgba(0,0,0,.45)" />
              </a-tooltip>
            </a-input>
          </a-form-model-item>
          <a-form-model-item has-feedback label="回复内容">
            <a-textarea
              v-model="replyData.content"
              autocomplete="off"
              :auto-size="{ minRows: 3, maxRows: 6 }"
              ><a-icon slot="prefix" type="user"
            /></a-textarea>
          </a-form-model-item>
        </a-form-model>
      </a-modal>
    </div>
  </template>
  <script>
  import {
    addComment,
    getComment,
    updateComment,
    delComment,
    getBlogList
  } from "@/assets/api";
  import Vue from "vue";
  Vue.prototype.$delHtmlTag = str => {
    return str.replace(/<[^>]+>/g, "").substring(0, 250);
  };
  export default {
    name: "CommentList",
    data() {
      return {
        data: [],   
        mode: "全部",    //控制tab栏切换的数据
        visible: false, //回复弹出层
        replyTitle: "", //回复弹出层的标题
        replyData: {
          //回复的表单信息
          userName: "",
          content: "",
          blog_id: "",
          comment_id: ""
        },
        blogListVisible: false, //博客列表展示
        blogListData: [], //博客列表数据
        pagination: {
          //博客列表分页
          onChange: page => {
            console.log(page);
          },
          pageSize: 3
        }
      };
    },
    mounted() {
      this.init();
    },
    methods: {
      // *初始化
      async init(params) {
        try {
          const {
            data: { data: res }
          } = await getComment(params);
          res.forEach(item => {
            item["show"] = false;
          });
          this.data = res;
          // console.log(res);
        } catch (err) {
        } finally {
        }
      },
      // *切换tab栏
      callback(val) {
        switch (parseInt(val)) {
          case 1:
            this.mode = "全部";
            this.init();
            break;
          case 2:
            this.mode = "待回复";
            this.init({ isVIP: 1 });
            break;
          case 3:
            this.mode = "待审核";
            this.init({ isShow: 0 });
            break;
          default:
            break;
        }
      },
      // *操作区 => 回复评论
      async reply(row) {
        this.visible = true;
        this.replyTitle = `正在回复用户 ${
          row.parentClass ? row.parentClass.name : row.name
        } 的评论`;
        this.replyData = {
          blog_id: row.blog_id,
          blog_comment_id: row.blog_comment_id ? row.blog_comment_id : row.id
        };
      },
      // *操作区 => 移入待审核
      remove(row, mode) {
        if (row.id && row.isShow) {
          let that = this;
          this.$confirm({
            title: `确定将评论 ${row.name} 移入待审核?`,
            okText: "确定",
            okType: "danger",
            cancelText: "取消",
            onOk() {
              updateComment(row.id, { isShow: 0 }).then(() => {
                that.$message.success("成了!");
                mode == "全部" && "待回复"
                  ? that.init()
                  : that.init({ isVIP: 0 });
              });
            },
            onCancel() {}
          });
        } else {
          return;
        }
      },
      // *操作区 => 审核评论
      revive(row) {
        row.id &&
          updateComment(row.id, { isShow: 1 }).then(() => {
            this.$message.success("成了!");
            this.init({ isShow: 0 });
          });
      },
      // *操作区 => 删除评论
      del(row) {
        if (row.id) {
          let that = this;
          console.log(row);
          this.$confirm({
            title: `确定将评论 ${row.comments} 删除?`,
            okText: "确定",
            okType: "danger",
            cancelText: "取消",
            onOk() {
              delComment(row.id).then(() => {
                that.$message.success("成了!");
                that.init({ isShow: 0 });
              });
            },
            onCancel() {
              console.log("Cancel");
            }
          });
        } else {
        }
      },
      // *回复对话框 => 点击确定
      handleOk() {
        this.visible = false;
        let data = {
          name: this.replyData.userName ? this.replyData.userName : "null",
          comments: this.replyData.content
        };
        Object.assign(this.replyData, data);
        addComment(this.replyData).then(() => {
          this.init();
        });
      },
      // *打开博客列表
      async openBlogList() {
        this.blogListVisible = true;
        const {
          data: { data: res }
        } = await getBlogList();
        this.blogListData = res;
      },
  
      // *亲自回复博客
      makeComment(item) {
        let data = {
          comments: item.reply,
          name: "admin",
          blog_id: item.id,
          blog_comment_id: null
        };
        addComment(data).then(res => {
          this.blogListVisible = false;
          this.init();
        });
      }
    }
  };
  </script>
  <style scoped lang="scss">
  #CommentList {
    background-color: #fff;
    padding: 24px;
    .myTextButton {
      padding-right: 40px;
      cursor: pointer;
      transition: all 0.3s;
  
      &:hover {
        color: #1890ff;
      }
    }
    &::v-deep .aformmodel {
      display: grid;
      grid-template-columns: auto 200px;
      grid-column-gap: 24px;
  
      .right_form {
        position: relative;
  
        .right_form_content {
          position: sticky;
          top: 0;
        }
      }
    }
  }
  .selfModal {
    &::v-deep .ant-modal {
      width: 74% !important;
    }
  }
  </style>
  