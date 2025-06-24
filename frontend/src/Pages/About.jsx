import React from "react";
import Title from "../Component/Title";
import { assets } from "../assets/assets";
import NewletterBox from "../Component/NewletterBox";

const About = () => {
  return (
    <div className="container mx-auto px-4 border-t pt-10">
      {/* Title */}
      <div className="text-center text-2xl mb-10">
        <Title text1="VỀ" text2="CHÚNG TÔI" />
      </div>

      {/* About Content */}
      <div className="flex flex-col md:flex-row items-center gap-12 mb-16">
        {/* Image */}
        <img
          src={assets.about_img}
          alt="Về chúng tôi"
          className="w-full md:max-w-md rounded-lg shadow-lg"
        />

        {/* Text */}
        <div className="flex flex-col gap-6 text-gray-600 md:w-1/2">
          <p>
            Forever được sinh ra từ niềm đam mê đổi mới và mong muốn cách mạng
            hóa cách mọi người mua sắm trực tuyến. Hành trình của chúng tôi bắt
            đầu với một ý tưởng đơn giản: cung cấp một nền tảng nơi khách hàng
            có thể dễ dàng khám phá, tìm hiểu và mua sắm nhiều loại sản phẩm từ
            sự thoải mái của ngôi nhà của họ.
          </p>
          <p>
            Với cam kết về chất lượng, sự hài lòng của khách hàng và cải tiến
            liên tục, Forever không chỉ là một cửa hàng — mà còn là một cộng
            đồng. Chúng tôi nỗ lực mang đến cho bạn những sản phẩm tốt nhất,
            được tuyển chọn cẩn thận để đáp ứng nhu cầu và phong cách đang phát
            triển của bạn.
          </p>
          <p>
            Sứ mệnh của chúng tôi là làm cho việc mua sắm trở thành một trải
            nghiệm vui vẻ và liền mạch cho tất cả mọi người.
          </p>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="text-center text-4xl mb-10">
        <Title text1="TẠI SAO" text2="CHỌN CHÚNG TÔI" />
      </div>

      <div className="flex flex-col md:flex-row gap-8 mb-20 text-sm">
        {/* Quality Assurance */}
        <div className="border rounded-lg p-8 flex flex-col gap-4 flex-1">
          <b>Đảm bảo chất lượng:</b>
          <p className="text-gray-600">
            Chúng tôi cẩn thận lựa chọn và kiểm tra từng sản phẩm để đảm bảo nó
            đáp ứng các tiêu chuẩn chất lượng nghiêm ngặt của chúng tôi.
          </p>
        </div>

        {/* Convenience */}
        <div className="border rounded-lg p-8 flex flex-col gap-4 flex-1">
          <b>Thuận tiện:</b>
          <p className="text-gray-600">
            Với giao diện thân thiện với người dùng và quy trình đặt hàng dễ
            dàng, việc mua sắm chưa bao giờ dễ dàng hơn thế.
          </p>
        </div>

        {/* Exceptional Customer Service */}
        <div className="border rounded-lg p-8 flex flex-col gap-4 flex-1">
          <b>Dịch vụ khách hàng xuất sắc:</b>
          <p className="text-gray-600">
            Đội ngũ chuyên nghiệp tận tâm của chúng tôi luôn sẵn sàng hỗ trợ bạn
            trong mọi bước, đảm bảo sự hài lòng của bạn là ưu tiên hàng đầu của
            chúng tôi.
          </p>
        </div>
      </div>

      {/* Newsletter */}
      <NewletterBox />
    </div>
  );
};

export default About;
