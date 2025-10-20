import React, { useEffect, useState } from "react";
import bannerImage from "../images/banner.jpg"; // Đảm bảo đường dẫn đúng
import "../styles/banner.css";

const SummerBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  // Không hiển thị nếu đã đóng
  if (!isVisible) return null;

  return (
    <>
      <div className="overlay"></div> {/* Lớp nền mờ */}
      <div className="banner-container">
        <div className="banner">
          <button className="close-btn" onClick={handleClose}>×</button>
          <img
            src={bannerImage}
            alt="Mùa hè rực rỡ - Giảm 20% đồ ăn vặt sấy khô"
          />
        </div>
      </div>
    </>
  );
};

export default SummerBanner;
