// ==========================================
// Fourward 网站配置文件
// 修改以下内容即可更新网站信息
// ==========================================

const CONFIG = {
  // 游戏基本信息
  game: {
    name: "Fourward",
    tagline: "Four + Forward",
    description: "三年前，四名登山者挑战凯隆达尔山，只有乔一人生还。\n三年后，他重返此地，要完成当年的约定——将队旗插上山顶。",
    genre: "2D 横版解谜平台跳跃",
    platform: "Windows PC",
    engine: "Unity 2022 LTS",
    jamName: "thatgamejam #01",
    jamBy: "TGC",
    devPeriod: "2025.12.20 - 2026.01.05"
  },

  // 团队信息
  team: {
    name: "Fourward",
    members: [
      {
        name: "蔚莱",
        avatar: "assets/images/avatar-weilai.png",  // 头像图片路径，留空则用名字首字
        role: "程序",
        email: "peterclaus622@gmail.com"
      },
      {
        name: "ddddddbee",
        avatar: "assets/images/avatar-bee.png",
        role: "美术",
        email: ""
      }
    ]
  },

  // 外部链接
  links: {
    itch: "https://peterclaus.itch.io/fourward",
    bilibili: "",  // B站视频链接，填写后会显示
    jamPage: "https://itch.io/jam/thatgamejam"
  },

  // 媒体文件路径
  media: {
    // 视频文件（放在 assets/video/ 目录下）
    video: "assets/video/gameplay.mp4",
    
    // 截图（放在 assets/images/ 目录下，按顺序排列）
    screenshots: [
      "assets/images/screenshot1.png",
      "assets/images/screenshot2.png",
      "assets/images/screenshot3.png",
      "assets/images/screenshot4.png",
      "assets/images/screenshot5.png",
      "assets/images/screenshot6.png"
    ],
    
    // 游戏Logo（可选）
    logo: "assets/images/logo.png"
  },

  // 下载信息
  download: {
    // 下载文件路径（放在 assets/download/ 目录下）
    file: "assets/download/Fourward_Windows.zip",
    // 文件大小（显示用）
    size: "约 100MB",
    // 按钮文字
    buttonText: "下载游戏"
  },

  // 留言板配置（Waline）
  waline: {
    serverURL: "http://waline.worldlinesite.com",
    placeholder: "留下你的足迹...",
    avatar: "retro",
    pageSize: 10,
    lang: "zh-CN"
  },

  // 游戏特色介绍
  features: [
    {
      title: "双人格系统",
      desc: "控制主人格，影子镜像跟随\\n两个自我，一场博弈"
    },
    {
      title: "主题契合",
      desc: "左手是乔，右手是他的影子\\n怀疑、悔恨与恐惧的具象"
    },
    {
      title: "攀登之旅",
      desc: "从2100m到6100m，从山脚到顶峰\\n一段与自己和解的旅程"
    }
  ],

  // 操作说明
  controls: [
    { key: "A/D", action: "移动" },
    { key: "空格", action: "跳跃" },
    { key: "W/S", action: "攀爬" },
    { key: "Q", action: "召唤/隐藏反人格" },
    { key: "R", action: "回拉至反人格位置" },
    { key: "E", action: "道具" }
  ]
};