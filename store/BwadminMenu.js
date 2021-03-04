const state = () => ({	//state里面存放的是变量，如果你要注册全局变量，写这里

    selectedKeys:[],
    panes:[],
    openKeys:[],

});
const getters = {     //getters相当于是state的计算属性，如果你需要将变量的值进行计算，然后输出，写这里

};
const mutations = {       //修改store中的变量的方法，如果你要改变变量的值，就写这（vuex中state中的值不能直接修改）
    
    SET_SELECTEDKEYS(state,val){
        state.selectedKeys[0]=val
    },

    SET_PANES(state,val){
        state.panes=val
    },

    PUSH_PANES(state,val){
        state.panes.push(val)
    },

    SET_OPENKEYS(state,val){
        state.openKeys=val
    }

};
const actions = {//actions提交的是mutations，相当于就是改变变量的方法的重写，但是，actions是可以进行异步操作的

resetSelectedKeys({commit}){
    commit('SET_SELECTEDKEYS','1')
},

resetPanes({commit}){
    const item={ 
        title: '首页', 
        content: '/bwadmin/homecms', 
        key: '1', 
        closable: false 
    }
    commit('SET_PANES',[item])
},

setSelectedKeys({commit},val){
    commit('SET_SELECTEDKEYS',val)
},

setPanes({commit},val){
    commit('SET_PANES',val)
},

pushPanes({commit},val){
    commit('PUSH_PANES',val)
},

setOpenKeys({commit},val){
    commit('SET_OPENKEYS',val)
},

};

export default {
    namespaced:true,//命名空间
    state,//这里你用到了哪几个属性就写哪几个，不需要的可以注释掉
    getters,
    actions,
    mutations
};