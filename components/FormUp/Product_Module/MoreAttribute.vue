<template>
    <div ref="MoreAttribute" class="MoreAttribute">
        <a-checkbox @change="onChange">
            此产品有多个选项，例如不同的尺寸或颜色
        </a-checkbox>
        <div class="checkeitor_box" v-if="visible">
            <a-divider />
            <draggable v-model="attributeData">
                <a-input-group compact v-for="(groupItem,groupIndex) in attributeData" :key="groupIndex"
                    style="margin-bottom: 15px;">
                    <a-input style="width: 20%" placeholder="选项名称" v-model="groupItem.name" />
                    <a-select labelInValue mode="tags" style="width: 80%" v-model="groupItem.children"
                        :token-separators="[',']">
                    </a-select>
                </a-input-group>
            </draggable>
            <a-divider />
            <a-button @click="addAttributeData">
                添加其他选项
            </a-button>
            <a-divider />
            预览
            <div class="preview">
                <div class="grid-parent" v-for="(attribute,index) in attributeData" :key="attribute.name+index">
                    <div class="name">{{attribute.name}}</div>
                    <draggable element="ul" v-model="attribute.children">
                        <li v-for="(childrenItem,childrenKey) in attribute.children">
                            <img :src="childrenItem.url" :alt="childrenItem.label" v-if="childrenItem.url" width="76px"
                                height="50px">
                            <template v-else>
                                {{childrenItem.label}}
                            </template>
                        </li>
                    </draggable>
                </div>
            </div>
        </div>
        <!-- 媒体中心 -->
        <a-modal v-model="mideoVisible" width="1100px" :footer="null" :getContainer="()=>$refs.MoreAttribute"
            :mask="false" :bodyStyle="{height:'600px',overflow:'auto'}" centered forceRender>
            <span slot="title">
                图片管理
                <a-input-search placeholder="请输入图片的名称进行检索" style="width:300px;margin-left:24px;" v-model="search"
                    @change="onSearch" />
            </span>
            <ListImage scene ref="listImage" @insertion="setImage" />
        </a-modal>
    </div>
</template>
<script>
    import draggable from 'vuedraggable'
    export default {
        name: 'MoreAttribute',
        components: {
            draggable,
        },
        data() {

            return {
                //多熟悉data
                visible: false,
                attributeData: [{ name: '', children: [] }],
                //媒体中心data
                mideoVisible: false,
                search: '',
                selectNode: [],
            }
        },
        watch: {
            attributeData: {
                handler(newVal) {
                    this.handleChange(newVal)
                },
                deep: true
            }
        },
        methods: {
            onChange(e) {
                this.visible = e.target.checked
                e.target.checked ? this.handleChange(this.attributeData) : this.handleChange(null)
            },
            handleChange(value) {
                this.$emit('change', value)
            },
            addAttributeData() {
                this.attributeData.some(option => !option.name.trim() || option.children.length == 0) ? this.$message.warning('当前属性列表中存在空值，请检查') : this.attributeData.push({ name: '', children: [] });
            },
            onDeselect(value, option) {
                console.log(value, option)
            },
            //========================================================搜索图片中心的图片===============================================
            onSearch(e) {
                const params = this.search
                this.$refs.listImage.onSearch(params)
            },
            setImage({ type, url }) {
                if (type === 'image') {
                    this.attributeData[this.selectNode[0]].children[this.selectNode[1]].url = url
                    this.mideoVisible = false
                } else {
                    this.$message.error('商品属性仅允许绑定图片！')
                }
            },
        },
    }
</script>
<style scoped lang="scss">
    .grid-parent {
        margin-top: 15px;
        display: grid;
        grid-template-columns: auto 1fr;
        grid-column-gap: 15px;

        &:not(:last-child) {
            padding-bottom: 15px;
            border-bottom: 1px solid #E8E8E8;
        }
    }

    .name {
        padding: 13px 0;
    }

    ul {
        list-style: none;
        padding-left: 0;
        margin-bottom: 0;
        display: flex;
        flex-wrap: wrap;

        li {
            margin: 0 8px 8px 0;
            border: 1px solid #E8E8E8;
            cursor: pointer;
            padding: 0 13px;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: all .3s;

            img {
                margin: -13px;
            }

            &:hover {
                color: #FFF;
                background-color: #188fff;
            }
        }
    }
</style>