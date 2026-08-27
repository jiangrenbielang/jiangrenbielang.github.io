# Utopia 博客

基于 Hexo 的个人博客。项目根目录是**源码仓库**，主题已定制并命名为 **Utopia**。

## 分支分工（重要，先看这里）

| 分支 | 内容 | 用途 |
|------|------|------|
| **`master`** | 源码（`_config.yml`、`source/`、`themes/Utopia/`、`scaffolds/` 等） | 改代码 / 备份源码 |
| **`main`** | 已部署的静态站点（`index.html`、`css/`、`js/` 等构建产物） | GitHub Pages 从这里建站，**只由 `npm run deploy` 自动更新，不要手动改** |

> 线上网址：https://jiangrenbielang.github.io/
> 源码在 `master`，线上页面在 `main`，两者互不覆盖。

## 日常发布一篇新文章

```bash
# 1. 新建文章（自动生成模版）
npx hexo new "文章标题"

# 2. 编辑生成的 md 文件（在 source/_posts/ 下）
```

```bash
# 3. 本地预览（可选）
npx hexo server        # 打开 http://localhost:4000

# 4. 发布上线（先生成，再推送）
npm run build          # hexo generate，产出 public/
npm run deploy         # hexo deploy，把 public/ 推到 GitHub main（线上更新）
```

> ⚠️ 务必先 `build` 再 `deploy`。`hexo deploy` 本身**不会自动生成**，直接 deploy 会推送上一次的旧产物。

## 备份源码（防止丢失）

发布后可顺手把源码推到远端 `master`：

```bash
git add -A
git commit -m "发布：文章标题"
git push origin master
```

## 改了主题 / 配置 / 图片（改动较大）

改动主题或 `_config.yml` 后，旧缓存可能残留，先清理再生成：

```bash
npx hexo clean                                          # 清空 public/ 和 db.json
npm run build && npm run deploy                        # 生成并上线
git add -A && git commit -m "..." && git push origin master   # 备份源码
```

## 命令速查

| 目的 | 命令 |
|------|------|
| 新建文章 | `npx hexo new "标题"` |
| 本地预览 | `npx hexo server` |
| 正常发布 | `npm run build && npm run deploy` |
| 大幅改动后发布 | `npx hexo clean && npm run build && npm run deploy` |
| 备份源码 | `git add -A && git commit -m "..." && git push origin master` |
| 线上生效 | 等待 GitHub Pages 重建约 1–2 分钟，强刷 `Ctrl+F5` |

## 换电脑 / 恢复源码

```bash
git clone --branch master https://github.com/jiangrenbielang/jiangrenbielang.github.io.git
cd jiangrenbielang.github.io && npm install
```

之后照常 `npm run build && npm run deploy` 即可。

## 主题说明

- 原 `themes/cola` 是上游 [hexo-theme-cola](https://github.com/Aizener/hexo-theme-cola) 的 git 克隆，自定义改动常被 `git pull/reset` 还原。
- 已解耦（删除主题内 `.git`）重命名为 `themes/Utopia`，全部自定义（bookshelf、competition 页面、封面图、音乐、乌托邦 logo 等）保存在站点源码仓库中，不再受上游影响。
- 旧的部署站点备份保留在 `backup/old-deploy-master` 分支，如不需要可自行删除。
