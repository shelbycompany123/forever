import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        <div>
          <img className="mb-5 w-32" src={assets.logo} alt="" />
          <p className="w-full md:w-2/3 text-gray-600">
            ✦ Chúng tôi cam kết mang đến những sản phẩm chất lượng cao với thiết
            kế độc đáo và dịch vụ khách hàng xuất sắc.
          </p>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">Công ty</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>✦ Trang chủ</li>
            <li>✦ Về chúng tôi</li>
            <li>✦ Giao hàng</li>
            <li>✦ Chính sách bảo mật</li>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">LIÊN HỆ</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>✦ Người sáng lập: Nguyễn Minh Hiếu</li>
            <li>✦ Số điện thoại: 0978677395</li>
            <li>✦ Email: yisep2369@gmail.com</li>
          </ul>
        </div>
      </div>
      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          ✦ Bản quyền 2025@ forever.com - Đã đăng ký bản quyền. ✦
        </p>
      </div>
    </div>
  );
};

export default Footer;
