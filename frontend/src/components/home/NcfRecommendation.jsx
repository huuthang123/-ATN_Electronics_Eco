// src/components/NcfRecommendation.jsx
import React, { useEffect, useState } from "react";
import { apiConfig } from "../../config/api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../../styles/NcfRecommendation.css";

const BASE_URL =
  apiConfig?.baseURL ||
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000";

export default function NcfRecommendation() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [recommendedIds, setRecommendedIds] = useState([]);
  const [products, setProducts] = useState([]);

  // 1) Lấy danh sách gợi ý NCF theo userId
  useEffect(() => {
    if (!user) return;

    const fetchRecommendations = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/api/recommend/ncf/${user.userId}`
        );
        const data = await res.json();

        setRecommendedIds(data.recommendations || []);
      } catch (err) {
        console.error("Lỗi lấy NCF recommendation:", err);
      }
    };

    fetchRecommendations();
  }, [user]);

  // 2) Lấy chi tiết sản phẩm
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

  if (!user || products.length === 0) return null;

  return (
    <div className="ncf-wrapper">
      <div className="ncf-container">
        <h3 className="ncf-title">✨ Sản phẩm có thể bạn thích</h3>

        <div className="ncf-scroll">
          {products.map((p) => (
            <div
              key={p.productId}
              className="ncf-item"
              onClick={() =>
                navigate(`/product/${p.categoryName}/${p.productId}`)
              }
            >
              <img
                src={p.image || p.productImages?.[0]?.imageUrl}
                alt={p.name}
                className="ncf-img"
                onError={(e) => {
                  e.target.src = "/placeholder.png";
                  e.target.onerror = null;
                }}
              />

              <p className="ncf-name">{p.name}</p>

              <p className="ncf-price">
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
