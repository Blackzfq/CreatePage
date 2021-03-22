<template>
    <div class="BWadmin-home">
        <a-layout id="components-layout-demo-fixed-sider">
            <!---------------------------------------- 侧边栏 ---------------------------------------->
            <a-layout-sider :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }">
                <div class="logo" />
                <a-menu theme="dark" mode="inline" :default-selected-keys="['1']" :selectedKeys="selectedKeys"
                    @select="onSelect" :open-keys="openKeys" @openChange="onOpenChange">
                    <a-sub-menu v-for="(item,index) in subMenu" :key="item.key">
                        <span slot="title">
                            <a-icon :type="item.icon" />
                            <span class="nav-text">{{item.title}}</span>
                        </span>
                        <a-menu-item v-for="(childItem,childindex) in item.children" :key="childItem.key">
                            {{childItem.title}}
                        </a-menu-item>
                    </a-sub-menu>
                    <a-menu-item v-for="(item,index) in subItem" :key="item.key">
                        <a-icon :type="item.icon" />
                        <span class="nav-text">{{item.title}}</span>
                    </a-menu-item>
                </a-menu>
            </a-layout-sider>
            <a-layout :style="{ marginLeft: '200px' }">
                <!---------------------------------------- 头部区 ---------------------------------------->
                <a-layout-header
                    :style="{ background: '#fff', padding: '0 16px',display:'flex','justify-content':'flex-end','align-items':'center'}">
                    <a-popover>
                        <template slot="content">
                            <p>个人信息</p>
                            <p>修改密码</p>
                            <p>退出登录</p>
                        </template>
                        <a-avatar icon="user" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                    </a-popover>
                </a-layout-header>
                <!---------------------------------------- 内容区 ---------------------------------------->
                <a-layout-content class="card-containe"
                    :style="{ margin: '24px 0px 0',height:'calc(100vh - 64px - 24px - 69px)',overflow:'hidden'}">
                    <!---------------------------------------- 标签页 ---------------------------------------->
                    <a-tabs v-model="activeKey" hide-add type="editable-card" @edit="onEdit" @change="onChange"
                        style="margin-bottom: 0;">
                        <a-tab-pane v-for="pane in panes" :key="pane.key" :tab="pane.title" :closable="pane.closable"/>
                    </a-tabs>
                    <div
                        :style="{ padding: '0 24px',height:'calc(100vh - 64px - 24px - 69px - 56px)','overflow-x':'auto'}">
                        <NuxtChild keep-alive/>
                    </div>
                </a-layout-content>
                <a-layout-footer :style="{ textAlign: 'center' }">
                    BW CreatePages ©2021 Created by BlackZFQ
                </a-layout-footer>
            </a-layout>
        </a-layout>
    </div>
