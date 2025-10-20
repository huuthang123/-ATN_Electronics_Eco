import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMenuItems, fetchCategories } from '../services/menuService';
import { useCart } from '../context/CartContext';
import '../styles/menu.css';

function Menu() {
  const [categories, setCategories] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState({});
  const [sortOption, setSortOption] = useState('default');
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const cats = await fetchCategories();
        console.log('Categories:', cats);
        setCategories(cats);
        const allProducts = [];

        for (let cat of cats) {
          const items = await fetchMenuItems(cat._id);
          console.log(`Items for category ${cat.name}:`, items);
          allProducts.push(...items.map(item => ({ ...item, categoryName: cat.name })));
        }

        setAllItems(allProducts);
        setFilteredItems(allProducts);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Không thể tải danh mục hoặc sản phẩm');
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    let itemsToShow = [...allItems];

    const activeCats = Object.keys(selectedCategories).filter(key => selectedCategories[key]);
    if (activeCats.length > 0) {
      itemsToShow = itemsToShow.filter(item => activeCats.includes(item.categoryName));
    }

    if (sortOption === 'low-to-high') {
      itemsToShow.sort((a, b) => getFirstPrice(a) - getFirstPrice(b));
    } else if (sortOption === 'high-to-low') {
      itemsToShow.sort((a, b) => getFirstPrice(b) - getFirstPrice(a));
    } else if (sortOption === 'best-seller') {
      itemsToShow.sort((a, b) => (b.sold || 0) - (a.sold || 0));
    } else if (sortOption === 'rating') {
      itemsToShow.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    setFilteredItems(itemsToShow);
  }, [allItems, selectedCategories, sortOption]);

  const handleCategoryChange = (catName) => {
    setSelectedCategories(prev => ({
      ...prev,
      [catName]: !prev[catName]
    }));
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const getFirstPrice = (item) => {
    const keys = Object.keys(item.prices || {});
    const validSizes = ['250', '500', '1000'];
    const firstValidKey = keys.find(key => validSizes.includes(key)) || keys[0];
    return item.prices && firstValidKey ? item.prices[firstValidKey] : 0;
  };

  const handleAddToCart = (item) => {
    const keys = Object.keys(item.prices || {});
    const validSizes = ['250', '500', '1000'];
    const firstKey = keys.find(key => validSizes.includes(key)) || keys[0] || '250';
    
    if (!item.prices || !firstKey || !item.prices[firstKey]) {
      setError(`Giá sản phẩm "${item.name}" chưa được cập nhật`);
      return;
    }

    const price = item.prices[firstKey];
    addToCart({
      productId: item._id,
      name: item.name,
      price,
      image: item.image,
      quantity: 1,
      attributes: { size: firstKey },
      categoryName: item.categoryName || 'Không xác định'
    });
    setError(null);
  };

  return (
    <section className="menu" id="dactrung">
      <div className="menu-wrapper">
        <div className="menu-sidebar">
          <h3>Danh Mục</h3>
          {error && <p className="error-message">{error}</p>}
          <div className="category-checkbox">
            {categories.map(cat => (
              <label key={cat._id}>
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

        <div className="menu-main-content">
          <div className="section-title">
            <h2>SẢN PHẨM CỦA CHÚNG TÔI</h2>
          </div>

          <div className="menu-title">
            <h2>Tận hưởng vị ngon tự nhiên từ thực phẩm đa dạng...</h2>
          </div>

          <div className="menu-products">
            <div className="menu-sort">
              <select value={sortOption} onChange={handleSortChange}>
                <option value="default">Sắp xếp: Mặc định</option>
                <option value="low-to-high">Giá: Thấp đến cao</option>
                <option value="high-to-low">Giá: Cao đến thấp</option>
                <option value="best-seller">Bán chạy</option>
                <option value="rating">Đánh giá</option>
              </select>
            </div>

            <div className="menu-lists">
              {filteredItems.map(item => {
                const keys = Object.keys(item.prices || {});
                const validSizes = ['250', '500', '1000'];
                const firstKey = keys.find(key => validSizes.includes(key)) || keys[0] || '250';
                const price = item.prices ? item.prices[firstKey] : 0;
                const originalPrice = price ? price / 0.8 : 0;

                return (
                  <div className="food-items" key={item._id}>
                    <div
                      className="food-item"
                      onClick={() => navigate(`/${encodeURIComponent(item.categoryName)}/${item._id}`)}
                    >
                      <img src={item.image} alt={item.name} />
                      <h2>{item.name}</h2>
                    </div>
                    <div className="food-price">
                      <span className="current-price">
                        {price ? `${price.toLocaleString()} VND` : 'Giá chưa cập nhật'} / {firstKey}
                      </span>
                      <span className="original-price">
                        {originalPrice ? `${Math.round(originalPrice).toLocaleString()} VND` : 'N/A'}
                      </span>
                      <span className="discount">-20%</span>
                    </div>
                    <div className="food-meta">
                      <span>⭐ {item.rating || 5.0}</span>
                      <span>Đã bán {item.sold || 0}</span>
                    </div>
                    <button
                      className="add-to-cart-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(item);
                      }}
                    >
                      🛒
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Menu;