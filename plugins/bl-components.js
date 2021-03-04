// 组件库入口
import BannerSwiper1 from '@/components/ComponentsLibrary/BannerSwiper/BannerSwiper1'
import EdiorSwiper1 from '@/components/ComponentsLibrary/BannerSwiper/EdiorSwiper1'


//所有组件列表
const components=[
    BannerSwiper1,
    EdiorSwiper1
]

//定义install方法，接受Vue作为参数
const install=function(Vue){
    // 判断是否安装，安装过就不继续往下执行
    if (install.installed) return
	install.installed = true
	// 遍历注册所有组件
	components.map(component => Vue.component(component.name, component))
}

// 检测到 Vue 才执行，毕竟我们是基于 Vue 的
if (typeof window !== 'undefined' && window.Vue) {
	install(window.Vue)
}

let _bl_register_components_object = {}
components.forEach(item => {
	_bl_register_components_object[item.name] = item
})

export{
    BannerSwiper1,
    EdiorSwiper1,
    _bl_register_components_object
}

export default{
    install,
	// 所有组件，必须具有 install，才能使用 Vue.use()
}