const fs = require("fs");
const path = require("path");

const DIRECTORY_PATH = __dirname; // 현재 폴더 (C:\workspace\행복한 집)
const SITEMAP_PATH = path.join(DIRECTORY_PATH, "sitemap.xml");

function generateSitemap() {
  try {
    if (!fs.existsSync(DIRECTORY_PATH)) {
      console.error("❌ ERROR: 지정된 폴더가 존재하지 않습니다:", DIRECTORY_PATH);
      return;
    }

    const files = fs.readdirSync(DIRECTORY_PATH);

    if (files.length === 0) {
      console.warn("⚠️ 경고: HTML 파일이 없습니다. sitemap.xml을 생성하지 않습니다.");
      return;
    }

    const urls = files
      .filter(file => file.endsWith(".html")) // .html 파일만 포함
      .map(file => {
        const filePath = path.join(DIRECTORY_PATH, file);
        let lastMod = "2024-01-01"; // 기본값

        try {
          const stats = fs.statSync(filePath);
          lastMod = stats.mtime.toISOString().split("T")[0]; // YYYY-MM-DD 형식
        } catch (err) {
          console.error(`❌ ERROR: ${file}의 수정 날짜를 가져올 수 없습니다.`, err);
        }

        return `<url>
          <loc>http://example.com/files/${encodeURIComponent(file)}</loc>
          <lastmod>${lastMod}</lastmod>
        </url>`;
      });

    if (urls.length === 0) {
      console.warn("⚠️ 경고: HTML 파일이 존재하지 않습니다. sitemap.xml을 생성하지 않습니다.");
      return;
    }

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
