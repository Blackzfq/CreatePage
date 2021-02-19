<template>
    <div class="ThumbnailPanel">
        <div class="temp-create" @click="newPage">
            <a-icon type="plus" />
            <p class="paddingT10">新建页面</p>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'ThumbnailPanel',
        data() {

            return {

            }
        },
        methods:{
            newPage(){
                this.$router.push(`/bweditor/newPages/eitor`)
            }
        }
    }
</script>
<style scoped lang="scss">
    .ThumbnailPanel {
        width: 224px;
        height: 296px;
        border-radius: 4px;
        padding: 16px;
        overflow: hidden;
        background: #40a9ff;
        position: relative;
        transition: all 0.28s;

        &:hover {
            box-shadow: 0 0 16px 0 rgba(0, 0, 0, .16);
            transform: translate3d(0, -2px, 0);

            .anticon,
            .paddingT10 {
                color: #FFF;
            }
        }

        .temp-create {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border: 1px solid #FFFFFFA6;
            cursor: pointer;
            transition: all .3s;

            .anticon,
            .paddingT10 {
                color: #FFFFFFA6;
                transition: all .3s;
            }

            &:hover {
                border-color: #FFF;

                .anticon,
                .paddingT10 {
                    color: #FFF;
                }
            }
        }
    }
</style>