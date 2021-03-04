<!-- 包裹在组件外的编辑框 -->
<template>
    <div class="BWEitor"  @mouseover="isMove=true" @mouseout="isMove=false" @click="getElement">
        <div class="tootl" v-show="isMove">
            <a-tooltip placement="bottom" title="设置" :get-popup-container="getPopupContainer">
                <a-icon type="setting" style="color:#fff;font-size: 20px;cursor: pointer;" @click.stop="setOption"/>
            </a-tooltip>
            <a-tooltip placement="bottom" title="上移" :get-popup-container="getPopupContainer">
                <a-icon type="arrow-up" style="color:#fff;font-size: 20px;cursor: pointer;" @click.stop="moveUp"/>
            </a-tooltip>
            <a-tooltip placement="bottom" title="下移" :get-popup-container="getPopupContainer">
                <a-icon type="arrow-down" style="color:#fff;font-size: 20px;cursor: pointer;" @click.stop="moveDown"/>
            </a-tooltip>
            <a-tooltip placement="bottom" title="删除" :get-popup-container="getPopupContainer">
                <a-icon type="delete" style="color:#fff;font-size: 20px;cursor: pointer;" @click.stop="onremove"/>
            </a-tooltip>
        </div>
        <slot name="components"></slot>
    </div>
</template>
<script>
    export default {
        name: 'BWEitor',
        props:{
            isKey:[String,Number]
        },
        data() {

            return {
                isMove:false,
                lastEle:undefined,
            }
        },
        methods: {
            getPopupContainer(trigger) {
                return trigger.parentElement;
            },
            getElement(e){
                this.$store.dispatch('PagesEitorMenu/setCurrentComponentIndex',this.isKey)
            },
            setOption(){
                this.$emit('setOption',this.isKey)
            },
            moveUp(){
                this.$emit('sortTop',this.isKey)
            },
            moveDown(){
                this.$emit('sortNext',this.isKey)
            },
            onremove(){
                this.$emit('onremove',this.isKey)
            }
        },
    }
</script>
<style scoped lang="scss">
    .BWEitor {
        position: relative;
        border: 1px dashed #666666;
        transition: all .3s;

        &:hover {
            border: 1px solid #001529;
        }

        .tootl {
            position: absolute;
            top: 0;
            right: 0;
            background-color: #001529;
            padding:5px 20px;
            z-index: 99;
        }
    }
</style>