<template>
    <div class="bw-AnimationSvg">
        <h1>Welcome to our <strong>Website</strong></h1>
        <h2>Login to acces your account</h2>
    </div>
</template>
<script>
export default{
    name:'AnimationSvg',
    data(){

        return{

        }
    }
}
</script>
<style scoped lang="scss">
    .bw-AnimationSvg{
        background: transparent url('~assets/image/cool-background.png') no-repeat center;
        background-size: cover;
        padding:0 10%;
    }
    h1{
        color: #FFF;
        font-size: 52px;
        line-height: 120%;
        margin-bottom: 0;
        margin-top: 30%;
    }

    h2{
        color: rgba(255, 255, 255, 0.842);
    }
</style>
