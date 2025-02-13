const fs = require("fs");
const path = require("path");

const DIRECTORY_PATH = __dirname; // 현재 폴더 (C:\Dynosour)
const SITEMAP_PATH = path.join(DIRECTORY_PATH, "sitemap.xml");

function generateSitemap() {
  try {
    const files = fs.readdirSync(DIRECTORY_PATH);

    const urls = files
      .filter(file => file.endsWith(".html")) // .html 파일만 포함
      .map(file => {
        const filePath = path.join(DIRECTORY_PATH, file);
        const stats = fs.statSync(filePath);
        const lastMod = stats.mtime.toISOString().split("T")[0]; // 마지막 수정 날짜 (YYYY-MM-DD)

        return `<url>
          <loc>http://example.com/files/${file}</loc>
          <lastmod>${lastMod}</lastmod>
        </url>`;
      });

    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls.join("\n")}
    </urlset>`;

    fs.writeFileSync(SITEMAP_PATH, sitemapContent, "utf8");
    console.log(`✅ Sitemap이 생성되었습니다: ${SITEMAP_PATH}`);
  } catch (error) {
    console.error("❌ Sitemap 생성 중 오류 발생:", error);
  }
}

// 실행
generateSitemap();
