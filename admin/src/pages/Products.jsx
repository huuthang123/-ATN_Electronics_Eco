import { useState, useEffect } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import { getProducts, addProduct, updateProduct, deleteProduct } from "../services/productService";
import { getCategories } from "../services/categoryService";
import "../styles/ProductList.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    image: "",
    categoryId: "",
    prices: {},
    stock: 0
  });

  const [priceList, setPriceList] = useState([{ key: "", value: 0 }]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data.products || data || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      alert("Lỗi khi tải danh sách sản phẩm: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data.categories || data || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh mục:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      alert("Vui lòng nhập tên sản phẩm");
      return;
    }
    if (!formData.categoryId) {
      alert("Vui lòng chọn danh mục");
      return;
    }
    if (!formData.image.trim()) {
      alert("Vui lòng nhập URL hình ảnh");
      return;
    }
    if (formData.stock < 0) {
      alert("Số lượng tồn kho phải >= 0");
      return;
    }

    const prices = {};
    priceList.forEach(item => {
      if (item.key && item.value) {
        prices[item.key] = Number(item.value);
      }
    });

    try {
      setLoading(true);
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        image: formData.image.trim(),
        categoryId: formData.categoryId,
        prices: prices,
        stock: Number(formData.stock) || 0
      };

      if (isEditing && formData.id) {
        await updateProduct(formData.id, productData);
        alert("Cập nhật sản phẩm thành công!");
      } else {
        await addProduct(productData);
        alert("Thêm sản phẩm thành công!");
      }
      
      fetchProducts();
      handleCloseModal();
    } catch (error) {
      alert("Lỗi: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      try {
        setLoading(true);
        await deleteProduct(id);
        alert("Xóa sản phẩm thành công!");
        // Remove from UI immediately
        setProducts(products.filter(p => (p.productId || p._id) !== id));
      } catch (error) {
        alert("Lỗi khi xóa sản phẩm: " + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (product) => {
    const priceArr = Object.entries(product.prices || {}).map(([key, value]) => ({ 
      key, 
      value: Number(value) 
    }));

    setFormData({
      id: product.productId || product._id,
      name: product.name || "",
      description: product.description || "",
      image: product.image || "",
      categoryId: product.categoryId?._id || product.categoryId || "",
      prices: product.prices || {},
      stock: product.stock || 0
    });
    setPriceList(priceArr.length ? priceArr : [{ key: "", value: 0 }]);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleAddNew = () => {
    resetForm();
    setIsEditing(false);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    resetForm();
    setShowModal(false);
    setIsEditing(false);
  };

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      description: "",
      image: "",
      categoryId: "",
      prices: {},
      stock: 0
    });
    setPriceList([{ key: "", value: 0 }]);
  };

  const handlePriceChange = (index, field, value) => {
    const updatedPrices = [...priceList];
    updatedPrices[index][field] = value;
    setPriceList(updatedPrices);
  };

  const addPriceField = () => {
    setPriceList([...priceList, { key: "", value: 0 }]);
  };

  const removePriceField = (index) => {
    const updatedPrices = priceList.filter((_, i) => i !== index);
    setPriceList(updatedPrices.length ? updatedPrices : [{ key: "", value: 0 }]);
  };

  // Icon components
  const PencilIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
  );

  const TrashIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      <line x1="10" y1="11" x2="10" y2="17"></line>
      <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
  );

  return (
    <ProtectedRoute>
      <div className="product-management-wrapper">
        <div className="product-management-container">
        <div className="product-management-header">
          <h1>Quản Lý Sản Phẩm</h1>
          <button 
            onClick={handleAddNew} 
            className="btn-add-product"
            disabled={loading}
          >
            + Thêm Sản Phẩm Mới
          </button>
        </div>

        <div className="product-list">
          {loading && products.length === 0 ? (
            <div className="loading-state">
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Ảnh</th>
                  <th>Tên Sản Phẩm</th>
                  <th>Danh Mục</th>
                  <th>Giá</th>
                  <th>Tồn Kho</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      <p>Chưa có sản phẩm nào. Hãy thêm sản phẩm mới!</p>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.productId || product._id}>
                      <td>
                        <img 
                          src={product.image || "/placeholder.png"} 
                          alt={product.name} 
                          className="product-image"
                          onError={(e) => { e.target.src = "/placeholder.png"; }}
                        />
                      </td>
                      <td className="product-name">{product.name}</td>
                      <td>{product.categoryId?.name || product.categoryName || "N/A"}</td>
                      <td className="product-price">
                        {product.prices && Object.keys(product.prices).length > 0 
                          ? Object.entries(product.prices).map(([k, v]) => (
                              <span key={k} className="price-item">
                                {k}: {Number(v).toLocaleString('vi-VN')}₫
                              </span>
                            ))
                          : <span className="no-price">Chưa có giá</span>
                        }
                      </td>
                      <td className="product-stock">{product.stock || 0}</td>
                      <td className="action-buttons">
                        <button 
                          onClick={() => handleEdit(product)} 
                          className="btn-edit"
                          disabled={loading}
                          title="Chỉnh sửa"
                        >
                          <PencilIcon />
                          <span>Sửa</span>
                        </button>
                        <button 
                          onClick={() => handleDelete(product.productId || product._id)} 
                          className="btn-delete"
                          disabled={loading}
                          title="Xóa"
                        >
                          <TrashIcon />
                          <span>Xóa</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal for Add/Edit */}
        {showModal && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{isEditing ? "Chỉnh Sửa Sản Phẩm" : "Thêm Sản Phẩm Mới"}</h2>
                <button className="modal-close" onClick={handleCloseModal}>×</button>
              </div>

              <form onSubmit={handleSubmit} className="product-form-modal">
                <div className="form-group">
                  <label htmlFor="name">
                    Tên sản phẩm <span className="required">*</span>
                  </label>
                  <input 
                    type="text" 
                    id="name" 
                    value={formData.name} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                    required 
                    placeholder="Nhập tên sản phẩm"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Mô tả</label>
                  <textarea 
                    id="description" 
                    value={formData.description} 
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                    rows="3"
                    placeholder="Nhập mô tả sản phẩm"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="image">
                    URL hình ảnh <span className="required">*</span>
                  </label>
                  <input 
                    type="url" 
                    id="image" 
                    value={formData.image} 
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })} 
                    required 
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData.image && (
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      className="image-preview"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="categoryId">
                    Danh mục <span className="required">*</span>
                  </label>
                  <select 
                    id="categoryId" 
                    value={formData.categoryId} 
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} 
                    required
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((cat) => (
                      <option key={cat._id || cat.categoryId} value={cat._id || cat.categoryId}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Giá sản phẩm</label>
                  <div className="price-list-container">
                    {priceList.map((price, index) => (
                      <div key={index} className="price-item-row">
                        <input 
                          type="text" 
                          placeholder="Tùy chọn (VD: 250g, M, L)" 
                          value={price.key} 
                          onChange={(e) => handlePriceChange(index, 'key', e.target.value)} 
                          className="price-key"
                        />
                        <input 
                          type="number" 
                          placeholder="Giá (VNĐ)" 
                          value={price.value} 
                          onChange={(e) => handlePriceChange(index, 'value', e.target.value)} 
                          min="0"
                          className="price-value"
                        />
                        <button 
                          type="button" 
                          onClick={() => removePriceField(index)}
                          className="btn-remove-price"
                          disabled={priceList.length === 1}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button 
                      type="button" 
                      onClick={addPriceField}
                      className="btn-add-price"
                    >
                      + Thêm giá
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="stock">
                    Số lượng tồn kho <span className="required">*</span>
                  </label>
                  <input 
                    type="number" 
                    id="stock" 
                    value={formData.stock} 
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })} 
                    required 
                    min="0"
                    placeholder="0"
                  />
                </div>

                <div className="modal-footer">
                  <button 
                    type="button" 
                    onClick={handleCloseModal}
                    className="btn-cancel"
                    disabled={loading}
                  >
                    Hủy
                  </button>
                  <button 
                    type="submit" 
                    className="btn-submit"
                    disabled={loading}
                  >
                    {loading ? "Đang xử lý..." : (isEditing ? "Cập nhật" : "Thêm mới")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Products;
