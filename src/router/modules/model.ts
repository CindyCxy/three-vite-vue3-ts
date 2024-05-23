const ModelRouter = {
    path:'/model',
    name: 'model',
    component: () => import('../../views/model/index.vue'),
    meta: {
            title: '模型'
    }
}

export default ModelRouter