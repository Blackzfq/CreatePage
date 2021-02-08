<template>
    <div class="bw-login-background">
        <div class="bw-login-box">
            <UserLogin/>
            <AnimationSvg/>
        </div>
    </div>
</template>
<script>
export default{
    name:'Login',
    layout:'Login',
    data(){

        return{

        }
    }
}
</script>
<style scoped lang="scss">
    .bw-login-background{
        min-width:1200px;
        height: 100vh;
        overflow-y: hidden;
        background-color: rgb(50, 123, 233);
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 30px;
    }

    .bw-login-box{
        background-color: #fff;
        min-height: 600px;
        max-width: 1200px;
        width: 1200px;
        display: grid;
        grid-template-columns: 35% 65%;
        /* padding: 20px; */
        box-shadow: 8px 8px 10px;
        border-radius: 10px;
        overflow: hidden;
    }
</style>
