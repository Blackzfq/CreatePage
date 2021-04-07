import { Axios, Https } from "~/assets/axios/index.js";

//    ================测试专用================
export function user_GetList(params) {
    return Https.get(`https://randomuser.me/api`, { params })
}

// // ================用户管理================

// 登录
export function login(data) {
    return Axios.post(`api/ad/oauth/token`, data);
}

// // 查看用户
// export function  userinfo(){
//     return Axios.get(`api/ad/users/_`);
// }

// //更新用户
// export function  updateuserinfo(data){
//     return Axios.post(`api/ad/users/_update`,data);
// }

// //添加用户
// export function  adduser(data){
//     return Axios.post(`api/ad/users`,data);
// }

// //验证邮箱唯一性
// export function  validationemail(params){
//     return Axios.get(`api/ad/users/email/_validity`,{params});
// }

// // ================博客管理================
// //管理员

// *新增博客
export function addBlog(data) {
    return Axios.post(`api/ad/blogs`, data);
}

// *删除博客
export function delBlog(params) {
    return Axios.delete(`api/ad/blogs/_delete`, { params });
}

// *修改博客信息
export function updataBlog(id, data) {
    return Axios.post(`api/ad/blogs/${id}/_update`, data);
}

// *查看博客列表
export function getBlogList(params) {
    return Axios.get(`api/ad/blogs`, { params });
}

// *查看博客详情
export function getBlogInfo(id) {
    return Axios.get(`api/ad/blogs/${id}`);
}

// export function addNewBlog(data) {
//     return Axios.post(`api/ad/articles`, data)
// }

// export function getBlogList(params) {
//     return Axios.get(`api/ad/articles`, { params })
// }

// export function upDateBlog(id, data) {
//     return Axios.post(`api/ad/articles/${id}/_update`, data)
// }

// export function deleteBlog(params) {
//     return Axios.delete(`api/ad/articles/_delete`, { params })
// }

// export function getBlogDetails(data) {
//     return Axios.get(`api/ad/articles/${data}`)
// }

// //客户
// export function user_GetBlogList(params) {
//     return Https.get(`http://xintai.api.lanjingshuzi.com/api/articles`, { params })
// }

// export function user_GetBlogDetails(data) {
//     return Https.get(`http://xintai.api.lanjingshuzi.com/api/articles/${data}`)
// }

// **********************博客分类***********************

// *新增博客分类
export function addBlogType(data) {
    return Axios.post(`api/ad/blog/types`, data);
}

// *根据分类id删除当前分类
export function delBlogType(id) {
    return Axios.delete(`api/ad/blog/types/${id}`);
}

// *修改博客分类
export function updateBlogType(id, data) {
    return Axios.put(`api/ad/blog/types/${id}`, data);
}

// *查看博客分类列表
export function getBlogTypeList(data) {
    return Axios.get(`api/blog/types`, data);
}

// *查看博客分类详情
export function getBlogTypeInfo(id, config) {
    return Axios.get(`api/blog/types/${id}`, config);
}

// **********************博客评论***********************

// *新增/回复博客评论
export function addComment(data){
    return Axios.post(`api/blog/comments`, data);
  }
  
  // *删除博客评论
  export function delComment(id){
    return Axios.delete(`api/ad/blog/comments/${id}`);
  }
  
  // *修改评论
  export function updateComment(id,data){
    return Axios.put(`api/ad/blog/comments/${id}`,data)
  }
  
  // *查看评论
  export function getComment(params){
    return Axios.get(`api/ad/blog/comments`,{params})
  }
  
  // *查看评论详情
  export function getCommentInfo(id){
    return Axios.get(`api/ad/blog/comments/${id}`)
  }

// ================商品分类================

export function addNewCommoditiesSort(data, config) {
    return Axios.post(`api/ad/commodity/types`, data, config)
}

export function getCommoditiesSort() {
    return Axios.get(`api/commodity/types`)
}

export function getCommoditiesSortDetails(data, config) {
    return Axios.get(`api/commodity/types/${data}`, { params: {} }, config)
}

export function upDataCommoditiesSort(id, data, config) {
    return Axios.post(`api/ad/commodity/types/${id}/_update`, data, config)
}

export function deleteCommoditiesSort(data) {
    return Axios.delete(`api/ad/commodity/types/${data}`)
}

// //客户
// export function user_getCommoditiesSort(params) {
//     return Https.get(`http://xintai.api.lanjingshuzi.com/api/commodity/types`, { params })
// }

// export function user_getCommoditiesDetails(id){
//     return Https.get(`http://xintai.api.lanjingshuzi.com/api/commodity/types/${id}`)
// }
// // ================商品操作================

export function addNewCommodity(data) {
    return Axios.post(`api/ad/commodities`, data)
}

export function getCommodity(params) {
    return Axios.get(`api/ad/commodities`, { params })
}

export function upDataCommodity(id, data) {
    return Axios.post(`api/ad/commodities/${id}/_update`, data)
}

export function deleteCommodity(params) {
    return Axios.delete(`api/ad/commodities/_delete`, { params })
}

