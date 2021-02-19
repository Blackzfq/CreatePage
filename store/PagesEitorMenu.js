const state = () => ({	//state里面存放的是变量，如果你要注册全局变量，写这里
    
    //页面编辑器中的功能抽屉
    Menu:false,
    //功能抽屉中的模块
    Modle:true,
    //功能抽屉中的标题
    Title:''

});
const mutations = {       //修改store中的变量的方法，如果你要改变变量的值，就写这（vuex中state中的值不能直接修改）

    //开关功能抽屉
    SET_Menu(state, value) {
        state.Menu = value
    },
    //切换抽屉中的模块
    SET_Modle(state, value) {
        state.Modle = value
    },
    //修改抽屉中的标题
    SET_Title(state, value) {
        state.Title = value
    },
};

export default {
    namespaced: true,//命名空间
    state,//这里你用到了哪几个属性就写哪几个，不需要的可以注释掉
    mutations
};