const ReviewDAO = require('../dao/ReviewDAO');
const Review = require('../models/Review');

class ReviewService {
  static async getByProduct(productId) {
    const rows = await ReviewDAO.getByProduct(productId);
    return rows.map(row => new Review(row));
  }

  static async getReviewForOrder({ userId, orderId, productId }) {
    const row = await ReviewDAO.getByUserOrderProduct({ userId, orderId, productId });
    return row ? new Review(row) : null;
  }

  static async createOrUpdateReview({ userId, orderId, productId, rating, comment }) {
    const existing = await ReviewDAO.getByUserOrderProduct({ userId, orderId, productId });

    if (existing) {
      await ReviewDAO.update(existing.reviewId, { rating, comment });
      return { action: 'update', reviewId: existing.reviewId };
    }

    await ReviewDAO.create({ userId, orderId, productId, rating, comment });
    return { action: 'create' };
  }

  static async deleteReview(reviewId, userId) {
    const myReview = await ReviewDAO.findById(reviewId);
    if (!myReview) throw new Error('Không tìm thấy đánh giá.');
    if (myReview.userId !== userId) throw new Error('Không có quyền xoá.');

    await ReviewDAO.delete(reviewId);
  }
}

module.exports = ReviewService;
