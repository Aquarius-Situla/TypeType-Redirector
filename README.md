# TypeType-Redirect

A professional, cross-platform traffic-interception and URL-rewriting suite designed for **[TypeType](https://github.com/Aquarius-Situla/TypeType)**. Automatically redirects **Bilibili** (including `b23.tv` short links) and **YouTube** (including `youtu.be` short links, Shorts, and homepages) to your custom TypeType instance via HTTP 302/307 temporary redirects.

Compatible with **iOS**, **macOS**, **Windows**, **Linux**, and **Android**.

---

## 🎯 Purpose & Core Motivation

Modern video platforms like Bilibili and YouTube are fundamentally engineered around the **attention economy**. Their business models rely on infinite recommendation feeds, algorithmic autoplay, clickbait thumbnails, and compulsive short-form video (Shorts) designed to keep users hooked in prolonged doomscrolling sessions.

**TypeType-Redirect exists to solve three critical challenges:**

### 1. Breaking the Dopamine Loop (Algorithmic Detox)
Whenever you instinctively or habitually type `bilibili.com` or `youtube.com` into your browser address bar during work or study intervals, TypeType-Redirect immediately diverts the request directly into your clean TypeType instance. **It removes the temptation entirely by making addictive feeds unreachable by default.**

### 2. Maximizing the Utility of Self-Hosted TypeType
Building a private, distraction-free player like TypeType is only effective if you actually use it. Habitual inertia often pulls users back to the original websites. By establishing an automated redirect layer across all your devices, TypeType becomes the single, non-negotiable gateway for video consumption without requiring conscious willpower.

### 3. Frictionless Cross-App Link Opening
When friends or colleagues share video links (especially obfuscated Bilibili short links like `b23.tv` or mobile YouTube links), clicking them opens directly in TypeType. There is no need to manually copy links, switch apps, or paste URLs into search bars—interception happens transparently in milliseconds.

---

## 🧭 Platform Compatibility Matrix

Different operating systems enforce distinct security boundaries regarding TLS decryption and proxy routing. This suite provides tailored solutions optimized for each platform:

| Platform | Recommended Solution | Mechanism | Technical Rationale |
| :--- | :--- | :--- | :--- |
| **iOS / iPadOS** | **Shadowrocket** / **Quantumult X** | Proxy MITM (HTTPS Decryption) | Apple allows user CA installation with full root trust under iOS Settings, enabling seamless OS-level interception. |
| **macOS** | **Shadowrocket** / **Surge** / **Extension** | Proxy MITM or Browser Extension | Native support for system Keychain root trust; browser extensions also work friction-free. |
| **Windows / Linux** | **Redirector Extension** / **Userscript** | Browser-level Network Interception | Bypasses proxy port conflicts (e.g., Clash Party, v2rayN) and avoids polluting OS certificate stores. |
| **Android** | **Redirector Extension** (Kiwi / Firefox) | Browser-level Network Interception | **Android 7.0+ (API 24) strictly blocks user-installed CAs from decrypting app/browser traffic without Root**. Extension is the optimal zero-root approach. |

---

## 🗺️ Redirection Routing Mapping

| Source URL | Redirected TypeType Destination | Purpose |
| :--- | :--- | :--- |
| `https://www.bilibili.com/` / `https://m.bilibili.com/` | `https://[YOUR_DOMAIN]/` | **Anti-distraction Homepage** |
| `https://www.youtube.com/` / `https://m.youtube.com/` | `https://[YOUR_DOMAIN]/` | **Anti-distraction Homepage** |
| `https://b23.tv` / `https://youtu.be` | `https://[YOUR_DOMAIN]/` | **Anti-distraction Homepage** |
| `https://www.bilibili.com/video/BV1xx411c7xx` | `https://[YOUR_DOMAIN]/watch?v=BV1xx411c7xx` | Video Player (BV Cleaned) |
| `https://b23.tv/xxxxxx` | `https://[YOUR_DOMAIN]/watch?v=https://b23.tv/xxxxxx` | Short Link Resolver |
| `https://www.youtube.com/watch?v=dQw4w9WgXcQ` | `https://[YOUR_DOMAIN]/watch?v=dQw4w9WgXcQ` | Video Player (11-char ID) |
| `https://www.youtube.com/shorts/xxxxxx` | `https://[YOUR_DOMAIN]/watch?v=xxxxxx` | Shorts Player |
| `https://youtu.be/dQw4w9WgXcQ` | `https://[YOUR_DOMAIN]/watch?v=dQw4w9WgXcQ` | Short Link Player |

---

## 🛠️ Implementation Guides

### 1. Apple Ecosystem: iOS & macOS (Proxy MITM)

#### Option A: Shadowrocket Native Argument Suffix (Zero-Server Setup)
Shadowrocket supports the Surge `#!arguments` standard. Simply append `#domain=YOUR_DOMAIN` (without `https://`) to the end of the subscription link:

```text
https://raw.githubusercontent.com/Aquarius-Situla/TypeType-Redirect/main/typetype.sgmodule#domain=YOUR_TYPETYPE_DOMAIN
```

*(Fast Mirror for regions with throttled GitHub Raw connections):*
```text
https://ghfast.top/https://raw.githubusercontent.com/Aquarius-Situla/TypeType-Redirect/main/typetype.sgmodule#domain=YOUR_TYPETYPE_DOMAIN
```

**Steps**:
1. Open **Shadowrocket** -> **Config** -> **Modules** -> Tap **`+`**.
2. Paste the URL containing your `#domain=` suffix.
3. Enable the module. The domain can be customized at any time inside module settings.

---

#### Option B: Quantumult X (Rewrite Remote)
Quantumult X does not parse URL fragments (`#hash`). You can subscribe to the static snippet or deploy the dynamic Cloudflare Worker:
- **Snippet File**: [`typetype.snippet`](./typetype.snippet)
- Add under `[rewrite_remote]` in QuanX configuration.

---

### 2. Desktop & Android: Windows, Linux, Android (Browser Extension)

Due to Android’s **Network Security Configuration** (which prevents unrooted devices from intercepting HTTPS traffic with user CAs) and to avoid port conflicts with desktop proxy tools (such as **Clash Party / Clash Verge / v2rayN**), browser-level interception using the **Redirector** extension is the ideal method.

A pre-configured, sanitized template is included: [`redirector.example.json`](./redirector.example.json).

#### Installation & Setup:
1. Install **Redirector**:
   - **Chrome / Chromium / Kiwi (Android)**: [Chrome Web Store](https://chromewebstore.google.com/detail/redirector/lioaeidejmlpffbndjhaameocfldlhin)
   - **Microsoft Edge**: [Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/redirector/jhdjcofnjfeljeekjklhgfmfocfgibmm)
   - **Firefox**: Search for `Redirector` in Firefox Add-ons.
2. Download or copy [`redirector.example.json`](./redirector.example.json).
3. Open the file in any text editor, replace `https://www.example.com` with your actual TypeType domain, and save.
4. Click the **Redirector** icon in your browser toolbar -> **Import** -> Select your saved JSON file.

---

### 3. Edge Serverless: Dynamic Parameter Distribution (Cloudflare Worker)

If you manage multiple devices and prefer dynamic query parameter rewriting (`?domain=...`) across all clients without modifying template files:

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/) -> **Workers & Pages** -> **Create application** -> **Create Worker**.
2. Copy the code from [worker.js](./worker.js) into the editor and deploy.
3. Access your personalized endpoint:
   - **Quantumult X**: `https://[WORKER_URL]/snippet?domain=https://YOUR_DOMAIN`
   - **Shadowrocket**: `https://[WORKER_URL]/sgmodule?domain=https://YOUR_DOMAIN`

---

## 🔬 Technical Nuances & Limitations

### 1. Android CA Certificate Constraint
Beginning in Android 7.0 (API Level 24), the operating system by default ignores user-installed root certificates for application network traffic unless an application explicitly configures `network_security_config.xml`. On non-rooted Android devices, system-level MITM proxies cannot decrypt HTTPS traffic from standard browsers like Chrome. Hence, using extensions in extension-capable mobile browsers (e.g. Kiwi Browser, Firefox Android) is the only reliable zero-root approach.

### 2. QUIC / HTTP/3 Bypass Prevention
Modern browsers (especially Safari) prioritize **QUIC (HTTP/3 over UDP 443)** for Google and YouTube endpoints. Because proxy MITM engines can only decrypt TCP (TLS) handshakes:
- You **must reject UDP 443 traffic** in your proxy configuration to force browsers to fall back to TCP (HTTP/2).
- *Rule example*: `AND,((DEST-PORT,443),(PROTOCOL,UDP)),REJECT`

### 3. SSL Pinning on Native Apps
The official YouTube and Bilibili mobile applications utilize Certificate Pinning (SSL Pinning). Intercepting native app API traffic will trigger connection failures. These redirection rules are explicitly engineered for **web browsers (Safari, Chrome, Edge), external link clicks, and in-app web views**.

### 4. HTTP 302 vs 301 Semantics
All rules strictly emit **302 Found (Temporary Redirect)** or **307 Temporary Redirect**. Using `301 Moved Permanently` causes modern browsers to permanently cache the redirection locally, making it impossible to restore original site access or modify endpoints without clearing all browser site data.

### 5. Notice Regarding Niconico (`nicovideo.jp` / `nico.ms`)
Although TypeType contains foundational codebase hooks for Niconico, its upstream service integration and video stream delivery are **far from reaching a usable, production-ready standard**. As a result, redirection rules for Niconico are intentionally excluded for now and will only be considered once upstream playback stability is achieved.

---

## 📄 License

MIT License © 2026 Situla
