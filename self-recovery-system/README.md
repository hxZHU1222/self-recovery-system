# Self Recovery System｜自我恢复系统

一个纯前端的自我恢复、任务整理与低压复盘小系统。它适合用来记录今日必做、本周计划、四象限任务、习惯连击和临时随记。

本项目默认不需要后端、不需要数据库、不需要登录。所有数据保存在当前浏览器的 `localStorage` 中。

## 功能

- 今日页：区分「今日必做」与「今日可选」，降低计划崩盘后的重启成本。
- 本周页：记录周计划、大纲、每日安排、周复盘。
- 四象限：按重要程度和紧急程度整理任务。
- 连击页：记录日常习惯，并支持有限豁免。
- 随记页：先接住想法、情绪、灵感，再决定是否转成任务。
- 数据页：导出 JSON 备份、导入 JSON 备份、恢复公开示例数据。

## 隐私说明

这个仓库里的默认数据是公开示例数据，不包含个人真实记录。

实际使用时，你输入的任务、随记、复盘会保存在浏览器本地：

```text
localStorage
├── selfRecoveryTasks
├── selfRecoveryRoutines
├── selfRecoveryNotes
├── selfRecoveryWeeklyPlan
└── selfRecoveryWeeklyReview
```

项目不会自动上传你的数据，也不会连接任何第三方服务。若你把自己使用过的版本重新发布到公开仓库，请先导出/备份自己的数据，并确认没有把私人备份 JSON、截图、日志或真实计划提交上去。

## 本地运行

这是静态网页项目，直接打开即可：

```text
index.html
```

也可以用任意静态服务器预览，例如：

```bash
python -m http.server 8080
```

然后访问：

```text
http://127.0.0.1:8080
```

## 部署到 GitHub Pages

1. 新建或打开仓库，例如 `hxZHU1222/self-recovery-system`。
2. 上传本项目根目录中的文件：`index.html`、`css/`、`js/`、`README.md`、`LICENSE`、`.gitignore`。
3. 进入仓库 `Settings` → `Pages`。
4. Source 选择 `Deploy from a branch`。
5. Branch 选择 `main`，目录选择 `/ (root)`。
6. 保存后等待 GitHub Pages 构建完成。

## 导出数据

在网页底部导航进入「数据」页，点击「导出 JSON 备份」。浏览器会下载类似下面的文件：

```text
self-recovery-backup-2026-05-26.json
```

导出的 JSON 大致结构如下：

```json
{
  "app": "self-recovery-system",
  "version": "1.0.0",
  "exportedAt": "2026-05-26T00:00:00.000Z",
  "data": {
    "tasks": [],
    "routines": [],
    "notes": [],
    "weeklyPlan": {},
    "weeklyReview": {}
  }
}
```

建议在以下情况前先导出：

- 更换电脑、手机或浏览器。
- 清理浏览器缓存。
- 重新部署 GitHub Pages。
- 大幅修改 `js/data.js` 或 localStorage key。

## 导入数据

1. 进入「数据」页。
2. 在「导入数据」区域选择之前导出的 `.json` 文件。
3. 确认覆盖当前浏览器数据。
4. 页面会自动刷新渲染导入后的任务、随记、连击和周计划。

注意：导入会覆盖当前浏览器里的系统数据。导入前建议先导出一次当前数据。

## 恢复示例数据

进入「数据」页，点击「恢复示例数据」。这会清空当前浏览器中的系统数据，并恢复仓库自带的公开示例数据。

## 目录结构

```text
self-recovery-system/
├── index.html
├── css/
│   ├── variables.css
│   ├── base.css
│   ├── components.css
│   └── mobile.css
├── js/
│   ├── data.js
│   └── main.js
├── README.md
├── LICENSE
├── .gitignore
└── .nojekyll
```

## 适合公开提交的内容

可以提交：

- 前端源码。
- 示例数据。
- README、LICENSE、说明文档。

不要提交：

- 真实备份 JSON。
- 真实任务、真实随记、真实复盘截图。
- `.env`、密钥、账号、邮箱、服务器地址。
- 浏览器缓存、日志、压缩包、数据库文件。

## License

MIT License. See [LICENSE](./LICENSE).