// export function getCommodityDetails(data) {
//     return Axios.get(`api/ad/commodities/${data}`)
// }

export function copyCommodity(id) {
    return Axios.get(`api/ad/commodities/${id}/_copy`)
}

export function batchCommodity(data) {
    return Axios.post(`api/ad/commodities/batch/_handle`, data)
}


// //客户
// export function user_GetCommodityList(params) {
//     return Https.get(`http://xintai.api.lanjingshuzi.com/api/commodities`, { params })
// }

// export function user_GetCommodityDetails(data) {
//     return Https.get(`http://xintai.api.lanjingshuzi.com/api/commodities/${data}`)
// }

// // ================海报轮播================

// export function addSlides(data) {
//     return Axios.post(`api/ad/rotation/charts`, data)
// }

// export function getSlides(data) {
//     if (data) {
//         return Axios.get(`api/rotation/charts/${data}`)
//     } else {
//         return Axios.get(`api/rotation/charts`)
//     }
// }

// export function upDataSildes(id, data) {
//     return Axios.post(`api/ad/rotation/charts/${id}/_update`, data)
// }

// export function deteleSildes(data) {
//     return Axios.delete(`api/ad/rotation/charts/${data}`)
// }


// //客户

// export function user_GetSildes() {
//     return Https.get(`http://xintai.api.lanjingshuzi.com/api/rotation/charts`)
// }
// // ================表单操作================

// export function addDemands(data) {
//     return Https.post(`http://xintai.api.lanjingshuzi.com/api/demands`, data)
// }

// export function getDemands(params) {
//     return Axios.get(`api/ad/demands`, { params })
// }

// export function upDataDemands(data) {
//     return Axios.put(`api/ad/demands/_`, data)
// }

// export function deleteDemands(params) {
//     return Axios.delete(`api/ad/demands/_delete`, { params })
// }

// // ================订阅管理================

// export function addSubscribes(data){
//     return Https.post(`http://xintai.api.lanjingshuzi.com/api/subscribes`,data)
// }

// export function upSubscribes(data){
//     return Axios.put(`api/ad/subscribes`,data)
// }

// export function deleteSubscribes(params) {
//     return Axios.delete(`api/ad/subscribes/_delete`, { params })
// }

// export function getSubscribesList(params){
//     return Axios.get(`api/ad/subscribes`, { params })
// }

// export function user_getSubscribesList(params){
//     return Https.get(`http://xintai.api.lanjingshuzi.com/api/ad/subscribes`, { params })
// }

// export function getSubscribesDetile(id){
//     return Axios.get(`api/ad/subscribes/${id}`)
// }

// export function user_getSubscribesDetile(id){
//     return Https.get(`http://xintai.api.lanjingshuzi.comapi/ad/subscribes/${id}`)
// }

// export function downSubscribesList(){
//     return Axios.get(`api/ad/subscribes/_export`)
// }

// // ================视频管理================
// export function getVideos(params){
//     return Axios.get(`api/ad/videos`,{params})
// }

// export function getVideoDetails(id){
//     return Axios.get(`api/ad/videos/${id}`)
// }

// export function addVideo(data){
//     return Axios.post(`api/ad/videos`,data)
// }

// export function deleteVideo(params){
//     return Axios.delete(`api/ad/videos/_delete`,{params})
// }

// export function upDataVideo(id,data){
//     return Axios.put(`api/ad/videos/${id}`,data)
// }

// //客户
// export function user_GetVideos(params){
//     return Https.get(`http://xintai.api.lanjingshuzi.com/api/videos`,{params})
// }

// // ================详情汇总================

// export function getSummaries(data) {
//     return Axios.get(`api/ad/summaries/_?type=${data}`)
// }

// // ================媒体库管理================

export function getMedioList(params) {
    return Axios.get('api/ad/files', { params })
}

export function upMedioFiles(data, config) {
    return Axios.post('api/ad/files', data, config)
}

// // ================标签库管理================

export function getCommodityLabelList(params) {  //商品标签
    return Axios.get('api/ad/tags', { params })
}

export function addCommodityLabel(data) {
    return Axios.post(`api/ad/tags`, data)
}

// *新增博客标签
export function addBlogTags(data) {
    return Axios.post(`api/ad/blog/tags`, data);
}

// *查看博客标签列表
export function getBlogTagsList(params) {
    return Axios.get(`api/blog/tags`, {params});
}

// // ================公共方法================
// export function getOssSignatures(params) {
//     return Axios.get(`api/ad/aliOss/signatures`, { params })
// }

// export function upFiletoAlioss(data) {
//     return Https.post(`https://xintai-test-public.oss-cn-hangzhou.aliyuncs.com`, data)
// }

// export function deleteToAlioss(id){
//     return Axios.delete(`api/ad/aliOss/${id}/_delete`)
// }

// //=================页面监控================
// export function getPagesViews(data) {
//     return Https.post(`http://xintai.api.lanjingshuzi.com/api/views`, data)
// }

// export function getPagesNews(url) {
//         return url?Axios.get(url):Axios.get(`api/ad/views`)
// }

// export function getAllSummaries(){
//     return Axios.get(`api/ad/summaries`)
// }