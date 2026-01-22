const ort = require("onnxruntime-node");
const path = require("path");
const fs = require("fs");

let session = null;
let userMap = null;
let itemMap = null;

// ===========================
// LOAD MODEL + MAPPING
// ===========================
async function loadNCF() {
  const modelPath = path.join(__dirname, "../../ml/ncf.onnx");
  const userMapPath = path.join(__dirname, "../../ml/user_mapping.json");
  const itemMapPath = path.join(__dirname, "../../ml/item_mapping.json");

  // Debug path (bật nếu cần)
  // console.log("MODEL PATH =", modelPath);

  if (!session) {
    session = await ort.InferenceSession.create(modelPath);
  }

  if (!userMap) {
    const rawUser = fs.readFileSync(userMapPath, "utf8");
    userMap = JSON.parse(rawUser);
  }

  if (!itemMap) {
    const rawItem = fs.readFileSync(itemMapPath, "utf8");
    itemMap = JSON.parse(rawItem);
  }
}

// ===========================
// PREDICT SCORE
// ===========================
async function predictScore(userId, productId) {
  await loadNCF();

  const uIdx = userMap[userId];
  const pIdx = itemMap[productId];

  if (uIdx === undefined || pIdx === undefined) return null;

  const userTensor = new ort.Tensor(
    "int64",
    BigInt64Array.from([BigInt(uIdx)]),
    [1]
  );

  const itemTensor = new ort.Tensor(
    "int64",
    BigInt64Array.from([BigInt(pIdx)]),
    [1]
  );

  const result = await session.run({
    user: userTensor,
    item: itemTensor,
  });

  return result.score.data[0];
}

// ===========================
// TOP N RECOMMENDATIONS
// ===========================
async function recommendForUser(userId, allProductIds, topN = 10) {
  await loadNCF();

  const scores = [];

  for (const pid of allProductIds) {
    const score = await predictScore(userId, pid);
    if (score !== null) {
      scores.push({ productId: pid, score });
    }
  }

  return scores
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}

module.exports = {
  recommendForUser,
  predictScore,
};
