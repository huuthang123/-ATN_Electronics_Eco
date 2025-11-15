import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/ProductItem.css';

const ProductItem = ({ product, addToCart, selectedAddress, categoryName }) => {
  const [selectedPriceId, setSelectedPriceId] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { user } = useAuth();

  // ============================
  // PRODUCT PRICE OPTIONS (ProductPrice)
  // ============================
  const priceOptions = useMemo(() => {
    return Array.isArray(product?.productPrices) ? product.productPrices : [];
  }, [product]);

  // ============================
  // PRODUCT COLORS (ProductImage)
  // ============================
  const colorOptions = useMemo(() => {
    if (!product?.productImages) return [];

    const colors = product.productImages.map(
      (img) => img.color || "Không màu"
    );

    return [...new Set(colors)];
  }, [product]);

  // Group ảnh theo màu
  const imagesByColor = useMemo(() => {
    const map = {};
    if (Array.isArray(product?.productImages)) {
      product.productImages.forEach((img) => {
        const c = img.color || "Không màu";
        if (!map[c]) map[c] = [];
        map[c].push(img);
      });
    }
    return map;
  }, [product]);

  // Ảnh hiển thị theo màu chọn
  const selectedImage =
    imagesByColor[selectedColor]?.[0]?.imageUrl ||
    product?.productImages?.[0]?.imageUrl ||
    product?.image;

  // ============================
  // GET CURRENT PRICE (MAP BY priceId)
  // ============================
  const selectedPriceOption = priceOptions.find(
    (p) => Number(p.priceId) === Number(selectedPriceId)
  );

  const currentPrice = selectedPriceOption
    ? Number(selectedPriceOption.optionPrice)
    : 0;

  const optionLabel = selectedPriceOption?.optionName || "";
  const productId = product?.productId;

  // ============================
  // DEFAULT INITIAL VALUES
  // ============================
  useEffect(() => {
    if (!selectedPriceId && priceOptions.length > 0) {
      setSelectedPriceId(Number(priceOptions[0].priceId));
    }
    if (!selectedColor && colorOptions.length > 0) {
      setSelectedColor(colorOptions[0]);
    }
  }, [priceOptions, colorOptions]);

  // ============================
  // ADD TO CART
  // ============================
  const handleAddToCart = () => {
    if (!productId) return setError("Không xác định được sản phẩm.");
    if (currentPrice <= 0) return setError("Chưa có giá cho sản phẩm này.");

    const cartItem = {
      productId,
      name: product.name,
      price: currentPrice,
      image: selectedImage,
      quantity,
      categoryName: categoryName || "Không xác định",
      attributes: {
        option: optionLabel,
        color: selectedColor,
      },
    };

    addToCart(cartItem);
    setError(null);
  };

  // ============================
  // BUY NOW
  // ============================
  const handleBuyNow = () => {
    if (!user?.token) return navigate("/sign-in");

    const item = {
      productId,
      name: product.name,
      price: currentPrice,
      image: selectedImage,
      quantity,
      selected: true,
      categoryName,
      attributes: {
        option: optionLabel,
        color: selectedColor,
      },
    };

    navigate("/payment", {
      state: {
        selectedItems: [item],
        total: currentPrice * quantity,
        selectedAddress,
      },
    });
  };

  return (
    <div className="product-item">
      {!product ? (
        <div>Không có dữ liệu sản phẩm.</div>
      ) : (
        <>
          {/* IMAGE */}
          <div className="product-image-container">
            <img
              src={selectedImage}
              alt={product.name}
              className="product-image"
              onError={(e) => {
                e.target.src = "/placeholder.png";
                e.target.onerror = null;
              }}
            />
          </div>

          {/* INFO */}
          <div className="product-info">
            <h2 className="product-name">{product.name}</h2>
            <p className="product-category">Danh mục: {categoryName}</p>

            {error && <p className="error-message">{error}</p>}

            {/* PRICE */}
            <div className="product-price">
              <span className="current-price">
                {currentPrice > 0
                  ? `${currentPrice.toLocaleString()} VND${
                      optionLabel ? ` / ${optionLabel}` : ""
                    }`
                  : "Chưa có giá"}
              </span>
            </div>

            {/* PRICE OPTIONS */}
            <div className="product-options">
              <label>Chọn loại:</label>
              <div className="weight-options">
                {priceOptions.length > 0 ? (
                  priceOptions.map((opt) => (
                    <button
                      key={opt.priceId}
                      className={`weight-option ${
                        Number(selectedPriceId) === Number(opt.priceId)
                          ? "selected"
                          : ""
                      }`}
                      onClick={() => setSelectedPriceId(Number(opt.priceId))}
                    >
                      {opt.optionName}
                    </button>
                  ))
                ) : (
                  <span>Không có cấu hình giá</span>
                )}
              </div>
            </div>

            {/* COLOR OPTIONS */}
            <div className="color-section">
              <label>Chọn màu:</label>
              <div className="color-options">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    className={`color-option ${
                      selectedColor === color ? "selected" : ""
                    }`}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* QUANTITY */}
            <div className="product-quantity">
              <label>Số lượng:</label>
              <div className="quantity-controls">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  -
                </button>
                <input type="text" value={quantity} readOnly />
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="product-actions">
              <button
                onClick={handleAddToCart}
                className="btn-add"
                disabled={currentPrice <= 0}
              >
                Thêm vào giỏ
              </button>
              <button
                onClick={handleBuyNow}
                className="btn-buy"
                disabled={currentPrice <= 0}
              >
                Mua ngay
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductItem;
