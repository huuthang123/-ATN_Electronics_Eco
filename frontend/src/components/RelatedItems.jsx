import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/RelatedItems.css';

const RelatedItems = ({ relatedProducts, currentProductId, addToCart }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState(null);

  const getPriceFromSchema = (product, size) => {
    if (!product || !product.prices) {
      console.error('Dữ liệu prices không tồn tại cho sản phẩm', product?.name);
      return undefined;
    }
    const price = product.prices[size];
    if (price === undefined) {
      console.error('Không tìm thấy giá cho kích thước', size, 'của sản phẩm', product.name);
      return undefined;
    }
    return price;
  };

  const handleAddToCart = (product) => {
    const size = '250'; // Mặc định size nhỏ nhất
    const price = getPriceFromSchema(product, size);
    if (!price) {
      setError('Giá sản phẩm chưa được cập nhật. Vui lòng thử lại sau.');
      return;
    }

    addToCart({
      productId: product._id,
      name: product.name,
      price,
      image: product.image,
      attributes: { size },
      categoryName: product.categoryName || 'Không xác định',
      quantity: 1,
    });
    setError(null);
  };

  return (
    <div className="related-items">
      <h3>Sản phẩm cùng loại</h3>
      {error && <p className="error-message">{error}</p>}
      <div className="related-list">
        {relatedProducts.length > 0 ? (
          relatedProducts
            .filter((product) => product._id !== currentProductId)
            .map((product) => {
              const size = '250';
              const currentPrice = getPriceFromSchema(product, size);

              return (
                <div key={product._id} className="related-item">
                  <div
                    onClick={() => navigate(`/${product.categoryName || 'product'}/${product._id}`)}
                    className="related-item-content"
                  >
                    <img src={product.image} alt={product.name} className="related-image" />
                    <h4 className="related-name">{product.name}</h4>
                    <p className="related-price">
                      {currentPrice
                        ? `${currentPrice.toLocaleString()} VND / ${size}g`
                        : `Giá chưa cập nhật ${size}g`}
                    </p>
                  </div>
                  <div className="related-actions">
                    <button
                      className="btn-add"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      disabled={!currentPrice}
                    >
                      🛒
                    </button>
                  </div>
                </div>
              );
            })
        ) : (
          <p>Không có sản phẩm liên quan.</p>
        )}
      </div>
    </div>
  );
};

export default RelatedItems;