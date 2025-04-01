<template>
  <div class="app">
    <header class="app-header">
      <h1>Markdown 文章查看器</h1>
    </header>

    <main class="app-content">
      <div v-if="!postId" class="no-post">
        <p>请在 URL 中添加 ?postId=文章ID 来查看文章</p>
      </div>
      <MarkdownViewer v-else :postId="postId" />
    </main>

    <footer class="app-footer">
      <p>© 2023 Markdown 查看器 | 使用 Vue3 构建</p>
    </footer>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import MarkdownViewer from './components/MarkdownViewer.vue';

export default {
  name: 'App',
  components: {
    MarkdownViewer
  },
  setup() {
    const postId = ref('');

    onMounted(() => {
      // 从 URL 参数中获取 postId
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get('postId');

      if (id) {
        postId.value = id;
        console.log('加载文章:', id);
      } else {
        console.log('未提供 postId 参数');
      }
    });

    return {
      postId
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

.no-post {
  text-align: center;
  padding: 40px;
  color: #666;
  background-color: #f5f5f5;
  border-radius: 4px;
  margin: 20px 0;
}

.app-footer {
  background-color: #2c3e50;
  color: white;
  text-align: center;
  padding: 1rem;
  margin-top: auto;
}
</style>