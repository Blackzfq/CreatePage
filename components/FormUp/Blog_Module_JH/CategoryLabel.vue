<template>
  <div>
    <a-select
      mode="multiple"
      v-model="selectValue"
      placeholder="Please select"
      @change="change"
    >
      <div slot="dropdownRender" slot-scope="menu">
        <v-nodes :vnodes="menu" />
        <a-divider v-show="mode == 'tag'" style="margin: 4px 0;" />
        <div
          v-show="mode == 'tag'"
          style="padding: 6px 8px 10px; cursor: pointer;"
          @click="visible = true"
        >
          <a-icon type="plus" /> Add item
        </div>

        <a-modal
          title="new tag"
          :visible="visible"
          :confirm-loading="confirmLoading"
          @ok="handleOk"
          @cancel="visible = false"
        >
          <a-input v-model="tagName" placeholder="input . . .">
            <a-icon slot="prefix" type="github" />
            <a-tooltip slot="suffix" title="Extra information">
              <a-icon type="info-circle" style="color: rgba(0,0,0,.45)" />
            </a-tooltip>
          </a-input>
        </a-modal>
      </div>

      <a-select-option v-for="(item, i) in multipleOption" :key="i">
        {{ item.label }}
      </a-select-option>
    </a-select>
  </div>
</template>

<script>
import { addBlogTags } from "@/assets/api";
export default {
  name: "CategoryLabel",
  components: {
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes
    }
  },
  props: {
    multipleOption: Array, //分类 => 下拉选项,
    mode: String
  },
  data() {
    return {
      selectValue: [], //分类 => 选择框中的值
      tagName: "", //新增标签 => 名称
      tagDescription: "", //新增标签 => 描述
      tagSlug: "", //新增标签 => 介绍
      visible: false,
      confirmLoading: false
    };
  },
  mounted() {
    this.multipleOption && this.initData();
  },
  methods: {
    // *获取博客分类初始数据
    initData(currentData) {
      if (currentData) {
        for (let i in currentData) {
          let find = this.multipleOption.findIndex(
            v => v.id == currentData[i].id
          );
          this.selectValue.push(find);
        }
      }else{
        return
      }
    },
    /**
     * 改变选择框下拉选项
     * @param {index} 为ant组件自带的索引值
     */
    change(index) {
      if (this.mode === "type") {
        let arr = [];
        for (let i in index) {
          arr.push(this.multipleOption[index[i]].id);
        }
        this.$emit("selectChangeType", arr);
      } else if (this.mode === "tag") {
        let arr = [];
        for (let i in index) {
          arr.push(this.multipleOption[index[i]].id);
        }
        this.$emit("selectChangeTag", arr);
      }
    },
    // *确定
    async handleOk(e) {
      try {
        this.confirmLoading = true;
        this.$message.success("新增标签成功 !");
        let data = {
          name: this.tagName,
          description: this.tagDescription,
          slug: this.tagSlug
        };
        await addBlogTags(data);
        this.$emit("refreshTags");
      } catch (err) {
        console.log(err);
        this.$message.error("wo bao cuo le");
      } finally {
        this.visible = false;
        this.confirmLoading = false;
      }
    },
    // *重置
    reset(){
      this.selectValue = []
      this.multipleOption = []
    }
  }
};
</script>

<style></style>
