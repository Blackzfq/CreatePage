export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'BWCreatePages',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '响应式网站设计，网页设计制作工具，自助建站，建站系统，模块建站，模板建站，傻瓜建站，企业官网建站' },
      { hid: 'description', name: 'description', content: '专业级响应式网页设计制作软件工具，全自由度网页设计、自助建站工具' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/css/transition.css',
    'ant-design-vue/dist/antd.css',
    'normalize.css/normalize.css',
    'swiper/css/swiper.css',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/antd-ui',
    '@/plugins/swiper',
    '@/plugins/animated',
    '@/plugins/excel.js',
    {src:'@/plugins/clipboard',ssr:false},
    { src: '@/plugins/cropper', ssr: false },
    { src: '@/plugins/vcolorpicker.js', ssr: false },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    // analyze: true,
    publicPath: '/.nuxt/dist/client'
  }
}
