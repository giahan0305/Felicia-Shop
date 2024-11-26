
function Footer() {
  return (
    <footer className="w-100 bg-light text-dark pt-4" id="footer">
      <div className="text-center text-lg-start">
        {/* Khu vực mạng xã hội */}
        <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
          <div className="me-5 d-none d-lg-block">
            <span>Theo dõi chúng tôi tại:</span>
          </div>
          <div>
            <a href="#" className="me-4 text-reset"><i className="bi bi-facebook"></i></a>
            <a href="#" className="me-4 text-reset"><i className="bi bi-twitter"></i></a>
            <a href="#" className="me-4 text-reset"><i className="bi bi-google"></i></a>
            <a href="#" className="me-4 text-reset"><i className="bi bi-instagram"></i></a>
          </div>
        </section>

        {/* Nội dung chính của footer */}
        <section className="mt-5">
          <div className="container text-center text-md-start">
            <div className="row justify-content-between">
              {/* Thông tin công ty */}
              <div className="col-md-3 col-lg-3 col-xl-3 mb-4">
                <h6 className="text-uppercase fw-bold">CÔNG TY CỔ PHẦN PHÚC LONG HERITAGE</h6>
                <p>Trụ sở chính: Công ty Cổ Phần Phúc Long Heritage - ĐKKD: 0316 871719 do sở KHĐT TPHCM cấp lần đầu ngày 21/05/2021</p>
                <p>Địa chỉ: Phòng 702, Tầng 7, Tòa nhà Central Plaza, số 17 Lê Duẩn, phường Bến Nghé, quận 1, Hồ Chí Minh</p>
              </div>

              {/* Liên hệ */}
              <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mb-4">
                <h6 className="text-uppercase fw-bold">Liên hệ</h6>
                <p><i className="bi bi-phone me-3"></i> Hotline Đặt hàng: 1800 6779</p>
                <p><i className="bi bi-phone me-3"></i> Hotline Công ty: 1900 2345 18 (Bấm phím 0: Lễ Tân | phím 1: CSKH)</p>
                <p><i className="bi bi-envelope me-3"></i> sales@felicia.masangroup.com</p>
                <p><i className="bi bi-envelope me-3"></i> info2@felicia.masangroup.com</p>
              </div>

              {/* Chính sách và điều khoản */}
              <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
                <h6 className="text-uppercase fw-bold">Điều khoản</h6>
                <p>Chính sách bảo mật thông tin</p>
                <p>Chính sách đặt hàng</p>
                <p>Điều khoản & Điều kiện Thẻ trả trước</p>
              </div>

              {/* Khuyến mãi và cửa hàng */}
              <div className="col-md-3 col-lg-3 col-xl-2 mx-auto mb-4">
                <h6 className="text-uppercase fw-bold">Khuyến mãi và cửa hàng</h6>
                <p>Tin khuyến mãi</p>
                <p>Danh sách cửa hàng</p>
                <p>Tuyển dụng</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Copyright */}
        <div className="text-center p-4 border-top">
          © 2023 Phuc Long Heritage. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;

