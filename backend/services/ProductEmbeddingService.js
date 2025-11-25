const sql = require("mssql");

// ⭐ Convert mảng float → Buffer Float32Array
function floatArrayToBuffer(arr) {
  return Buffer.from(Float32Array.from(arr).buffer);
}

// ⭐ Convert Buffer → mảng float
function bufferToFloatArray(buffer) {
  return Array.from(
    new Float32Array(buffer.buffer, buffer.byteOffset, buffer.byteLength / 4)
  );
}

async function saveProductEmbedding(productId, vector) {
  const buffer = floatArrayToBuffer(vector);

  await sql.query`
    MERGE ProductEmbedding AS target
    USING (SELECT ${productId} AS productId) AS src
    ON target.productId = src.productId
    WHEN MATCHED THEN
        UPDATE SET 
            embedding = ${buffer},
            vectorDim = ${vector.length},
            updatedAt = GETDATE()
    WHEN NOT MATCHED THEN
        INSERT (productId, embedding, vectorDim)
        VALUES (${productId}, ${buffer}, ${vector.length});
  `;
}

async function getProductEmbedding(productId) {
  const res = await sql.query`
    SELECT embedding, vectorDim
    FROM ProductEmbedding
    WHERE productId = ${productId}
  `;

  if (res.recordset.length === 0) return null;
  return bufferToFloatArray(res.recordset[0].embedding);
}

async function getAllEmbeddings() {
  const res = await sql.query`
     SELECT productId, embedding, vectorDim
     FROM ProductEmbedding
  `;

  return res.recordset.map(row => ({
    productId: row.productId,
    embedding: bufferToFloatArray(row.embedding)
  }));
}

module.exports = {
  saveProductEmbedding,
  getProductEmbedding,
  getAllEmbeddings
};
