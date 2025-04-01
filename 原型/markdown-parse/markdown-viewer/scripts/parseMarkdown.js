import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { marked } from 'marked';
import hljs from 'highlight.js';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 设置 marked 的代码高亮选项
marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return hljs.highlightAuto(code).value;
  }
});

// 确保目标目录存在
const postsDir = path.join(rootDir, 'src', 'posts');
if (!fs.existsSync(postsDir)) {
  fs.mkdirSync(postsDir, { recursive: true });
}

// 缓存文件路径
const cacheFilePath = path.join(rootDir, 'src', 'postMetadata.json');

// 检查文件是否需要更新（通过比较修改时间）
function isFileUpdated(srcPath, destPath) {
  if (!fs.existsSync(destPath)) {
    return true;
  }

  const srcStat = fs.statSync(srcPath);
  const destStat = fs.statSync(destPath);

  return srcStat.mtimeMs > destStat.mtimeMs;
}

// 清空目录
function emptyDirectory(dir) {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach(file => {
      const curPath = path.join(dir, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        emptyDirectory(curPath);
        fs.rmdirSync(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
  }
}

// 解析 Markdown 文件
function parseMarkdownFiles(fullMode = false) {
  const publicDir = path.join(rootDir, 'md');
  const mdFiles = findMarkdownFiles(publicDir);

  // 如果是全量模式，清空目标目录和元数据
  if (fullMode) {
    console.log('Running in full mode - clearing all existing files...');
    emptyDirectory(postsDir);
    if (!fs.existsSync(postsDir)) {
      fs.mkdirSync(postsDir, { recursive: true });
    }
  }

  // 读取现有元数据（如果存在且不是全量模式）
  let metadata = {};
  if (!fullMode && fs.existsSync(cacheFilePath)) {
    try {
      metadata = JSON.parse(fs.readFileSync(cacheFilePath, 'utf-8'));
    } catch (e) {
      console.warn('Failed to parse existing metadata, starting fresh');
    }
  }

  // 跟踪处理过的文件，用于后续清理
  const processedFiles = new Set();

  mdFiles.forEach(filePath => {
    const relativePath = path.relative(publicDir, filePath);
    const outputPath = path.join(postsDir, relativePath.replace(/\.md$/, '.html'));
    const key = relativePath.replace(/\.md$/, '');

    // 在快速模式下，检查文件是否需要更新
    if (!fullMode && fs.existsSync(outputPath) && !isFileUpdated(filePath, outputPath)) {
      console.log(`Skipped (unchanged): ${relativePath}`);
      processedFiles.add(key);
      return;
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const { data, content: markdownContent } = matter(content);

    // 生成 HTML
    const html = marked(markdownContent);

    // 确保输出目录存在
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 写入 HTML 文件
    fs.writeFileSync(outputPath, html);

    // 存储元数据
    metadata[key] = {
      ...data,
      path: relativePath,
      htmlPath: relativePath.replace(/\.md$/, '.html')
    };

    processedFiles.add(key);
    console.log(`Processed: ${relativePath}`);
  });

  // 清理不再存在的文件（如果不是全量模式）
  if (!fullMode) {
    const keysToRemove = Object.keys(metadata).filter(key => !processedFiles.has(key));

    keysToRemove.forEach(key => {
      const htmlPath = path.join(postsDir, metadata[key].htmlPath);
      if (fs.existsSync(htmlPath)) {
        fs.unlinkSync(htmlPath);
        console.log(`Removed: ${metadata[key].htmlPath}`);
      }
      delete metadata[key];
    });
  }

  // 写入元数据缓存
  fs.writeFileSync(cacheFilePath, JSON.stringify(metadata, null, 2));
  console.log(`Metadata cached to: ${cacheFilePath}`);
}

// 递归查找 Markdown 文件
function findMarkdownFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findMarkdownFiles(filePath, fileList);
    } else if (file.endsWith('.md')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// 检查命令行参数，决定使用哪种模式
const fullMode = process.argv.includes('--full');
console.log(`Running in ${fullMode ? 'full' : 'quick'} mode`);

// 执行解析
parseMarkdownFiles(fullMode);