const { getRecommendations } = require("../services/recommendation/recommendService");
const { recommendForUser } = require("../services/recommendation/ncfService");
const ProductDAO = require("../dao/ProductDAO");

// CF cũ
exports.getUserRecommendations = async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const recs = await getRecommendations(userId);
    res.json({ success: true, recommendations: recs });
  } catch (err) {
    console.error("Recommend ERROR:", err);
    res.status(500).json({ message: "Error generating recommendations", error: err.message });
  }
};

// ⭐ NCF mới
exports.getNcfRecommendations = async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    // Lấy tất cả product
    const products = await ProductDAO.getAll();
    const allProductIds = products.map(p => p.productId);

    const recs = await recommendForUser(userId, allProductIds, 10);

    res.json({ success: true, recommendations: recs });
  } catch (err) {
    console.error("NCF ERROR:", err);
    res.status(500).json({ message: "NCF error", error: err.message });
  }
};
