# 使用Travis和ghpage实现自动部署

尽管过了有一段时间了，但是还是得做个记录，免得以后再走弯路

大体的实现方式是通过Travis启动自动构建，并把构建出的dist目录推到GitHub上



## Travis

启用Travis的自动构建就是直接创建一个新的文件`.travis.yml`

```yml
language: node_js
node_js:
  - "node"

install:
  - npm install

script:
  - npm run build

after_script:
  # 部署
  - cd ./dist
  - git init
  - git config user.name $U_NAME
  - git config user.email $U_EMAIL
  - git add .
  - git commit -m "Update Blog By TravisCI With Build $TRAVIS_BUILD_NUMBER"
  # Github Pages
  - git push --force --quiet "https://$GITHUB_TOKEN@${GH_REF}" master:master
  # Github Pages
  - git push --quiet "https://$GITHUB_TOKEN@${GH_REF}" master:master --tags

branches:
  only:
    - master

deploy:
 provider: pages
 skip_cleanup: true
 keep_history: true
 github_token: $GITHUB_TOKEN
 local_dir: dist
 on:
   branch: master
```

里面写上命令，这个可以参考Vue-cli[官方教程](https://cli.vuejs.org/zh/guide/deployment.html#github-pages)，大体上差不多

- 先指定类型，npm安装组件，build

- 部署，cd到输出目录（附个配置），然后把目录里的东西推到仓库

  ```js
  publicPath: '/',
  outputDir: 'dist',
  ```


和官方给的稍微有点差别，一个是需要配置自己的用户名和邮箱，否则会有推送权限上的问题（好像）

之后的流程比如关联travis和github，配置travis参数什么的就略了，网上太多了



## ghpage

还有一个，是作为gitpages小白，查了半天以后才了解的

如果想让项目部署到`username.github.io`，那么对应的仓库名是`username.github.io`，也就是说我必须把项目构建生成的文件推到这个目录上

其它所有不是该名字的仓库，对应的ghpage都是`username.github.io/<reponame>`

这个算是个大坑吧，弄了很久才搞明白

配置完以后，以后每次只要无脑push就好了