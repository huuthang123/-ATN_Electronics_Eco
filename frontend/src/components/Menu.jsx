import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCategories } from '../services/menuApi';
import axios from "axios";
import { useCart } from '../context/CartContext';
import '../styles/menu.css';

function Menu() {
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState({});
  const [sortOption, setSortOption] = useState('default');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const { addToCart } = useCart();
  const navigate = useNavigate();

  // ⭐ LOAD categories + ALL PRODUCTS + PRICES
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);

        // 1. Load categories
        const cats = await fetchCategories();
        setCategories(cats);

        // 2. Load ALL products
        const all = await axios.get("http://localhost:5000/api/products");

        // 3. Load PRICE for each product
        const productsWithPrice = await Promise.all(
          all.data.products.map(async (p) => {
            const priceRes = await axios.get(
              `http://localhost:5000/api/prices?productId=${p.productId}`
            );

            return {
              ...p,
              productPrices: priceRes.data.data || [] // ⭐ IMPORTANT
            };
          })
        );

        setAllProducts(productsWithPrice);
        setFilteredItems(productsWithPrice);

      } catch (err) {
        console.error(err);
        setError("Không thể tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // ⭐ FILTER BY CATEGORY
  useEffect(() => {
    const active = Object.keys(selectedCategories).filter(k => selectedCategories[k]);

    if (active.length === 0) {
      setFilteredItems(allProducts);
    } else {
      setFilteredItems(
        allProducts.filter(item => active.includes(item.categoryName))
      );
    }
  }, [selectedCategories, allProducts]);

  // ⭐ SORTING
  useEffect(() => {
    let items = [...filteredItems];

    const getFirstPrice = (p) => Number(p.productPrices?.[0]?.optionPrice || 0);

    if (sortOption === "low-to-high") {
      items.sort((a, b) => getFirstPrice(a) - getFirstPrice(b));
    } else if (sortOption === "high-to-low") {
      items.sort((a, b) => getFirstPrice(b) - getFirstPrice(a));
    } else if (sortOption === "best-seller") {
      items.sort((a, b) => (b.sold || 0) - (a.sold || 0));
    } else if (sortOption === "rating") {
      items.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    setFilteredItems(items);
  }, [sortOption]);

  const handleCategoryChange = (catName) => {
    setSelectedCategories(prev => ({
      ...prev,
      [catName]: !prev[catName]
    }));
  };

  // ⭐ ADD TO CART — dùng lựa chọn đầu tiên
  const handleAddToCart = async (item) => {
    const firstPrice = item.productPrices?.[0];

    if (!firstPrice) {
      setError("Sản phẩm chưa có giá");
      return;
    }

    const cartItem = {
      productId: item.productId,
      name: item.name,
      price: Number(firstPrice.optionPrice),
      image: item.image,
      quantity: 1,
      categoryName: item.categoryName,
      attributes: {
        option: firstPrice.optionName
      }
    };

    try {
      await addToCart(cartItem);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 2500);

    } catch (err) {
      console.error(err);
      setError("Không thể thêm vào giỏ hàng");
    }
  };

  return (
    <section className="menu">
      <div className="menu-wrapper">

        {/* SIDEBAR */}
        <div className="menu-sidebar">
          <h3>Danh Mục</h3>

          {loading && <p className="loading-message">Đang tải...</p>}
          {error && <p className="error-message">{error}</p>}
          {showSuccessMessage && (
            <div className="success-message">Đã thêm vào giỏ hàng!</div>
          )}

          <div className="category-checkbox">
            {categories.map(cat => (
              <label key={cat.categoryId}>
                <input
                  type="checkbox"
                  checked={!!selectedCategories[cat.name]}
                  onChange={() => handleCategoryChange(cat.name)}
                />
                {cat.name}
              </label>
            ))}
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="menu-main-content">

          <div className="section-title">
            <h2>SẢN PHẨM CỦA CHÚNG TÔI</h2>
          </div>

          <div className="menu-title">
            <h2>Tận hưởng vị ngon tự nhiên...</h2>
          </div>

          <div className="menu-products">

            {/* SORT */}
            <div className="menu-sort">
              <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                <option value="default">Sắp xếp: Mặc định</option>
                <option value="low-to-high">Giá thấp → cao</option>
                <option value="high-to-low">Giá cao → thấp</option>
                <option value="best-seller">Bán chạy</option>
                <option value="rating">Đánh giá</option>
              </select>
            </div>

            {/* PRODUCT LIST */}
            <div className="menu-lists">
              {loading ? (
                <div className="loading-container"><p>Đang tải...</p></div>
              ) : filteredItems.length === 0 ? (
                <div className="no-products"><p>Không có sản phẩm nào</p></div>
              ) : (
                filteredItems.map(item => {
                  const firstPrice = item.productPrices?.[0] || null;
                  const price = firstPrice ? Number(firstPrice.optionPrice) : 0;
                  const option = firstPrice ? firstPrice.optionName : "Không có giá";

                  return (
                    <div className="food-items" key={item.productId}>
                      <div
                        className="food-item"
                        onClick={() =>
                          navigate(
                            `/product/${encodeURIComponent(item.categoryName)}/${item.productId}`
                          )
                        }
                      >
                        <img src={item.image} alt={item.name} />
                        <h2>{item.name}</h2>
                      </div>

                      <div className="food-price">
                        <span className="current-price">
                          {price.toLocaleString()} VND / {option}
                        </span>
                      </div>

                      <div className="food-meta">
                        <span>⭐ {item.rating || 5}</span>
                        <span>Đã bán {item.sold || 0}</span>
                      </div>

                      <button
                        className="add-to-cart-btn"
                        onClick={(e) => { e.stopPropagation(); handleAddToCart(item); }}
                      >
                        🛒
                      </button>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

export default Menu;
