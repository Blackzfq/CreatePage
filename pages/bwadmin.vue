<template>
    <div class="BWadmin-home">
        <a-layout id="components-layout-demo-fixed-sider">
            <!---------------------------------------- 侧边栏 ---------------------------------------->
            <a-layout-sider :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }">
                <div class="logo" />
                <a-menu theme="dark" mode="inline" :default-selected-keys="['1']" :selectedKeys="selectedKeys"
                    @select="onSelect">
                    <a-menu-item v-for="(item,index) in path" :key="item.key">
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
                <a-layout-content
                    :style="{ margin: '24px 16px 0',height:'calc(100vh - 64px - 24px - 69px)',overflow:'hidden'}">
                    <!---------------------------------------- 标签页 ---------------------------------------->
                    <a-tabs v-model="activeKey" hide-add type="editable-card" @edit="onEdit" @change="onChange"
                        style="margin-bottom: 0;">
                        <a-tab-pane v-for="pane in panes" :key="pane.key" :tab="pane.title" :closable="pane.closable">
                            <div
                                :style="{ padding: '24px', background: '#fff',height:'calc(100vh - 64px - 24px - 69px - 56px)','overflow': 'auto'}">
                                <NuxtChild keep-alive />
                            </div>
                        </a-tab-pane>
                    </a-tabs>
                </a-layout-content>
                <a-layout-footer :style="{ textAlign: 'center' }">
                    BW CreatePages ©2021 Created by BlackZFQ
                </a-layout-footer>
            </a-layout>
        </a-layout>
    </div>
</template>
<script>
    export default {
        name: 'BWadminHome',
        layout: 'Admin',
        data() {
            const path = [
                { title: '博客管理', content: '/bwadmin/blogcms', icon: 'video-camera', key: '2' },
                { title: '产品管理', content: '/bwadmin/productcms', icon: 'upload', key: '3' },
                { title: '分类管理', content: '/bwadmin/classifycms', icon: 'bar-chart', key: '4' },
                { title: '页面管理', content: '/bwadmin/pagecms', icon: 'cloud-o', key: '5' },
                { title: '图片管理', content: '/bwadmin/imagecms', icon: 'appstore-o', key: '6' },
                { title: '询盘中心', content: '/bwadmin/inquirycms', icon: 'team', key: '7' },
                { title: '语言设置', content: '/bwadmin/languagecms', icon: 'shop', key: '8' },
                { title: '统计分析', content: '/bwadmin/statisticscms', icon: 'shop', key: '9' },
                { title: '权限管理', content: '/bwadmin/jurisdictioncms', icon: 'shop', key: '10' },
                { title: '相关链接', content: '/bwadmin/relatedcms', icon: 'shop', key: '11' }
            ];
            const panes = [
                { title: '首页', content: '/bwadmin/homecms', key: '1', closable: false },
            ];
            return {
                selectedKeys: ['1'],
                activeKey: panes[0].key,
                path,
                panes,
                newTabIndex: 0,
            }
        },
        methods: {
            /*********************************************************************** 标签页 ***********************************************************************/
            callback(key) {
                console.log(key);
            },
            onChange(activeKey) {
                const path = this.panes.filter(pen => pen.key == activeKey)
                this.selectedKeys[0] = activeKey + ''
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
                this.panes = panes;
                this.activeKey = activeKey;
                this.selectedKeys[0] = activeKey + ''
                if (activeContent) this.$router.push(`${activeContent}`)
            },
            /*********************************************************************** 导航菜单 ***********************************************************************/
            onSelect({ item, key }) {
                this.selectedKeys[0] = key + ''
                let blo = false
                const paneslist = this.panes
                const panesItem = new Object()
                const newContent = this.path.filter(item => item.key == key)
                panesItem.title = `${item.$el.innerText}`
                panesItem.content = newContent[0].content
                panesItem.key = key
                paneslist.forEach(item => {
                    if (JSON.stringify(item) == JSON.stringify(panesItem)) {
                        blo = true
                    }
                })
                if (!blo) this.panes.push(panesItem)
                this.activeKey = key + ''
                this.$router.push(`${newContent[0].content}`)
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