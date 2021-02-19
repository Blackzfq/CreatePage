<template>
    <div class="PageEditorMenu">
        <!-- 菜单 -->
        <ul class="Menu">
            <li v-for="(item,index) in menu" :key="index" @click="showDrawer(item.components)">
                <a-tooltip placement="rightTop">
                    <template slot="title">
                        <span>{{item.title}}</span>
                    </template>
                    <a-icon :type="item.ico" style="font-size: 24px;color: #FFF;cursor: pointer;padding:10px 0;" />
                </a-tooltip>
            </li>
        </ul>
        <!-- 工具 -->
        <ul class="Tool">
            <li v-for="(item,index) in tool" :key="index">
                <a-tooltip placement="rightTop">
                    <template slot="title">
                        <span>{{item.title}}</span>
                    </template>
                    <a-icon :type="item.ico" style="font-size: 24px;color: #FFF;cursor: pointer;padding:10px 0;" />
                </a-tooltip>
            </li>
        </ul>
        <!-- 视图 -->
        <ul class="View">
            <li v-for="(item,index) in view" :key="index">
                <a-tooltip placement="rightTop">
                    <template slot="title">
                        <span>{{item.title}}</span>
                    </template>
                    <a-icon :type="item.ico" style="font-size: 24px;color: #FFF;cursor: pointer;padding:10px 0;" />
                </a-tooltip>
            </li>
        </ul>
    </div>
</template>
<script>
    export default {
        name: 'PageEditorMenu',
        data() {

            return {
                menu: [{ title: '返回工作台', ico: 'home', components: '1' }, { title: '预览', ico: 'eye', components: '2' }, { title: '添加模块', ico: 'plus', components: '3' }, { title: '页面管理', ico: 'file', components: '4' }],
                tool: [{ title: '保存', ico: 'save' }, { title: '更新', ico: 'reload' }],
                view: [{ title: '桌面', ico: 'home' }, { title: '平板', ico: 'eye' }, { title: '手机', ico: 'plus' }]
            }
        },
        methods: {
            showDrawer(val) {
                switch (val) {
                    case '1':
                    this.$router.go(-1);
                        break;
                    case '2':
                        this.$notification.open({
                            message: '温馨提示',
                            description:
                                '功能正在开发中，敬请期待',
                            onClick: () => {
                                console.log('Notification Clicked!');
                            },
                        });
                        break;
                    case '3':
                        this.$store.commit('PagesEitorMenu/SET_Menu', true)
                        this.$store.commit('PagesEitorMenu/SET_Modle', true)
                        this.$store.commit('PagesEitorMenu/SET_Title', '添加模块')
                        break;
                    case '4':
                        this.$store.commit('PagesEitorMenu/SET_Menu', true)
                        this.$store.commit('PagesEitorMenu/SET_Modle', false)
                        this.$store.commit('PagesEitorMenu/SET_Title', '编辑页面')
                        break;
                    default:
                        console.log(val)
                        break;
                }
            },
        }
    }
</script>
<style scoped lang="scss">
    .PageEditorMenu {
        ul {
            list-style: none;
            padding-left: 0;
        }

        li {
            display: flex;
            justify-content: center;
        }

        ul.Menu {}

        ul.Tool {
            margin-top: 30px;
        }

        ul.View {
            margin-top: 30px;
        }
    }
</style>