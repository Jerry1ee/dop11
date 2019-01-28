// 以下文件格式为描述路由的协议格式
// 你可以调整 routerConfig 里的内容
// 变量名 routerConfig 为 iceworks 检测关键字，请不要修改名称

import BasicLayout from '../layouts/BasicLayout';
import Projects from '../pages/Projects';
import {Pipeline, PipelineInfo} from '../pages/Pipeline';
import NotFound from '../pages/NotFound';

const routerConfig = [
    {
        path: '/',
        layout: BasicLayout,
        component: Projects,
    },{
        path: '/pipeline',
        layout: BasicLayout,
        component: Pipeline,
    },{
        path: '/pipeline/new',
        layout: BasicLayout,
        component: PipelineInfo,
    },
    {
        path: '*',
        layout: BasicLayout,
        component: NotFound,
    },
];

export default routerConfig;
