<template>
  <div class="markdown-viewer">
    <div v-if="isLoading" class="loading">
      <p>加载中...</p>
    </div>
    <div v-else>
      <!-- 文章头部 -->
      <header class="article-header">
        <h1 class="article-title">{{ metadata.title || '无标题' }}</h1>
        <div class="article-meta">
          <span v-if="metadata.date">发布于：{{ formatDate(metadata.date) }}</span>
          <span v-if="metadata.author">作者：{{ metadata.author }}</span>
          <span v-if="metadata.category">分类：{{ metadata.category }}</span>
        </div>
        <div v-if="metadata.tags" class="article-tags">
          <a
            v-for="(tag, index) in parseTags(metadata.tags)"
            :key="index"
            href="#"
            class="tag"
          >
            {{ tag }}
          </a>
        </div>
        <p v-if="metadata.description" class="article-description">
          {{ metadata.description }}
        </p>
      </header>

      <!-- 文章内容 -->
      <div v-highlight class="article-content" v-html="htmlContent"></div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { parseMarkdown } from '../utils/markdownService';

export default {
  name: 'MarkdownViewer',
  props: {
    filePath: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const metadata = ref({});
    const htmlContent = ref('');
    const isLoading = ref(true);

    // 格式化日期
    const formatDate = (dateString) => {
      try {
        const date = new Date(dateString);
        // 添加8小时的时区偏移
        const localDate = new Date(date.getTime() + 8 * 60 * 60 * 1000);
        return localDate.toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit' // 添加秒的显示
        });
      } catch (e) {
        return dateString;
      }
    };

    // 解析标签
    const parseTags = (tags) => {
      if (typeof tags === 'string') {
        return tags.split(',').map(tag => tag.trim());
      }
      return Array.isArray(tags) ? tags : [];
    };

    // 加载 Markdown 文件
    const loadMarkdownFile = async () => {
      try {
        isLoading.value = true;
        const response = await fetch(props.filePath);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const content = await response.text();
        const { metadata: meta, htmlContent: html } = parseMarkdown(content);

        metadata.value = meta;
        htmlContent.value = html;
      } catch (error) {
        console.error('加载 Markdown 文件时出错:', error);
        htmlContent.value = `<p class="error">加载文件时出错: ${error.message}</p>`;
      } finally {
        isLoading.value = false;
      }
    };

    onMounted(() => {
      loadMarkdownFile();
    });

    return {
      metadata,
      htmlContent,
      isLoading,
      formatDate,
      parseTags
    };
  }
};
</script>

<style scoped>
.markdown-viewer {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}

.article-header {
  margin-bottom: 30px;
  border-bottom: 1px solid #eee;
  padding-bottom: 20px;
}

.article-title {
  font-size: 2.2em;
  margin-bottom: 10px;
  color: #333;
}

.article-meta {
  color: #666;
  font-size: 0.9em;
  margin-bottom: 10px;
}

.article-meta span {
  margin-right: 15px;
}

.article-description {
  color: #555;
  font-size: 1.1em;
  margin-top: 15px;
  font-style: italic;
}

.article-tags {
  margin-top: 10px;
}

.tag {
  display: inline-block;
  background-color: #f1f1f1;
  padding: 3px 8px;
  border-radius: 3px;
  font-size: 0.8em;
  margin-right: 5px;
  margin-bottom: 5px;
  color: #555;
  text-decoration: none;
}

.tag:hover {
  background-color: #e0e0e0;
}

.error {
  color: #d9534f;
  padding: 15px;
  background-color: #f8d7da;
  border-radius: 4px;
}
</style>

<style>
/* 这些样式不使用 scoped，以便应用到 v-html 内容 */
.article-content {
  text-align: left; /* 确保内容左对齐 */
}

.article-content h1 {
  font-size: 2em;
  margin-top: 1.5em;
  margin-bottom: 0.8em;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.3em;
}

.article-content h2 {
  font-size: 1.5em;
  margin-top: 1.3em;
  margin-bottom: 0.7em;
  padding-bottom: 0.2em;
  border-bottom: 1px solid #f0f0f0;
}

.article-content h3 {
  font-size: 1.3em;
  margin-top: 1.2em;
  margin-bottom: 0.6em;
}

.article-content p {
  margin-bottom: 1em;
}

.article-content ul, .article-content ol {
  margin-bottom: 1em;
  padding-left: 2em;
}

.article-content li {
  margin-bottom: 0.5em;
}

.article-content pre {
  /* background-color: #eee;
  border-radius: 3px;
  padding: 16px;
  overflow: auto;
  margin-bottom: 1em; */
}

.article-content code {
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  font-size: 0.9em;
  /* background-color: #f6f8fa; */
  padding: 0.2em 0.4em;
  border-radius: 3px;
}

.article-content pre code {
  /* background-color: transparent; */
  /* padding: 0; */
  /* font-size: 0.9em; */
  /* line-height: 1.5; */
}

.article-content blockquote {
  border-left: 4px solid #ddd;
  padding-left: 16px;
  color: #666;
  margin-left: 0;
  margin-bottom: 1em;
}

.article-content img {
  max-width: 100%;
  margin: 1em 0;
}

.article-content table {
  border-collapse: collapse;
  width: 100%;
  margin: 20px 0;
}

.article-content table, .article-content th, .article-content td {
  border: 1px solid #ddd;
}

.article-content th, .article-content td {
  padding: 12px;
  text-align: left;
}

.article-content th {
  background-color: #f6f8fa;
}


</style>