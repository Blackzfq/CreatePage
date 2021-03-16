<template>
  <div class="SortTree">
    <a-input style="margin-bottom: 8px" placeholder="Search" @change="onChange">
      <a-tooltip slot="suffix" title="刷新当前分类列表" placement="right">
        <a-icon type="reload" style="cursor: pointer;" :spin="spin" @click="getSortList" />
      </a-tooltip>
    </a-input>
    <a-tree checkable :expanded-keys="expandedKeys" :auto-expand-parent="autoExpandParent" :tree-data="gData"
      v-model="checkedKeys" @expand="onExpand">
      <template slot="title" slot-scope="{ title }">
        <span v-if="title.indexOf(searchValue) > -1">
          {{ title.substr(0, title.indexOf(searchValue)) }}
          <span style="color: #f50">{{ searchValue }}</span>
          {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
        </span>
        <span v-else>{{ title }}</span>
      </template>
    </a-tree>
  </div>
</template>

<script>
  import { getCommoditiesSort } from '@/assets/api'
  export default {
    name: 'SortTree',
    data() {
      return {
        spin: false,
        expandedKeys: [],
        checkedKeys: [],
        searchValue: '',
        autoExpandParent: true,
        dataList: [],
        gData: []
      };
    },
    watch: {
      checkedKeys(val) {
        this.$emit('onCheck', val)
      },
    },
    mounted() {
      this.getSortList()
    },
    methods: {
      onExpand(expandedKeys) {
        this.expandedKeys = expandedKeys;
        this.autoExpandParent = false;
      },
      onChange(e) {
        const value = e.target.value;
        const expandedKeys = this.dataList
          .map(item => {
            if (item.title.indexOf(value) > -1) {
              return this.getParentKey(item.key, this.gData);
            }
            return null;
          })
          .filter((item, i, self) => item && self.indexOf(item) === i);
        Object.assign(this, {
          expandedKeys,
          searchValue: value,
          autoExpandParent: true,
        });
      },
      //查找内容节点并张开其父节点
      getParentKey(key, tree) {
        let parentKey;
        for (let i = 0; i < tree.length; i++) {
          const node = tree[i];
          if (node.children) {
            if (node.children.some(item => item.key === key)) {
              parentKey = node.key;
            } else if (this.getParentKey(key, node.children)) {
              parentKey = this.getParentKey(key, node.children);
            }
          }
        }
        return parentKey;
      },
      generateList(data) {
        for (let i = 0; i < data.length; i++) {
          const node = data[i];
          const key = node.key;
          const title = node.title
          this.dataList.push({ key, title: title });
          if (node.children) {
            this.generateList(node.children);
          }
        }
      },
      //获取分类树
      getSortList() {
        this.spin = true
        getCommoditiesSort()
          .then(({ data: { data: ListData } }) => {
            this.gData = this.restFormat(ListData)
            console.log(this.gData)
            this.generateList(this.gData)
            setTimeout(() => {
              this.spin = false
            }, 1000)
          })
          .catch(err => {
            this.$message.error('分类获取失败')
          })
          .finally()
      },
      //配置分类树格式 2021/3/15 改
      restFormat(arr) {
        const format = arr.map(item => {
          const newItem = {
            key: item.id,
            title: item.name,
          }
          if (item.twoLevelCommodityTypes || item.threeLevelCommodityTypes) {
            const params = item.twoLevelCommodityTypes || item.threeLevelCommodityTypes
            if (params.length !== 0) {
              newItem.children = this.restFormat(params)
            }
          }
          return Object.assign({}, newItem)
        })
        return format
      }
    },
  };
</script>

<style scoped lang="scss">

</style>