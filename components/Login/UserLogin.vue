<template>
    <div class="bw-UserLogin">
        <LoginForm/>
        <div class="hint">
            <h3>Warring!</h3>
            <p>This system is still in the test stage, all accounts are invitation mechanism, not open to the public, all functions do not represent the final effect</p>
            <!-- <p>本系统尚处于测试阶段,所有账号为邀请机制，暂未对外开放，所有功能并不代表最终效果</p> -->
        </div>
    </div>
</template>
<script>
export default{
    name:'UserLogin',
    data(){

        return{

        }
    }
}
</script>
<style scoped lang="scss">
    .bw-UserLogin{
        background-color: rgb(239, 242, 247);
        padding: 8%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .hint{
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
    }

    h3{
        text-transform: capitalize;
        font-size: 24px;
        color: orange;
        font-weight: bolder;
        margin-bottom: 5px;
    }

    p{
        font-size: 14px;
        font-weight: bold;
    }
</style>
