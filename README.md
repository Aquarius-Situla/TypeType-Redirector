# TypeType-Redirect

A set of proxy rewrite and redirection rules designed to automatically redirect **Bilibili** (including `b23.tv` short links) and **YouTube** (including `youtu.be` short links, Shorts, and homepages) video links to your self-hosted or custom **TypeType** service via HTTP 302/307 redirects.

Helps prevent algorithmic feed distractions and habit-driven endless scrolling by landing directly into your clean TypeType environment.

Compatible with **Shadowrocket** and **Quantumult X**.

---

## 🎯 Redirection Routing Mapping

| Source URL | Redirected TypeType Destination | Purpose |
| :--- | :--- | :--- |
| `https://www.bilibili.com/` / `https://m.bilibili.com/` | `https://[YOUR_DOMAIN]/` | **Anti-distraction Homepage** |
| `https://www.youtube.com/` / `https://m.youtube.com/` | `https://[YOUR_DOMAIN]/` | **Anti-distraction Homepage** |
| `https://b23.tv` / `https://youtu.be` | `https://[YOUR_DOMAIN]/` | **Anti-distraction Homepage** |
| `https://www.bilibili.com/video/BV1xx411c7xx` | `https://[YOUR_DOMAIN]/watch?v=BV1xx411c7xx` | Video Player |
| `https://b23.tv/xxxxxx` | `https://[YOUR_DOMAIN]/watch?v=https://b23.tv/xxxxxx` | Short link redirection |
| `https://www.youtube.com/watch?v=dQw4w9WgXcQ` | `https://[YOUR_DOMAIN]/watch?v=dQw4w9WgXcQ` | Video Player |
| `https://www.youtube.com/shorts/xxxxxx` | `https://[YOUR_DOMAIN]/watch?v=xxxxxx` | Video Player |
| `https://youtu.be/dQw4w9WgXcQ` | `https://[YOUR_DOMAIN]/watch?v=dQw4w9WgXcQ` | Video Player |

---

## 🚀 Option 1: Shadowrocket Native Argument Suffix (Recommended)

Shadowrocket modules adhere to the Surge module specification with `#!arguments` support. When subscribing to the module, **append `#domain=YOUR_DOMAIN` (without `https://`) to the end of the URL**. Shadowrocket will automatically substitute the placeholder with your custom domain upon installation.

### Subscription URL Format:

```text
https://raw.githubusercontent.com/Aquarius-Situla/TypeType-Redirect/main/typetype.sgmodule#domain=YOUR_TYPETYPE_DOMAIN
```

> **Example**: If your TypeType domain is `video.example.com`:
> ```text
> https://raw.githubusercontent.com/Aquarius-Situla/TypeType-Redirect/main/typetype.sgmodule#domain=video.example.com
> ```

*(CDN Accelerated Mirror for regions with unstable GitHub Raw connections):*
```text
https://ghfast.top/https://raw.githubusercontent.com/Aquarius-Situla/TypeType-Redirect/main/typetype.sgmodule#domain=YOUR_TYPETYPE_DOMAIN
```

### Installation Steps in Shadowrocket:
1. Open Shadowrocket and tap **Config** at the bottom.
2. Scroll to the **Modules** section and tap the **`+`** icon in the upper-right corner.
3. Paste the URL containing your `#domain=...` suffix, then tap **Save/Install**.
4. Enable the module. You can also tap the module at any time to modify the `domain` parameter directly from the UI.

---

## ⚡ Option 2: Dynamic Delivery via Cloudflare Worker (Quantumult X & Shadowrocket)

Quantumult X does not natively parse URL fragment parameters (`#hash`). For a fully automated and dynamic domain substitution across all clients, a zero-maintenance [worker.js](./worker.js) script is provided.

### 1. Deploy the Worker
1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/) -> Navigate to **Workers & Pages** -> **Create application** -> **Create Worker**.
2. Copy and paste the code from [worker.js](./worker.js) into the Cloudflare online code editor and click **Deploy**.

### 2. Subscription URLs
Once deployed, your worker will provide a unique address (e.g. `https://typetype-redirect.your-name.workers.dev`):

* **Quantumult X (Rewrite Remote)**:
  ```text
  https://typetype-redirect.your-name.workers.dev/snippet?domain=https://YOUR_TYPETYPE_DOMAIN
  ```
* **Shadowrocket (Module)**:
  ```text
  https://typetype-redirect.your-name.workers.dev/sgmodule?domain=https://YOUR_TYPETYPE_DOMAIN
  ```

---

## ⚠️ Prerequisites & Limitations (iOS)

1. **HTTPS Decryption (MITM) & CA Certificate Trust**:
   - **Shadowrocket**: Config -> tap ⓘ on current config -> **HTTPS Decryption** -> Turn on, generate & install CA certificate -> Go to iOS **Settings** -> **General** -> **About** -> **Certificate Trust Settings** -> Enable full trust for the certificate.
   - **Quantumult X**: Settings -> **MitM** -> Generate & install certificate -> Fully trust the root certificate in iOS Settings.
2. **Preventing QUIC Bypass (HTTP/3)**:
   - Modern browsers like Safari prioritize QUIC (UDP 443) for Google/YouTube services, which cannot be decrypted by proxy MITM engines.
   - It is strongly recommended to add a rule in Shadowrocket/QuanX to reject UDP port 443 traffic:
     `AND,((DEST-PORT,443),(PROTOCOL,UDP)),REJECT`
3. **Scope of Application**:
   - Redirection operates reliably in **browsers (Safari, Chrome, etc.) and in-app web views**.
   - The official YouTube app implements strict **SSL Pinning**. Intercepting traffic from the official app will result in connection failure; this module is intended for web browsing and opening external video links.
