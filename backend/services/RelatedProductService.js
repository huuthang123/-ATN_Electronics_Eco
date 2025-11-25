const sql = require("mssql");
const cosine = require("cosine-similarity");
const { getProductEmbedding } = require("./ProductEmbeddingService");

function bufferToFloatArray(bf) {
  return Array.from(
    new Float32Array(bf.buffer, bf.byteOffset, bf.byteLength / 4)
  );
}

async function getRelatedProducts(productId, topK = 6) {
  // 1️⃣ Lấy category
  const base = await sql.query`
    SELECT categoryId FROM Product WHERE productId = ${productId}
  `;
  if (!base.recordset.length) return [];

  const categoryId = base.recordset[0].categoryId;

  // 2️⃣ Lấy embedding sản phẩm gốc
  const baseEmbedding = await getProductEmbedding(productId);
  if (!baseEmbedding) return [];

  // 3️⃣ Lấy sản phẩm cùng category
  const rows = await sql.query`
    SELECT p.productId, p.name, p.image, pe.embedding
    FROM Product p
    JOIN ProductEmbedding pe ON p.productId = pe.productId
    WHERE p.categoryId = ${categoryId} AND p.productId <> ${productId}
  `;

  const scored = rows.recordset.map(r => {
    const vec = bufferToFloatArray(r.embedding);
    return {
      productId: r.productId,
      name: r.name,
      image: r.image,
      similarity: cosine(baseEmbedding, vec)
    };
  });

  scored.sort((a, b) => b.similarity - a.similarity);

  const relatedIds = scored.slice(0, topK).map(s => s.productId);

  // 4️⃣ Lấy giá của từng sản phẩm
  const prices = await sql.query`
    SELECT * FROM ProductPrice
    WHERE productId IN (${relatedIds})
  `;

  // 5️⃣ Merge giá vào từng product
  const result = scored.slice(0, topK).map(item => ({
    ...item,
    productPrices: prices.recordset.filter(pr => pr.productId === item.productId)
  }));

  return result;
}

module.exports = { getRelatedProducts };
