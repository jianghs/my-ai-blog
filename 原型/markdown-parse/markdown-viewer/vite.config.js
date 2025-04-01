import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import fs from 'fs'

// 自定义插件：复制 posts 目录和 postMetadata.json 到 dist
const copyAssetsPlugin = () => {
  return {
    name: 'copy-assets-plugin',
    closeBundle() {
      // 复制 posts 目录
      const srcPostsDir = resolve(__dirname, 'posts')
      const destPostsDir = resolve(__dirname, 'dist/posts')

      if (fs.existsSync(srcPostsDir)) {
        // 确保目标目录存在
        if (!fs.existsSync(destPostsDir)) {
          fs.mkdirSync(destPostsDir, { recursive: true })
        }

        // 复制所有文件
        const files = fs.readdirSync(srcPostsDir)
        files.forEach(file => {
          const srcFile = resolve(srcPostsDir, file)
          const destFile = resolve(destPostsDir, file)

          if (fs.statSync(srcFile).isFile()) {
            fs.copyFileSync(srcFile, destFile)
          }
        })

        console.log('已复制 posts 目录到 dist/posts')
      }

      // 复制 postMetadata.json
      const srcMetadata = resolve(__dirname, 'postMetadata.json')
      const destMetadata = resolve(__dirname, 'dist/postMetadata.json')

      if (fs.existsSync(srcMetadata)) {
        // 确保目标目录存在
        const destDir = resolve(__dirname, 'dist')
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true })
        }

        fs.copyFileSync(srcMetadata, destMetadata)
        console.log('已复制 postMetadata.json 到 dist')
      }
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), copyAssetsPlugin()],
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})
