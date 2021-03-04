/*
页面数据结构
[
    其中一页数据结构
    {
        name:'index',
        url:'',
        title:'',
        description:'',
        keywords:'',
        commonStyle: {
             backgroundColor: '',
             backgroundImage: '',
             backgroundSize: 'cover'
        },
        页面中的组件数据结构
        components:[
            其中一项组件的数据结构
            {
                comName:'',//组件名
                commonStyle: {}, // 公共样式，默认样式
                propsValue: {}, // 属性参数
                元素的数据结构
                elements:[
                    {
                        elName:'',//元素名
                        commonStyle: {}, // 公共样式，默认样式
                        propsValue: {}, // 属性参数
                        value: '', // 绑定值
                        valueType: 'String', // 值类型
                    }
                ]
            }
        ]

    }
]
*/
const state = () => ({	//state里面存放的是变量，如果你要注册全局变量，写这里

    //页面编辑器中的功能抽屉
    Menu: false,
    //功能抽屉中的模块
    Modle: true,
    //功能抽屉中的标题
    Title: '',


    //页面编辑器中的模块组
    ModelComponentsList: [
        {
            title: '网站导航',
            data: [
                {
                    title: '网站导航一',
                    image: 'http://qty83k.creatby.com/modules/covermini/4c64a73300148802b6e84c468a2a5a59_256.png',
                    component: 'BwSwiper1'
                },
                {
                    title: '网站导航二',
                    image: 'http://qty83k.creatby.com/modules/covermini/8a8924d4dd7ec2b35162e3136a753b2c_256.jpg',
                    component: 'BwSwiper2'
                }
            ]
        },
        {
            title: '轮播控件',
            data: [
                {
                    title: '网站导航二',
                    image: 'http://qty83k.creatby.com/modules/covermini/8a8924d4dd7ec2b35162e3136a753b2c_256.jpg',
                    component: 'BwSwiper2'
                }
            ]
        },
        {
            title: '网站页脚',
            data: [
                {
                    title: '网站导航一',
                    image: 'http://qty83k.creatby.com/modules/covermini/4c64a73300148802b6e84c468a2a5a59_256.png',
                    component: 'BwSwiper1'
                }
            ]
        },
        {
            title: '联系信息',
            data: [
                {
                    title: '网站导航二',
                    image: 'http://qty83k.creatby.com/modules/covermini/8a8924d4dd7ec2b35162e3136a753b2c_256.jpg',
                    component: 'BwSwiper2'
                },
                {
                    title: '网站导航一',
                    image: 'http://qty83k.creatby.com/modules/covermini/4c64a73300148802b6e84c468a2a5a59_256.png',
                    component: 'BwSwiper1'
                }
            ]
        },
        {
            title: '图文横幅',
            data: []
        }
    ],
    //模块组选区
    ModelComponents: [],


    //页面编辑器中的视图切换 desktop|tablet|mobile
    ViewBox: "desktop",


    /******************************************************************************** 页面管理 ********************************************************************************/
    pageList: [
        {
            name: 'index',
            url: '',
            title: '',
            description: '',
            keywords: '',
            components: [
                {
                    comName: 'BannerSwiper1',
                    commonStyle: { 'backgroundColor': 'red'},
                    porpsValue: {},
                    elements: [
                        {
                            uuid: '1',//唯一标识号
                            elName: 'slider',//元素名
                            commonStyle: {'backgroundColor':'yellow','display':'flex','justify-content':'center','align-items':'center','flex-direction': 'column'}, // 公共样式，默认样式
                            propsValue: {}, // 属性参数
                            value: 'http://qty83k.creatby.com/materials/95622/origin/365fe10fef96ef5a57b87e159ea5089b_origin.jpg', // 绑定值
                            valueType: 'String', // 值类型
                            contenteditable:false,//可编辑
                            elements: [
                                {
                                    uuid: '2',//唯一标识号
                                    elName: 'caption',//元素名
                                    commonStyle: {'color':'blue'}, // 公共样式，默认样式
                                    propsValue: {}, // 属性参数
                                    value: 'BMW CAR IS GOOD', // 绑定值
                                    valueType: 'String', // 值类型
                                    contenteditable:true,//可编辑
                                },
                                {
                                    uuid: '3',//唯一标识号
                                    elName: 'title',//元素名
                                    commonStyle: {'color':'blue'}, // 公共样式，默认样式
                                    propsValue: {}, // 属性参数
                                    value: 'Since 1998,we are lalal apple 270,0000 ueare products', // 绑定值
                                    valueType: 'String', // 值类型
                                    contenteditable:true,//可编辑
                                },
                                {
                                    uuid: '4',//唯一标识号
                                    elName: 'caption',//元素名
                                    commonStyle: {'color':'blue'}, // 公共样式，默认样式
                                    propsValue: {
                                        target:'_self'
                                    }, // 属性参数
                                    value: '链接跳转', // 绑定值
                                    valueType: 'String', // 值类型
                                    contenteditable:true,//可编辑
                                }
                            ]
                        }
                    ]
                },
                {
                    comName: 'EdiorSwiper1',
                }
            ]
        }
    ],
    //当前页面的索引
    currentpage: 0,
    //当前页面的组件库
    currentPageComponents: [],
    //当前组件的索引
    currentComponentIndex: 0,
    //当前组件内元素库的索引
    currentComponentsElementsIndex: 0,
    
});

