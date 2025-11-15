require("dotenv").config();

const sql = require("mssql");
const { config } = require("../config/db");   // ⭐ import config đúng
const { loadWord2Vec, getSentenceVector } = require("../utils/word2vecSearch");
const { saveProductEmbedding } = require("../services/ProductEmbeddingService");

async function main() {
  try {
    console.log("🟦 CONFIG HIỆN TẠI:", config);   // ⭐ DEBUG
    console.log("🟦 DB SERVER:", config.server);

    // 1. Kết nối database
    await sql.connect(config);
    console.log("🔌 Connected to SQL Server");

    // 2. Load model Word2Vec
    await loadWord2Vec();
    console.log("📘 Word2Vec loaded");

    // 3. Lấy danh sách sản phẩm
    const result = await sql.query`
      SELECT productId, name FROM Product
    `;
    console.log("🔍 Tổng sản phẩm:", result.recordset.length);

    // 4. Tạo embedding cho từng tên
    for (const p of result.recordset) {
      const vector = getSentenceVector(p.name);

      if (!vector) {
        console.log("⚠ Không tạo embedding cho:", p.name);
        continue;
      }

      await saveProductEmbedding(p.productId, vector);
      console.log(`✅ Saved embedding: ${p.name}`);
    }

    console.log("🎉 DONE!");
    process.exit(0);

  } catch (err) {
    console.error("❌ ERROR:", err);
    process.exit(1);
  }
}

main();
