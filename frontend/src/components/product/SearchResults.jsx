import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../layout/Header";
import "../../styles/SearchResults.css";
import { apiConfig } from "../../config/api";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("q") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const BASE_URL =
    apiConfig?.baseURL ||
    process.env.REACT_APP_API_URL ||
    "http://localhost:5000";

  // 🚀 LOAD KẾT QUẢ TÌM KIẾM
  useEffect(() => {
    if (!keyword.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);

    axios
      .get(`${BASE_URL}/api/search/semantic?q=${encodeURIComponent(keyword)}`)
      .then((res) => {
        const raw = Array.isArray(res.data) ? res.data : [];

        const normalized = raw.map((item) => ({
          productId: item.productId,
          name: item.name,
          image: item.image,
          similarity: item.similarity ?? null,
          productPrices: item.productPrices || [],
          rating: item.rating || 5,
          sold: item.sold || 0,
        }));

        setResults(normalized);
      })
      .catch((err) => {
        console.error("❌ Lỗi tìm kiếm:", err);
        setResults([]);
      })
      .finally(() => setLoading(false));
  }, [keyword, BASE_URL]);

  // ⭐ LẤY GIÁ GIỐNG MENU — LẤY OPTION ĐẦU TIÊN
  const getMenuPrice = (productPrices) => {
    const firstPrice = productPrices?.[0] || null;

    return {
      price: firstPrice ? Number(firstPrice.optionPrice) : 0,
      option: firstPrice ? firstPrice.optionName : "Không có giá",
    };
  };

  return (
    <>
      <Header />

      <div className="search-results-container">
        <h2 className="search-title">Kết quả tìm kiếm cho: "{keyword}"</h2>

        {!loading && (
          <p className="search-subtitle">Tìm thấy {results.length} sản phẩm</p>
        )}

        {loading ? (
          <div className="loading-container">
            <p>⏳ Đang tải...</p>
          </div>
        ) : results.length === 0 ? (
          <div className="no-products">
            <p>Không tìm thấy sản phẩm</p>
          </div>
        ) : (
          <div className="search-grid">
            {results.map((p) => {
              const { price, option } = getMenuPrice(p.productPrices);

              return (
                <div
                  key={p.productId}
                  className="search-card"
                  onClick={() => navigate(`/product/${p.productId}`)} // ⭐ ĐIỀU HƯỚNG CHUẨN
                >
                  {/* Ảnh sản phẩm */}
                  <div className="search-card-image">
                    <img src={p.image} alt={p.name} />
                  </div>

                  {/* Tên sản phẩm */}
                  <h3 className="search-card-title">{p.name}</h3>

                  {/* Giá */}
                  <div className="search-card-price">
                    {price > 0
                      ? `${price.toLocaleString()} VND / ${option}`
                      : "Giá chưa cập nhật"}
                  </div>

                  {/* Meta */}
                  <div className="food-meta">
                    <span>⭐ {p.rating}</span>
                    <span>Đã bán {p.sold}</span>
                  </div>

                  {/* Similarity */}
                  {p.similarity !== null && (
                    <div className="search-similarity">
                      {Math.round(p.similarity * 100)}% phù hợp
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

export default SearchResults;
