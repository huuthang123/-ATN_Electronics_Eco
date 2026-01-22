import React, { useEffect, useState } from "react";
import { apiConfig } from "../../config/api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../../styles/RecommendationBar.css";

const BASE_URL =
  apiConfig?.baseURL ||
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000";

export default function RecommendationBar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [recommendedIds, setRecommendedIds] = useState([]);
  const [products, setProducts] = useState([]);

  // 1) Lấy danh sách gợi ý theo userId
  useEffect(() => {
    if (!user) return; // chưa đăng nhập thì không hiện

    const fetchRecommendations = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/api/recommend/user/${user.userId}`
        );
        const data = await res.json();
        setRecommendedIds(data.recommendations || []);
      } catch (err) {
        console.error("Lỗi lấy recommendation:", err);
      }
    };

    fetchRecommendations();
  }, [user]);

  // 2) Lấy chi tiết sản phẩm theo productId
  useEffect(() => {
    if (recommendedIds.length === 0) return;

    const fetchProducts = async () => {
      try {
        const list = [];
        for (const item of recommendedIds) {
          const res = await fetch(`${BASE_URL}/api/products/${item.productId}`);
          const data = await res.json();
          list.push(data.product || data);
        }
        setProducts(list);
      } catch (err) {
        console.error("Lỗi load chi tiết sản phẩm:", err);
      }
    };

    fetchProducts();
  }, [recommendedIds]);

  // Không login hoặc không có gợi ý thì ẩn hẳn, tránh khoảng trắng lệch
  if (!user || products.length === 0) return null;

  return (
    <div className="recom-wrapper">
      <div className="recom-container">
        <h3 className="recom-title">Sản phẩm được người khác tin dùng</h3>

        <div className="recom-scroll">
          {products.map((p) => (
            <div
              key={p.productId}
              className="recom-item"
              onClick={() =>
                navigate(`/product/${p.categoryName}/${p.productId}`)
              }
            >
              <img
                src={p.image || p.productImages?.[0]?.imageUrl}
                alt={p.name}
                className="recom-img"
                onError={(e) => {
                  e.target.src = "/placeholder.png";
                  e.target.onerror = null;
                }}
              />

              <p className="recom-name">{p.name}</p>

              <p className="recom-price">
                {p.productPrices?.[0]
                  ? `${p.productPrices[0].optionPrice.toLocaleString()} VND`
                  : "—"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
