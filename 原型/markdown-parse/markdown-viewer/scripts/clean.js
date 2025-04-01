import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 目标目录和文件
const postsDir = path.join(rootDir, 'posts');
const metadataFile = path.join(rootDir, 'postMetadata.json');

/**
 * 递归删除目录中的所有文件和子目录
 * @param {string} dir 要清空的目录路径
 */
function emptyDirectory(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`目录不存在: ${dir}`);
    return;
  }

  console.log(`清空目录: ${dir}`);

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory()) {
      // 递归清空子目录
      emptyDirectory(itemPath);
      // 删除空目录
      fs.rmdirSync(itemPath);
      console.log(`删除目录: ${itemPath}`);
    } else {
      // 删除文件
      fs.unlinkSync(itemPath);
      console.log(`删除文件: ${itemPath}`);
    }
  }

  fs.rmdirSync(dir);
}

/**
 * 删除元数据文件
 * @param {string} filePath 元数据文件路径
 */
function deleteMetadataFile(filePath) {
    if (fs.existsSync(filePath)) {
      // 删除文件
      fs.unlinkSync(filePath);
      console.log(`删除元数据文件: ${filePath}`);
    } else {
      console.log(`元数据文件不存在: ${filePath}`);
    }
  }

// 执行清理操作
try {
  // 清空 posts 目录
  emptyDirectory(postsDir);

//   // 确保 posts 目录存在
//   if (!fs.existsSync(postsDir)) {
//     fs.mkdirSync(postsDir, { recursive: true });
//     console.log(`创建目录: ${postsDir}`);
//   }

  // 清空元数据文件
  deleteMetadataFile(metadataFile);

  console.log('清理操作完成!');
} catch (error) {
  console.error('清理过程中发生错误:', error);
  process.exit(1);
}