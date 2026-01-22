import React, { useEffect, useState, useMemo } from "react";
import { apiConfig } from "../../config/api";
import { useAuth } from "../../context/AuthContext";
import "../../styles/ProductReview.css";

const BASE_URL =
  apiConfig?.baseURL ||
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000";

export default function ProductReview({ productId }) {
  const { user, token } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);

  // ⭐ FILTER + LOAD MORE
  const [selectedStar, setSelectedStar] = useState("all");
  const [visibleCount, setVisibleCount] = useState(5);

  // ===========================
  // 🔵 Load Review theo sản phẩm
  // ===========================
  const loadReviews = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/reviews/product/${productId}`);
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (err) {
      console.error("Lỗi load review:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [productId]);

  // ===========================
  // ⭐ FILTER REVIEWS
  // ===========================
  const filteredReviews = useMemo(() => {
    if (selectedStar === "all") return reviews;
    return reviews.filter((r) => Number(r.rating) === Number(selectedStar));
  }, [selectedStar, reviews]);

  // ⭐ REVIEWS TO DISPLAY (limit by visibleCount)
  const renderReviews = filteredReviews.slice(0, visibleCount);

  // Reset khi đổi filter
  const handleFilterChange = (star) => {
    setSelectedStar(star);
    setVisibleCount(5);
  };

  // ===========================
  // 🟢 Gửi review
  // ===========================
  const submitReview = async () => {
    if (!user) {
      alert("Bạn cần đăng nhập để đánh giá!");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          orderId: 1,
          rating,
          comment,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert(
          data.action === "update"
            ? "Cập nhật đánh giá thành công!"
            : "Gửi đánh giá thành công!"
        );
        setComment("");
        loadReviews();
      } else {
        alert("Không gửi được đánh giá.");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi gửi đánh giá!");
    }
  };

  return (
    <div className="review-container">
      <h3>Đánh giá sản phẩm</h3>

      {/* FORM REVIEW */}
      {user && (
        <div className="review-form">
          <label>Chọn số sao:</label>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            {[5, 4, 3, 2, 1].map((s) => (
              <option value={s} key={s}>
                {s} sao
              </option>
            ))}
          </select>

          <textarea
            placeholder="Nhập đánh giá..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>

          <button onClick={submitReview}>Gửi đánh giá</button>
        </div>
      )}

      {/* FILTER */}
      <div className="review-filter">
        {["all", 5, 4, 3, 2, 1].map((s) => (
          <button
            key={s}
            className={`filter-btn ${
              selectedStar === s ? "active" : ""
            }`}
            onClick={() => handleFilterChange(s)}
          >
            {s === "all" ? "Tất cả" : `${s} sao`}
          </button>
        ))}
      </div>

      <hr />

      {/* LIST REVIEW */}
      {loading ? (
        <p>Đang tải đánh giá...</p>
      ) : filteredReviews.length === 0 ? (
        <p className="review-empty">Không có đánh giá phù hợp.</p>
      ) : (
        <>
          <div className="review-list">
            {renderReviews.map((r) => (
              <div key={r.reviewId} className="review-item">
                <div className="review-header">
                  <strong>{r.username}</strong>
                  <span className="stars">⭐ {r.rating}/5</span>
                </div>
                <p>{r.comment}</p>
                <small>{new Date(r.createdAt).toLocaleString()}</small>
              </div>
            ))}
          </div>

          {/* ⭐ XEM THÊM + ẨN BỚT (ẩn bớt chỉ xuất hiện khi visibleCount > 5) */}
          {filteredReviews.length > 5 && (
            <div className="review-more dual-buttons">

              {/* Xem thêm */}
              {visibleCount < filteredReviews.length && (
                <button onClick={() => setVisibleCount(visibleCount + 5)}>
                  Xem thêm
                </button>
              )}

              {/* Ẩn bớt */}
              {visibleCount > 5 && (
                <button
                  className="collapse-btn"
                  onClick={() => setVisibleCount(5)}
                >
                  Ẩn bớt
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
