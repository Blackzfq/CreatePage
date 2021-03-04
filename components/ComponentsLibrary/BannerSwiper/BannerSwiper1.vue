<template>
    <div class="BannerSwiper1" :style="commonStyle">
        <div class="bannerSilder" :style="bannerSilderStyle">
            <a-popover trigger="click" :get-popup-container="getPopupContainer">
                <template slot="content">
                    <TextEitor :mykey="caption.uuid" :bwdata="caption.commonStyle" @setTextStyle="setTextStyle" />
                </template>
                <h1 :style="caption.commonStyle" :contenteditable="caption.contenteditable"
                    @input="getInner($event,caption.uuid)" @blur="onBlur(caption.uuid)">{{caption.value}}</h1>
            </a-popover>
            <a-popover trigger="click" :get-popup-container="getPopupContainer">
                <template slot="content">
                    <TextEitor :mykey="title.uuid" :bwdata="title.commonStyle" @setTextStyle="setTextStyle" />
                </template>
                <p :style="title.commonStyle" :contenteditable="title.contenteditable"
                    @input="getInner($event,title.uuid)" @blur="onBlur(title.uuid)">{{title.value}}</p>
            </a-popover>
            <a-popover trigger="click" :get-popup-container="getPopupContainer">
                <template slot="content">
                    <LinkEitor :mykey="button.uuid" :bwdata="button.commonStyle" @setTextStyle="setTextStyle"/>
                </template>
                <a href="http://www.baidu.com" :style="button.commonStyle" :contenteditable="button.contenteditable"
                    @input="getInner($event,button.uuid)" @blur="onBlur(button.uuid)">{{button.value}}</a>
            </a-popover>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'BannerSwiper1',
        props: {
            commonStyle: {
                type: Object,
                default: function () {
                    return new Object()
                }
            },
            propsValue: {
                type: Object,
                default: function () {
                    return new Object()
                }
            },
            elements: {
                type: Array,
                default: function () {
                    return new Array()
                }
            }
        },
        computed: {
            currentComponentIndex() {
                return this.$store.state.currentComponentsElementsIndex
            },
            bannerSilderStyle() {
                const style = this.elements[this.currentElementsIndex].commonStyle
                const backgroundImage = `url(${this.elements[this.currentElementsIndex].value})`
                style.backgroundImage = backgroundImage
                return style
            },
            caption() {
                const myh1 = this.elements[this.currentElementsIndex].elements.filter(item => item.uuid === '2')
                return myh1[0]
            },
            title() {
                const myp = this.elements[this.currentElementsIndex].elements.filter(item => item.uuid === '3')
                return myp[0]
            },
            button() {
                const mybut = this.elements[this.currentElementsIndex].elements.filter(item => item.uuid === '4')
                return mybut[0]
            }
        },
        watch: {
            currentComponentIndex(newVal) {
                this.currentElementsIndex = newVal
            }
        },
        data() {
            return {
                visible: false,
                currentElementsIndex: 0,
                ElementsItem: undefined,
            }
        },
        methods: {
            getPopupContainer(trigger) {
                return trigger.parentElement;
            },
            //失去焦点
            onBlur(key) {
                if (this.ElementsItem) {
                    this.saveElement(key, this.ElementsItem)
                    this.ElementsItem = undefined
                }
            },
            //更改输入文案
            getInner(e, uuid) {
                const textContent = e.target.innerHTML
                if (this.ElementsItem) {
                    this.ElementsItem.value = textContent
                } else {
                    const elementsItem = this.judgeItem(uuid)
                    const newElementsItem = this.eitorItem(textContent, elementsItem)
                    this.ElementsItem = Object.assign({}, newElementsItem)
                }
            },
            //更改文案样式
            setTextStyle(commonStyle, uuid) {
                const textStyle = commonStyle
                if (this.ElementsItem) {
                    this.ElementsItem.commonStyle = Object.assign({}, this.ElementsItem.commonStyle, textStyle)
                } else {
                    const elementsItem = this.judgeItem(uuid)
                    const newElementsItem = this.eitorItem(textStyle, elementsItem)
                    this.ElementsItem = Object.assign({}, newElementsItem)
                }
                this.onBlur(uuid)
            },
            //查找修改项
            judgeItem(key) {
                return this.elements[this.currentElementsIndex].elements.filter(item => item.uuid === key)[0]
            },
            //判断修改的内容
            eitorItem(val, obj) {
                const newElementsItem = Object.assign({}, obj)

                if (typeof (val) == 'string') {//修改文案
                    newElementsItem.value = val
                } else {//修改样式
                    newElementsItem.commonStyle = Object.assign({}, newElementsItem.commonStyle, val)
                }

                return newElementsItem
            },
            //将修改内容存储到Vuex的 当前页面的组件库
            saveElement(key, item) {
                const elementsList = this.elements[this.currentElementsIndex].elements.filter(item => item.uuid !== key)
                elementsList.push(item)
                this.$store.dispatch('PagesEitorMenu/setCurrentComponents', elementsList)
            }
        }
    }
</script>
<style scoped lang="scss">
    .BannerSwiper1 {
        width: 100%;
        height: 100vh;

        .bannerSilder {
            height: 100%;
        }
    }
</style>