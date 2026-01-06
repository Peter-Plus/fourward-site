# Fourward 网站

这是 Fourward 游戏的展示网站。

## 目录结构

```
fourward-site/
├── index.html      # 主页面
├── styles.css      # 样式文件
├── main.js         # 交互脚本
├── config.js       # 【配置文件 - 修改这里更新内容】
├── assets/
│   ├── images/     # 截图 (screenshot1.png ~ screenshot6.png)
│   ├── video/      # 视频 (gameplay.mp4)
│   └── download/   # 下载文件 (Fourward_Windows.zip)
└── README.md
```

## 配置说明

所有可修改的内容都在 `config.js` 文件中：

### 游戏信息
```javascript
game: {
  name: "Fourward",           // 游戏名称
  description: "...",         // 游戏描述
  genre: "2D 横版解谜...",    // 游戏类型
  // ...
}
```

### 团队信息
```javascript
team: {
  name: "WorldLine",
  members: [
    { name: "蔚莱", role: "程序", email: "xxx@gmail.com" },
    { name: "ddddddbee", role: "美术", email: "" }  // 留空不显示邮箱
  ]
}
```

### 外部链接
```javascript
links: {
  itch: "https://peterclaus.itch.io/fourward",
  bilibili: "",  // 填写后会显示B站链接
}
```

### 媒体文件
```javascript
media: {
  video: "assets/video/gameplay.mp4",
  screenshots: [
    "assets/images/screenshot1.png",
    // ... 最多6张
  ]
}
```

## 部署步骤

1. 将所有文件上传到服务器
2. 配置 nginx 指向此目录
3. 添加截图到 `assets/images/` (命名为 screenshot1.png ~ screenshot6.png)
4. 添加视频到 `assets/video/gameplay.mp4`
5. 添加游戏压缩包到 `assets/download/`
6. 修改 `config.js` 中的配置

## nginx 配置示例

```nginx
server {
    listen 80;
    server_name fourward.worldlinesite.com;
    root /var/www/fourward;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
}
```

---
Fourward was here. 🏔️
