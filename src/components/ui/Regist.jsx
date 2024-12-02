import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import Swal from 'sweetalert2';

// Define validation schema with Yup
const validationSchema = Yup.object().shape({
  fullName: Yup.string().required('Họ tên là bắt buộc!'),
  phone: Yup.string().required('Số điện thoại là bắt buộc!'),
  email: Yup.string().email('Email không hợp lệ!').required('Email là bắt buộc!'),
  password: Yup.string()
    .required('Mật khẩu là bắt buộc!')
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự!'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Mật khẩu không khớp!')
    .required('Xác nhận mật khẩu là bắt buộc!')
});

const Regist = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validate the form data using Yup
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      
      // Proceed with the API call if the validation passes
      const payload = {
        fullname: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      };
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/api/regis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (res.status === 417) {
        Swal.fire({
          title: 'Lỗi',
          text: result.defaultMessage,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      } else if (res.status < 300) {
        Swal.fire({
            title: 'Thông báo',
            text: 'Đăng ký thành công! Hãy kiểm tra email của bạn!',
            preConfirm: () => {
              navigate(`/confirmregister?email=${encodeURIComponent(result.email)}`);
            }
          });
          
      }
    } catch (err) {
      const validationErrors = err.inner.reduce((acc, curr) => {
        acc[curr.path] = curr.message;
        return acc;
      }, {});
      setErrors(validationErrors);
    }
  };

  return (
    <div className="container-login">
      <div className="row">
        <div className="col-md-6 d-flex align-items-center justify-content-center bg-white p-5">
          <div className="text-center">
            <img
              src="./assets/logo.png"
              alt="Logo Felicia"
              style={{ maxWidth: '500px', marginBottom: '20px' }}
            />
            <h2>Chào mừng đến với Felicia</h2>
            <p>Nơi cung cấp đồ uống và món ăn tuyệt vời!</p>
          </div>
        </div>

        <div className="col-md-6 d-flex align-items-center justify-content-center bg-white">
          <div className="card shadow-sm w-75">
            <div className="card-body">
              <h4 className="card-title text-center">Đăng ký</h4>
              <form onSubmit={handleFormSubmit}>
                <div className="mb-3">
                  <label htmlFor="fullName" className="form-label">Họ tên</label>
                  <input
                    type="text"
                    className="form-control"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Nhập họ tên của bạn"
                  />
                  {errors.fullName && <div className="text-danger">{errors.fullName}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">Số điện thoại</label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Nhập số điện thoại của bạn"
                  />
                  {errors.phone && <div className="text-danger">{errors.phone}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Nhập email của bạn"
                  />
                  {errors.email && <div className="text-danger">{errors.email}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Mật khẩu</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Nhập mật khẩu"
                  />
                  {errors.password && <div className="text-danger">{errors.password}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">Xác nhận mật khẩu</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Xác nhận mật khẩu của bạn"
                  />
                  {errors.confirmPassword && <div className="text-danger">{errors.confirmPassword}</div>}
                </div>

                <button type="submit" className="btn btn-success w-100">Đăng ký</button>
              </form>

              <div className="text-center mt-3">
                <span className="text-muted">Bạn đã có tài khoản?</span>
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={() => navigate('/login')}
                >
                  Đăng nhập
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Regist;
