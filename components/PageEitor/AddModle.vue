<template>
    <div class="AddModle">
        <ul class="addmodle_nav">
            <li v-for="(navitem,navindex) in $store.state.PagesEitorMenu.ModelComponentsList" @click="isActiveModle(navitem.data)">{{navitem.title}}</li>
        </ul>
        <ul class="addmodle_item">
            <li v-for="(modleitem,modleindex) in $store.state.PagesEitorMenu.ModelComponents" >
                <p>{{modleitem.title}}</p>
                <img :src="modleitem.image" :alt="modleitem.title" >
            </li>
        </ul>
    </div>
</template>
<script>
export default{
    name:'AddModle',
    data(){

        return{

        }
    },
    methods:{
        isActiveModle(val){
            this.$store.commit('PagesEitorMenu/SET_ModelComponents',val)
        }
    }
}
</script>
<style scoped lang="scss">
    .AddModle{
        display: grid;
        grid-template-columns:60px auto;
        column-gap: 20px;
        overflow: hidden;

        ul{
            list-style: none;
            padding-left:0;
        }

        ul.addmodle_nav{

            li{
                cursor: pointer;
                padding: 10px 2px;
                transition:all .3s;

                &:hover{
                    color: #FFF;
                    background-color: #001529;
                }
            }
        }

        ul.addmodle_item{

            li{
                cursor: pointer;
                margin-bottom: 15px;

                p{
                    margin-bottom: 0;
                }
            }

        }
    }
</style>