</template>
<script>
    import { mapState, mapActions, mapMutations } from 'vuex'
    export default {
        name: 'BWadminHome',
        layout: 'Admin',
        asyncData({ route, redirect }) {
            if (route.name == 'bwadmin') {
                redirect('/bwadmin/homecms')
            }
        },
        computed: {
            subMenu() {
                return this.path.filter(item => item.children)
            },
            subItem() {
                return this.path.filter(item => item.content)
            },
            menuPath() {
                let arr = [{
                    title: '首页',
                    content: '/bwadmin/homecms',
                    key: '1',
                    closable: false
                }]
                const path = this.path.filter(item => item.content)
                const child = this.path.filter(item => item.children)
                child.forEach(item => {
                    arr = [...arr, ...item.children]
                })
                return [...arr, ...path]
            },
            ...mapState('BwadminMenu', {
                selectedKeys: 'selectedKeys',
                panes: 'panes',
                openKeys: 'openKeys'
            }),
        },
        watch: {
            $route(to, from, next) {
                this.onActiveKey(to.path)
            }
        },
        data() {
            const path = [
                {
                    title: '博客管理', icon: 'video-camera', key: 'sub1', children: [
                        { title: '博客列表', content: '/bwadmin/bloglist', key: 'sub1-2' },
                        { title: '创建博客', content: '/bwadmin/createblog', key: 'sub1-3' },
                        { title: '博客分类', content: '/bwadmin/blogclassify', key: 'sub1-5' },
                        { title: '评论管理', content: '/bwadmin/commentlist', key: 'sub1-4' },
                        { title: '标签管理', content: '/bwadmin/blogtag', key: 'sub1-6' }
                    ]
                },
                {
                    title: '商品管理', icon: 'video-camera', key: 'sub2', children: [
                        { title: '商品列表', content: '/bwadmin/productlist', key: 'sub2-7' },
                        { title: '商品分类', content: '/bwadmin/productclassify', key: 'sub2-9' },
                    ]
                },
                { title: '标签管理', content: '/bwadmin/labelmanagement', icon: 'tag', key: '11' },
                { title: '页面管理', content: '/bwadmin/pagecms', icon: 'cloud-o', key: '12' },
                { title: '图片管理', content: '/bwadmin/imagecms', icon: 'appstore-o', key: '13' },
                { title: '询盘中心', content: '/bwadmin/inquirycms', icon: 'team', key: '14' },
                { title: '语言设置', content: '/bwadmin/languagecms', icon: 'shop', key: '15' },
                { title: '统计分析', content: '/bwadmin/statisticscms', icon: 'shop', key: '16' },
                { title: '权限管理', content: '/bwadmin/jurisdictioncms', icon: 'shop', key: '17' },
                { title: '相关链接', content: '/bwadmin/relatedcms', icon: 'shop', key: '18' }
            ];
            const rootSubmenuKeys = ['sub1', 'sub2', 'sub3'];
            return {
                activeKey: '1',
                path,
                rootSubmenuKeys,
            }
        },
        created() {
            this.resetPanes()
            this.resetSelectedKeys()
            this.resetPath()
        },
        mounted() {
            window.addEventListener("beforeunload", this.beforeunloadFn);
        },
        destroyed() {
            window.removeEventListener("beforeunload", this.beforeunloadFn);
        },
        methods: {
            ...mapActions('BwadminMenu', {
                setSelectedKeys: 'setSelectedKeys',
                setPanes: 'setPanes',
                pushPanes: 'pushPanes',
                setOpenKeys: 'setOpenKeys'
            }),
            /*********************************************************************** 页面刷新提示 ***********************************************************************/
            beforeunloadFn(e) {
                e = e || window.event;
                if (e) {
                    e.returnValue = "关闭提示";
                }
                return "关闭提示";
            },
            /*********************************************************************** 初始化 ***********************************************************************/
            resetPanes() {
                const panes = this.$store.state.BwadminMenu.panes
                if (panes.length === 0) {
                    this.$store.dispatch('BwadminMenu/resetPanes')
                }
            },
            resetSelectedKeys() {
                const selectedKeys = this.$store.state.BwadminMenu.selectedKeys
                if (selectedKeys.length === 0) {
                    this.$store.dispatch('BwadminMenu/resetSelectedKeys')
                }
            },
            resetPath() {
                let blo = false
                const url = this.$route.path
                const itemkey = this.menuPath.filter(item => item.content === url)[0]
                const paneslist = this.panes
                const parent = itemkey.key.split("-")
                parent.length > 1 ? this.setOpenKeys([parent[0]]) : this.setOpenKeys([])
                paneslist.forEach(item => {
                    if (JSON.stringify(item) == JSON.stringify(itemkey)) {
                        blo = true
                    }
                })
                if (!blo) this.pushPanes(itemkey)
                this.activeKey = itemkey.key
                this.setSelectedKeys(itemkey.key)

            },
            /*********************************************************************** 标签页 ***********************************************************************/
            callback(key) {
                console.log(key);
            },
            onActiveKey(val) {
                const item = this.menuPath.filter(item => item.content === val)
                if (item.length !== 0) {
                    const key = item[0].key
                    const keylist = key.split('-')
                    const isPanes = this.panes.filter(item => item.key === key)[0]
                    this.activeKey = key
                    this.setSelectedKeys(key)
                    keylist.length !== 0 ? this.setOpenKeys([keylist[0]]) : this.setOpenKeys([])
                    if (!isPanes) this.pushPanes(item[0])
                } else {
                    this.activeKey = ''
                    this.setSelectedKeys('')
                    this.setOpenKeys([])
                }
            },
            onChange(activeKey) {
                const path = this.panes.filter(pen => pen.key == activeKey)
                const parent = activeKey.split('-')
                if (parent.length > 1) {
                    this.setOpenKeys([parent[0]])
                } else {
                    this.setOpenKeys([])
                }
                this.setSelectedKeys(activeKey)
                this.$router.push(`${path[0].content}`)
            },
            onEdit(targetKey, action) {
                this[action](targetKey)
            },
            remove(targetKey) {
                let activeKey = this.activeKey;
                let lastIndex;
                let activeContent;
                this.panes.forEach((pane, i) => {
                    if (pane.key === targetKey) {
                        lastIndex = i - 1;
                    }
                });
                const panes = this.panes.filter(pane => pane.key !== targetKey);
                if (panes.length && activeKey === targetKey) {
                    if (lastIndex >= 0) {
                        activeKey = panes[lastIndex].key;
                        activeContent = panes[lastIndex].content;
                    } else {
                        activeKey = panes[0].key;
                        activeContent = panes[0].content;
                    }
                }
                this.setPanes(panes)
                this.setSelectedKeys(activeKey)
                const parents = activeKey.split('-')
                if (parents.length > 1) {
                    this.setOpenKeys([parents[0]])
                } else {
                    this.setOpenKeys([])
                }
                if (activeContent) this.$router.push(`${activeContent}`)
            },
            /*********************************************************************** 导航菜单 ***********************************************************************/
            onSelect({ key }) {
                this.setSelectedKeys(key)
                let blo = false
                const paneslist = this.panes
                const parent = key.split("-")
                const itemkey = this.menuPath.filter(item => item.key === key)[0]
                if (parent.length < 1) this.setOpenKeys([])
                paneslist.forEach(item => {
                    if (JSON.stringify(item) == JSON.stringify(itemkey)) {
                        blo = true
                    }
                })
                if (!blo) this.pushPanes(itemkey)
                this.$router.push(`${itemkey.content}`)
            },
            onOpenChange(openKeys) {
                const latestOpenKey = openKeys.find(key => this.openKeys.indexOf(key) === -1);
                if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
                    this.setOpenKeys(openKeys)
                } else {
                    latestOpenKey ? this.setOpenKeys([latestOpenKey]) : this.setOpenKeys([])
                }
            },
            /*********************************************************************** 通用函数 ***********************************************************************/
        }
    }
</script>
<style lang="scss">
    .BWadmin-home {
        height: 100vh;
        overflow: hidden;
    }

    #components-layout-demo-fixed-sider .logo {
        height: 32px;
        background: rgba(255, 255, 255, 0.2);
        margin: 16px;
    }
</style>