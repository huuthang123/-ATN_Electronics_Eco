import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import "../styles/SearchResults.css";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (keyword.trim()) {
      setLoading(true);
      axios
        .get(`http://localhost:5000/api/products/search-embedding?keyword=${encodeURIComponent(keyword)}`)
        .then((res) => {
          // Backend bạn trả về dạng { success: true, results: [...] }
          setResults(res.data.results || []);
          setLoading(false);
        })
        .catch((err) => {
          console.error("❌ Lỗi tìm kiếm:", err);
          setResults([]);
          setLoading(false);
        });
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [keyword]);

  const getFirstValidPrice = (prices) => {
    if (!prices) return 0;
    const validSizes = ["250", "500", "1000"];
    const keys = Object.keys(prices);
    const key = keys.find(k => validSizes.includes(k)) || keys[0];
    return key && prices[key] ? prices[key] : 0;
  };

  if (loading) return <p>⏳ Đang tìm kiếm...</p>;

  if (!results.length) return <p>Không tìm thấy sản phẩm</p>;

  return (
    <div className="search-results">
      <h2>Kết quả tìm kiếm cho: "{keyword}"</h2>
      <div className="product-list">
        {results.map((p) => {
          const price = getFirstValidPrice(p.prices);
          return (
            <div key={p._id} className="product-item">
              <img src={p.image} alt={p.name} />
              <h3>{p.name}</h3>
              <p>{price ? `${price.toLocaleString()}₫` : "Giá chưa cập nhật"}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SearchResults;
