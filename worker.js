/**
 * Cloudflare Worker: 动态域名替换与订阅分发
 * 
 * 使用方式：
 * 1. 部署到 Cloudflare Workers (免费开箱即用)
 * 2. 访问订阅链接时传入 ?domain= 你的域名：
 *    - Shadowrocket: https://your-worker.workers.dev/sgmodule?domain=https://my-domain.com
 *    - Quantumult X: https://your-worker.workers.dev/snippet?domain=https://my-domain.com
 */
export default {
  async fetch(request) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // 默认展示说明页
    if (pathname === "/" && !url.searchParams.has("domain")) {
      return new Response(`TypeType-Redirector Worker 运行正常。\n\n使用方式：\n- Shadowrocket: ${url.origin}/sgmodule?domain=https://你的域名\n- Quantumult X: ${url.origin}/snippet?domain=https://你的域名\n`, {
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }

    // 获取并规范化用户传入的目标域名
    let targetDomain = url.searchParams.get("domain") || "https://www.example.com";
    if (!targetDomain.startsWith("http://") && !targetDomain.startsWith("https://")) {
      targetDomain = `https://${targetDomain}`;
    }
    targetDomain = targetDomain.replace(/\/+$/, "");
    const domainWithoutProto = targetDomain.replace(/^https?:\/\//, "");

    // 根据路径判断返回哪个规则模版
    let sourceFile = "typetype.sgmodule";
    if (pathname.includes("snippet") || pathname.includes("quanx")) {
      sourceFile = "typetype.snippet";
    }

    const githubRawUrl = `https://raw.githubusercontent.com/Aquarius-Situla/TypeType-Redirector/main/${sourceFile}`;
    const resp = await fetch(githubRawUrl);
    if (!resp.ok) {
      return new Response("Failed to fetch upstream rule template from GitHub.", { status: 502 });
    }

    let text = await resp.text();

    // 动态替换模版中的域名
    text = text.replaceAll("https://www.example.com", targetDomain);
    text = text.replaceAll("{{{domain}}}", domainWithoutProto);
    text = text.replaceAll("domain:www.example.com", `domain:${domainWithoutProto}`);

    return new Response(text, {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "public, max-age=300",
        "access-control-allow-origin": "*",
      },
    });
  },
};
