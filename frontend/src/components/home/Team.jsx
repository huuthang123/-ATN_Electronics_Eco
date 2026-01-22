// src/components/home/Team.jsx
import React from "react";
import "../../styles/team.css";

function Team() {
  const teamMembers = [
    {
      name: "Nguyễn Hữu Thắng",
      role: "Chuyên gia tư vấn thiết bị di động",
      bio: "Tư vấn cấu hình, hiệu năng và nhu cầu sử dụng thực tế cho từng dòng smartphone, giúp bạn chọn đúng máy – không tốn phí dư thừa.",
      image: "/images/team1.jpg",
    },
    {
      name: "Trần Minh Khoa",
      role: "Kỹ sư phần cứng & laptop",
      bio: "Hơn 5 năm kinh nghiệm về laptop văn phòng, gaming và đồ họa. Hỗ trợ tối ưu cấu hình, nâng cấp RAM, SSD và xử lý sự cố phần cứng.",
      image: "/images/team2.jpg",
    },
    {
      name: "Lê Thu Hà",
      role: "Chuyên viên chăm sóc khách hàng",
      bio: "Theo sát đơn hàng, hỗ trợ bảo hành – đổi trả, giải đáp mọi thắc mắc về sản phẩm và dịch vụ sau bán hàng của TechStore.",
      image: "/images/team3.jpg",
    },
  ];

  return (
    <section className="team" id="team">
      <div className="team-container">
        <div className="team-header">
          <p className="team-eyebrow">Đội ngũ của chúng tôi</p>
          <h2 className="team-title">Chuyên gia công nghệ đồng hành cùng bạn</h2>
          <p className="team-subtitle">
            Từ tư vấn chọn máy, tối ưu cấu hình cho đến hỗ trợ sau bán hàng – đội
            ngũ TechStore luôn sẵn sàng hỗ trợ bạn ở mọi bước.
          </p>
        </div>

        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <article className="team-card" key={index}>
              <div className="team-avatar">
                <img src={member.image} alt={member.name} loading="lazy" />
              </div>
              <h3 className="team-name">{member.name}</h3>
              <p className="team-role">{member.role}</p>
              <p className="team-bio">{member.bio}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Team;
