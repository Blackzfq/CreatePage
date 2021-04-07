<template>
  <div>
    <a-list :data-source="data" item-layout="horizontal">
      <div
        slot="loadMore"
        :style="{
          textAlign: 'center',
          marginTop: '12px',
          height: '32px',
          lineHeight: '32px'
        }"
      ></div>
      <a-list-item slot="renderItem" slot-scope="item">
        <a slot="actions" v-if="mode !== '待审核'" @click="$emit('reply', item)"
          >回复</a
        >

        <div slot="actions" v-if="mode == '全部'">
          <a v-show="!item.show" @click="item.show = true">编辑</a>
          <a v-show="item.show" @click="save(item)">保存</a>
          <a v-show="item.show" @click="item.show = false">取消</a>
        </div>

        <a
          slot="actions"
          v-if="mode !== '待审核'"
          @click="$emit('remove', item, mode)"
          :style="{ color: item.isShow == 0 ? '#fe5e0e' : '#888' }"
        >
          {{ item.isShow == 0 ? "待审核" : "已审核" }}
        </a>

        <a slot="actions" v-else>
          <span @click="$emit('revive', item)">审核</span>
          <a-divider type="vertical" />
          <span @click="$emit('del', item)" style="color:#ff5500"
            >删除评论</span
          >
        </a>
        <a-list-item-meta>
          <!-- 有父级 -> 回复评论 -->
          <div slot="title" v-if="item.parentClass">
            <span>
              {{ item.name }} 回复了 {{ item.parentClass.name }} 的评论
            </span>
            <br />
            <br />
            <div>
              <span v-show="!item.show">回复内容 : {{ item.comments }}</span>
              <span
                ><a-input v-show="item.show" v-model="item.comments"></a-input
              ></span>
            </div>
          </div>
          <!-- 没有父级 -> 评论博客 -->
          <div slot="title" v-else>
            <span>
              {{ item.name }} 对
              <a href="#">{{ item.blog.title }}</a> 发表了评论
            </span>
            <br />
            <br />
            <div>
              <span v-show="!item.show"> 评论内容 : {{ item.comments }}</span>
              <span>
                <a-input v-show="item.show" v-model="item.comments"></a-input>
              </span>
            </div>
          </div>
          <a-avatar
            slot="avatar"
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
          />
        </a-list-item-meta>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
import { updateComment } from "@/assets/api";
export default {
  props: {
    data: {
      type: Array
    },
    mode: {
      type: String
    }
  },
  methods: {
    // *编辑 => 保存编辑数据
    async save(row) {
      try {
        if (row.id) {
          const data = await updateComment(row.id, { comments: row.comments });
          this.$message.success("update success");
          row.show = false;
        }
      } catch (err) {
        this.$message.error(err);
        throw err;
      }
    }
  }
};
</script>

<style scoped>
.icons-list >>> .anticon {
  margin-right: 6px;
  font-size: 24px;
}
</style>
