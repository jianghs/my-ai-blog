<template>
  <div class="app">
    <header class="app-header">
      <h1>Markdown 文章查看器</h1>
    </header>

    <main class="app-content">
      <MarkdownViewer :filePath="markdownFilePath" />
    </main>

    <footer class="app-footer">
      <p>© 2023 Markdown 查看器 | 使用 Vue3 构建</p>
    </footer>
  </div>
</template>

<script>
import { ref } from 'vue';
import MarkdownViewer from './components/MarkdownViewer.vue';

export default {
  name: 'App',
  components: {
    MarkdownViewer
  },
  setup() {
    // 这里设置 Markdown 文件路径
    // 在实际应用中，可以通过路由参数或其他方式动态设置
    const markdownFilePath = ref('/test.md');

    return {
      markdownFilePath
    };
  }
};
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f9f9f9;
}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  background-color: #2c3e50;
  color: white;
  padding: 1rem;
  text-align: center;
}

.app-content {
  flex: 1;
  padding: 20px;
  background-color: white;
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.app-footer {
  background-color: #2c3e50;
  color: white;
  text-align: center;
  padding: 1rem;
  margin-top: auto;
}
</style>