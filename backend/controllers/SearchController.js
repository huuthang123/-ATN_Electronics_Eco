const sql = require("mssql");
const cosine = require("cosine-similarity");
const { getSentenceVector } = require("../services/word2vec");

// ⭐ copy bufferToFloatArray vào đây
function bufferToFloatArray(buffer) {
  return Array.from(
    new Float32Array(buffer.buffer, buffer.byteOffset, buffer.byteLength / 4)
  );
}

exports.semanticSearch = async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.json([]);

    // 1️⃣ Embed truy vấn
    const queryVec = getSentenceVector(q);

    // 2️⃣ Lấy product embeddings
    const rows = await sql.query`
      SELECT p.productId, p.name, p.image, pe.embedding
      FROM Product p
      JOIN ProductEmbedding pe ON p.productId = pe.productId
    `;

    // 3️⃣ Tính similarity
    const scored = rows.recordset.map(r => {
      const productVec = bufferToFloatArray(r.embedding);

      return {
        ...r,
        similarity: cosine(queryVec, productVec)
      };
    });

    // 4️⃣ Sort
    scored.sort((a, b) => b.similarity - a.similarity);

    res.json(scored.slice(0, 20));
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: err.message });
  }
};
