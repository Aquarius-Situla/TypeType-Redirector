# TypeType-Redirect

自动将 **Bilibili**（含 `b23.tv` 短链接）与 **YouTube**（含 `youtu.be` 短链接和 Shorts）视频重定向到自建 **TypeType** 服务的代理工具规则分片。

支持 **Shadowrocket（小火箭）** 和 **Quantumult X（QuanX）**。

---

## 🎯 效果与路由对应

| 原始平台链接 | 重定向后的 TypeType 访问地址 |
| :--- | :--- |
| `https://www.bilibili.com/video/BV1xx411c7xx` | `https://[你的域名]/watch?v=BV1xx411c7xx` |
| `https://b23.tv/xxxxxx` | `https://[你的域名]/watch?v=https://b23.tv/xxxxxx` |
| `https://www.youtube.com/watch?v=dQw4w9WgXcQ` | `https://[你的域名]/watch?v=dQw4w9WgXcQ` |
| `https://www.youtube.com/shorts/xxxxxx` | `https://[域名]/watch?v=xxxxxx` |
| `https://youtu.be/dQw4w9WgXcQ` | `https://[你的域名]/watch?v=dQw4w9WgXcQ` |

---

## 🚀 方式一：Shadowrocket 原生参数尾缀替换（最简单）

Shadowrocket 模块规范支持 `#!arguments`。在添加模块链接时，**只需在 URL 结尾添加 `#domain=你的域名`（不含 `https://`）**，小火箭就会在下载时自动将模板中的域名替换为你的专属域名！

### 订阅链接格式：

```text
https://raw.githubusercontent.com/Aquarius-Situla/TypeType-Redirect/main/typetype.sgmodule#domain=你的TypeType域名
```

> **示例**：如果你的 TypeType 域名是 `video.mydomain.com`，订阅链接填：
> `https://raw.githubusercontent.com/Aquarius-Situla/TypeType-Redirect/main/typetype.sgmodule#domain=video.mydomain.com`

*国内直连加速镜像（如果 raw.githubusercontent.com 较慢）：*
```text
https://ghfast.top/https://raw.githubusercontent.com/Aquarius-Situla/TypeType-Redirect/main/typetype.sgmodule#domain=你的TypeType域名
```

#### 在 Shadowrocket 中的使用步骤：
1. 打开 Shadowrocket，进入底部 **「配置」** -> **「模块」**。
2. 点击右上角 **`+`**，粘贴上面的带 `#domain=` 尾缀的链接，点击确定。
3. 导入后启用该模块。也可以点击该模块进入详情，随时在 `domain` 输入框中修改域名。

---

## ⚡ 方式二：通过 Cloudflare Worker 动态分发（QuanX & 小火箭全通用）

由于 Quantumult X 原生不支持直接读取 URL 尾部的 `#hash` 参数，我们提供了一个无需维护的轻量级 [worker.js](./worker.js)，部署后支持传入 `?domain=` 参数进行动态替换：

### 1. 部署 Worker
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/) -> 点击 **Workers & Pages** -> **Create application** -> **Create Worker**。
2. 将本项目根目录下的 [worker.js](./worker.js) 代码完整复制粘贴进去并保存部署。

### 2. 获取订阅链接
部署完成后，你的 Worker 拥有一个专属域名（如 `https://typetype-redirect.your-name.workers.dev`）：

* **Quantumult X 重写引用**：
  ```text
  https://typetype-redirect.your-name.workers.dev/snippet?domain=https://你的TypeType域名
  ```
* **Shadowrocket 模块**：
  ```text
  https://typetype-redirect.your-name.workers.dev/sgmodule?domain=https://你的TypeType域名
  ```

---

## ⚠️ 使用必备前提（iOS 端配置）

1. **必须开启 HTTPS 解密（MITM）并信任证书**：
   - **Shadowrocket**：「配置」->「当前配置」->「HTTPS 解密」-> 开启并生成 CA 证书 -> 安装证书 -> 前往 iOS 系统「设置」->「通用」->「关于本机」->「证书信任设置」中**完全信任**该证书。
   - **Quantumult X**：「设置」->「MitM」-> 生成并安装证书 -> 前往 iOS 系统设置完全信任根证书。
2. **应用范围**：
   - 该规则对 **Safari、Chrome 等浏览器以及大部分第三方 App 内的网页打开生效**。
   - YouTube 官方 App 内置了严格的 **SSL Pinning（证书绑定）**，解密其官方客户端流量会触发安全告警，因此该重定向主要服务于**网页端及点击外部链接时的场景**。
