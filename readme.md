# 前端性能监控SDK

## 目录结构

SDK：核心文件

test：测试文件

## 步骤

1. npm start 启动 express 服务

2. npm run build 使用 rollup 打包

3. 使用 liveServer 进行用户行为、错误收集、性能监控的测试

4. vue 与 react 测试如下

   ```react
   // vue
   import monitor from 'SDK';
   app.use(monitor, {
       url: 'http://localhost:9800/reportData',
   });
   
   // react
   <script src="./monitor.js"></script>
   componentDidCatch(error, info) {
       monitor.errorBoundary(error,info.componentStack);
   }
   ```