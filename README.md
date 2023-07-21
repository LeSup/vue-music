# vue-music

基于 vue2 + vuex + vue-router 编写的一款音乐 app。

## 项目目录

``` bash
├── backend              // 应用后端服务
|  ├── serve.js
|  └── sign.js
├── index.html
├── package.json         // 项目信息
├── pnpm-lock.yaml
├── public
|  └── favicon.ico
├── README.md
├── src                  // 源码所在目录
|  ├── App.vue
|  ├── assets            // 静态资源
|  ├── bases             // 基础组件
|  ├── components        // 业务组件
|  ├── main.js           // 项目入口
|  ├── router            // 路由配置
|  ├── services          // 服务接口
|  ├── store             // 公共数据
|  ├── utils             // 工具
|  └── views             // 页面组件
└── vite.config.js       // vite配置
```

## 项目启动

`pnpm install` 安装项目依赖
`pnpm serve` 启动后端服务
`pnpm dev` 启动开发服务
