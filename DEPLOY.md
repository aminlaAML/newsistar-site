# NewSistar 国 宣传站

静态网站，部署于 Cloudflare Pages。

## 本地预览

直接双击 `index.html` 用浏览器打开即可。

或用简易 HTTP 服务器预览（推荐，避免浏览器跨域限制）：

```powershell
# Python 方式（已装 Python 时）
python -m http.server 8080
# 浏览器访问 http://localhost:8080

# Node 方式（已装 Node 时）
npx serve .
```

## 项目结构

```
newsistar-site/
├── index.html         # 首页
├── about.html         # 关于国家
├── server.html        # 服务器信息
├── maps.html          # 地图库（待接 API）
├── join.html          # 加入指引
├── assets/
│   ├── css/style.css  # 样式
│   └── js/main.js     # 公共脚本
└── DEPLOY.md          # 本文件
```

## 部署到 Cloudflare Pages

### 方式 A：通过 Git 自动部署（推荐）

1. 在 GitHub 创建一个新仓库（如 `newsistar-site`），public 或 private 都行
2. 把本项目文件推送到仓库
3. 登录 Cloudflare → Workers & Pages → Create → Pages → Connect to Git
4. 选择刚才的仓库
5. 构建配置：
   - **Framework preset**: None
   - **Build command**: 留空
   - **Build output directory**: `/`（根目录）
6. 点 Save and Deploy
7. 等待部署完成（约 30 秒）
8. 后续每次 git push 会自动触发部署

### 方式 B：直接上传文件（最简单）

1. 登录 Cloudflare → Workers & Pages → Create → Pages → Upload assets
2. 把整个 `newsistar-site` 文件夹拖进去
3. 点 Deploy site
4. 完成

## 绑定自定义域名

部署完成后：

1. 进入你的 Pages 项目 → Custom domains → Set up a domain
2. 输入 `newsistar.com`
3. 再添加一个 `www.newsistar.com`
4. Cloudflare 会自动添加 CNAME 记录（域名已在 Cloudflare 托管的情况下立即生效）
5. 等待 SSL 证书签发（几分钟），即可通过域名访问

## 修改内容

| 想改什么 | 改哪个文件 |
|---------|----------|
| 首页文案 | `index.html` |
| 国家历史/地理/政体 | `about.html` |
| 服务器地址/版本 | `server.html` |
| mod 列表 | `server.html` |
| 联系方式 | 所有页面的页脚 + `join.html` |
| 配色 | `assets/css/style.css` 顶部的 `:root` 变量 |
| Logo | 所有 HTML 的 `.nav-logo` 部分 |

## 后续扩展（待做）

- [ ] 接入地图库 API（需 Workers + R2/D1 + 阿里云 OSS）
- [ ] 添加管理后台
- [ ] 添加用户登录
- [ ] 添加地图上传页面
- [ ] 接入公告/新闻系统
