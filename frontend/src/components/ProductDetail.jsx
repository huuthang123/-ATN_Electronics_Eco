import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header";
import ProductItem from "./ProductItem";
import RelatedItems from "./RelatedItems";
import ProductReview from "./ProductReview";
import Footer from "./Footer";
import CartSidebar from "./CartSidebar";
import ShippingAddressForm from "./ShippingAddressForm";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { apiConfig } from "../config/api";
import "../styles/ProductDetail.css";

const BASE_URL =
  apiConfig?.baseURL ||
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ====================================================
  // 🟩 FETCH PRODUCT
  // ====================================================
  const fetchProduct = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/products/${id}`);
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      const p = data.product || data;

      setProduct({
        ...p,
        productId: p.productId,
        categoryId: p.categoryId,
        categoryName: p.categoryName,
        productPrices: p.productPrices || [],
        productImages: p.productImages || [],
      });
    } catch (err) {
      console.error("❌ Error fetching product:", err);
      setError("Không thể tải thông tin sản phẩm.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  // ====================================================
  // 🟦 FETCH RELATED PRODUCTS (embedding + category)
  // ====================================================
  const fetchRelatedProducts = useCallback(async () => {
    if (!id) return;

    try {
      const response = await fetch(`${BASE_URL}/api/products/${id}/related`);
      const data = await response.json();

      setRelatedProducts(data.related || data);
    } catch (err) {
      console.error("❌ Error fetching related products:", err);
    }
  }, [id]);

  // ====================================================
  // 🟩 USE EFFECTS
  // ====================================================
  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  useEffect(() => {
    fetchRelatedProducts();
  }, [fetchRelatedProducts]);

  // ====================================================
  // 🖼️ RENDER
  // ====================================================
  if (loading) return <div>Đang tải sản phẩm...</div>;
  if (!product) return <div>Không tìm thấy sản phẩm.</div>;

  return (
    <div className="product-detail">
      <Header />

      <div className="product-content">
        {/* ================= PRODUCT ================= */}
        <ProductItem
          product={product}
          addToCart={addToCart}
          selectedAddress={selectedAddress}
          categoryName={product.categoryName}
        />

        {/* ================= REVIEW ================= */}
        <ProductReview productId={product.productId} />

        {/* ================= RELATED ================= */}
        <RelatedItems
          relatedProducts={relatedProducts}
        />
      </div>

      <Footer />
      <CartSidebar />
    </div>
  );
};

export default ProductDetail;
