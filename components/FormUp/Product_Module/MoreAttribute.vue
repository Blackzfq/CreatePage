<template>
    <div class="MoreAttribute">
        <a-checkbox @change="onChange">
            此产品有多个选项，例如不同的尺寸或颜色
        </a-checkbox>
        <div class="checkeitor_box" v-if="visible">
            <a-divider />
            <a-input-group compact v-for="(groupItem,groupIndex) in attributeData" :key="groupIndex" style="margin-bottom: 15px;">
                <a-input style="width: 20%" placeholder="选项名称" />
                <a-select mode="tags" style="width: 80%" :token-separators="[',']" @change="handleChange">
                </a-select>
            </a-input-group>
            <a-divider />
            <a-button @click="addAttributeData">
                添加其他选项
            </a-button>
            <a-divider />
            预览
        </div>
    </div>
</template>
<script>
    export default {
        name: 'MoreAttribute',
        data() {

            return {
                visible:false,
                attributeData:['1'],
            }
        },
        methods: {
            onChange(e){
                this.visible=e.target.checked
            },
            handleChange(value) {
                console.log(`selected ${value}`);
            },
            addAttributeData(){
                this.attributeData.push('1')
            }
        },
    }
</script>
<style scoped lang="scss">
</style>