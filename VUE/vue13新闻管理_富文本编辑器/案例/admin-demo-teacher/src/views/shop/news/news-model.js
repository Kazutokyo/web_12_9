//请结合store/index.js中查看，本文件是通过在store/index.js中引入到vuex中并注册模块的
//先打开store/index.js查看引入方式
// 导入user-api中定义的调用接口方法，结合文件和接口文档查看
import {
    deleteNewsById,
    findNewsById,
    getNewsListForPage,
    insertNews,
    updateNews
} from '../../../api/news-api.js';
import {
    getNewsTypeList
} from '../../../api/news-type-api';
// 导出当前模块的对象
export default {
    // 开启命名空间模式，开启之后mapState等方法才能通过模块名称自动映射数据
    namespaced: true,
    // 定义了调用接口返回时需要存储的数据对象
    // state定义的对象相当于vue中定义的data属性，他自带响应式监听
    //state通过mapState绑定在vue对象的computed中，所以state在vue对象中默认是一个只读对象
    state: {
        list: [], //接口查回的table的数据
        page: { //接口返回的分页信息
            pno: 1,
            psize: 10,
            pCount: 0,
            totalElements: 0
        },
        newsTypeList: []
    },
    // mutations中定义的对象只有一个功能就是给state中定义的属性赋值
    // 这里是一个固定写法，我们通过mapState得到的属性都是只读属性，所以如果相对其赋值的话需要通过
    // mutations中定义的方法来对state中指定的属性赋值
    //mutation中的函数通过mapMutations绑定在vue对象中的methods中当成函数调用
    mutations: {
        // 设置state中的list数据
        setList(state, list) {
            state.list = list;
        },
        // 设置state中的page数据
        setPage(state, page) {
            state.page = page
        },
        // 设置state
        setNewsTypeList(state, newsTypeList) {
            state.newsTypeList = newsTypeList
        }
    },

    actions: {
        // 分页查询
        //actions中的函数参数分两部分，第一个参数中可以通过{commit,dispatch}来调用其他的mutations和actions
        //第二个参数就是在vue文件中调用这个函数时传入的参数，如果参数是多个可以传入一个json对象
        async getListForPage({
            commit
        }, queryForm) {
            // 调用用户的分页查询接口
            let res = await getNewsListForPage(queryForm);
            if (res.data.code == 200) {
                // 当接口返回的code为200时，将查询的结果list（列表数据）和page（分页信息）通过
                //调用对应的mutations中的函数设置到list和page中
                commit('setList', res.data.data.list)
                commit('setPage', res.data.data.page)
            }
        },
        // 根据id删除数据的业务函数
        async deleteById({}, id) {
            await deleteNewsById(id)
        },
        async getNewsTypeListAll({
            commit
        }) {
            let res = await getNewsTypeList()
            if (res.data.code == 200) {
                commit('setNewsTypeList', res.data.data.list)
            }
        },
        async insert({}, addForm) {
            await insertNews(addForm)
        },
        async findById({}, id) {
            let res = await findNewsById(id)
            if (res.data.code == 200) {
                return res.data.data
            } else {
                return {}
            }
        },
        async update({}, addForm) {
            await updateNews(addForm)
        },

    }
}