const actions = {

    //切换当前页面组件列表
    switchCurrentComponents({ commit }, value) {
        commit('SWITCH_CURRENTCOMPONENTS', value)
    },
    //排序当前页面组件列表
    sortComponents({ commit }, val) {
        commit('SORT_COMPONENTS', val)
    },
    //移除当前页面组件列表中的组件
    deleteComponents({ commit }, val) {
        commit('DELETE_COMPONENTS', val)
    },
    //修改当前组件
    setCurrentComponents({commit},val){
        commit('SET_CURRENTCOMPONENTS', val)
    },
    //修改当前组件的索引
    setCurrentComponentIndex({commit},val){
        commit('SET_CURRENTCOMPONENTINDEX', val)
    }

}

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

    //修改模块组列表
    SET_ModelComponentsList(state, value) {
        state.ModelComponentsList = value
    },
    //修改模块组选区
    SET_ModelComponents(state, value) {
        state.ModelComponents = value
    },



    //修改编辑器中的视图样式
    SET_ViewBox(state, value) {
        state.ViewBox = value
    },


    //在页面管理中新增页面
    Add_PageList(state, value) {
        let newTitle
        const title = value.name
        const pagelist = state.pageList
        Judge_Similarity(pagelist, title)
        value.name = newTitle
        state.pageList.push(value)

        //在页面管理中判断是否有相同
        function Judge_Similarity(arr, value) {
            const title = value
            const findArray = arr.filter(item => item.name === title)
            if (findArray.length > 0) {
                const findTitle = findArray[0].name
                const name = findTitle.replace(/[^a-zA-Z]/ig, "")
                const num = findTitle.replace(/[^0-9]/ig, "")
                if (num) {
                    const newTitle = name + (Number(num) + 1)
                    Judge_Similarity(arr, newTitle)
                } else {
                    const newTitle = name + 1
                    Judge_Similarity(arr, newTitle)
                }
            } else {
                newTitle = title
            }
        }
    },
    //在页面管理中删除内容
    Delete_PageList(state, value) {
        state.pageList.splice(value, 1)
    },
    //在页面管理中替换内容
    Splice_PageList(state, { pageContent, isEitor }) {
        state.pageList.splice(isEitor, 1, pageContent)
    },
    //修改当前编辑页面的索引
    SET_Currentpage(state, value) {
        state.currentpage = value
    },
    //修改当前组件的索引
    SET_CURRENTCOMPONENTINDEX(state, value){
        state.currentComponentIndex = value
    },
    //切换当前编辑页面的组件列表
    SWITCH_CURRENTCOMPONENTS(state, value) {
        state.currentPageComponents = new Array()
        state.currentPageComponents = state.currentPageComponents.concat(state.pageList[value].components)
    },
    //修改当前编辑页面的组件列表
    SET_CURRENTCOMPONENTS(state,value){
        const currentComponentIndex=state.currentComponentIndex
        const currentElementsIndex=state.currentComponentsElementsIndex
        const newComponentItem=Object.assign({},state.currentPageComponents[currentComponentIndex])
        newComponentItem.elements[currentElementsIndex].elements=value
        state.currentPageComponents.splice(currentComponentIndex,1,newComponentItem)
    },
    //修改当前编辑页面的组件排序
    SORT_COMPONENTS(state, { comNum, move }) {
        const obj = Object.assign({}, state.currentPageComponents[comNum])
        if (move) {
            if (comNum !== 0) {
                state.currentPageComponents.splice(comNum, 1)
                state.currentPageComponents.splice(comNum - 1, 0, obj)
            }
        } else {
            const myLength = state.currentPageComponents.length
            if (comNum !== myLength) {
                state.currentPageComponents.splice(comNum, 1)
                state.currentPageComponents.splice(comNum + 1, 0, obj)
            }

        }
    },
    //移除当前编辑页面的组件
    DELETE_COMPONENTS(state, value) {
        state.currentPageComponents.splice(value, 1)
    }
};

const getters = {
    getCurrentComponents(state) {
        return state.currentPageComponents ? state.currentPageComponents : new Array()
    }
}

export default {
    namespaced: true,//命名空间
    actions,
    state,//这里你用到了哪几个属性就写哪几个，不需要的可以注释掉
    mutations,
    getters
};