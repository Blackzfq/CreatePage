<template>
    <div class="LinkEitor">
        <a-button-group>
            <a-dropdown>
                <a-menu slot="overlay">
                  <a-menu-item key="1">跳转页面</a-menu-item>
                  <a-menu-item key="2">在新窗口打开</a-menu-item>
                </a-menu>
                <a-button><a-icon type="link"/>链接</a-button>
            </a-dropdown>
            <a-dropdown>
                <a-menu slot="overlay" @click="handleTextMenuClick">
                  <a-menu-item key="4"><a-icon type="align-left" />居左</a-menu-item>
                  <a-menu-item key="5"><a-icon type="align-center" />居中</a-menu-item>
                  <a-menu-item key="6"><a-icon type="align-right" />居右</a-menu-item>
                </a-menu>
                <a-button><a-icon type="align-center" />排列</a-button>
            </a-dropdown>
            <a-dropdown>
                <a-menu slot="overlay" @click="handleTextMenuClick">
                  <a-menu-item key="7">小</a-menu-item>
                  <a-menu-item key="8">中</a-menu-item>
                  <a-menu-item key="9">大</a-menu-item>
                </a-menu>
                <a-button><a-icon type="font-size" />字号</a-button>
            </a-dropdown>
            <a-button>
                <colorPicker v-model="color"  v-on:change="headleChangeColor" />
            </a-button>
          </a-button-group>
    </div>
</template>
<script>
export default{
    name:'LinkEitor',
    props:{
        mykey:[String,Number],
        bwdata:Object
    },
    computed:{
        color(){
            return this.bwdata['color']
        }
    },
    data(){

        return{
            color: '#ff0000'
        }
    },
    methods:{
        handleTextMenuClick(e){
            const newStyle=new Object()
            switch(e.key){
                case '4':
                newStyle['align-self']='flex-start'
                break;
                case '5':
                newStyle['align-self']='center'
                break;
                case '6':
                newStyle['align-self']='flex-end'
                break;
                case '7':
                newStyle['font-size']='16px'
                break;
                case '8':
                newStyle['font-size']='24px'
                break;
                case '9':
                newStyle['font-size']='36px'
                break;
            }
            this.$emit('setTextStyle',newStyle,this.mykey)
        },
        headleChangeColor(val){
            const newStyle=new Object()
            newStyle['color']=val
            this.$emit('setTextStyle',newStyle,this.mykey)
        }
    }
}
</script>
<style scoped lang="scss">
</style>
