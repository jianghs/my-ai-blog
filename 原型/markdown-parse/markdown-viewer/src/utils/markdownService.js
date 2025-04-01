import { marked } from 'marked';
import matter from 'gray-matter';
import hljs from 'highlight.js';
import "highlight.js/styles/monokai-sublime.css";
// 添加 Buffer polyfill
import { Buffer } from 'buffer';
// 将 Buffer 添加到全局对象中
window.Buffer = Buffer;

// 配置 marked 以支持代码高亮
// marked.setOptions({
//   highlight: function(code, lang) {
//     // if (lang && hljs.getLanguage(lang)) {
//     //   try {
//     //     return hljs.highlight(code, { language: lang }).value; // 注意这里的参数格式
//     //   } catch (err) {}
//     // }
//     return hljs.highlightAuto(code).value;
//   },
//   breaks: true,
//   gfm: true
// });

/**
 * 解析 Markdown 文件内容
 * @param {string} content - Markdown 文件内容
 * @returns {Object} 包含元数据和 HTML 内容的对象
 */
export function parseMarkdown(content) {
  try {
    // 解析元数据和内容
    const { data: metadata, content: markdownContent } = matter(content);

    // 将 Markdown 内容转换为 HTML
    const htmlContent = marked(markdownContent);

    return {
      metadata,
      htmlContent
    };
  } catch (error) {
    console.error('解析 Markdown 时出错:', error);
    return {
      metadata: {},
      htmlContent: '<p>解析 Markdown 时出错</p>'
    };
  }
}