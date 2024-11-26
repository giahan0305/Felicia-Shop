import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@contexts/AuthContext';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const { updateUserRole } = useContext(AuthContext); // Access the context
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    const newErrors = { email: '', password: '' };

    if (!email) newErrors.email = 'Email là bắt buộc!';
    if (!password) newErrors.password = 'Mật khẩu là bắt buộc!';
    if (Object.values(newErrors).some((error) => error !== '')) {
      setErrors(newErrors);
      return;
    }

    try {
      const payload = { username: email, password };
      const res = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.status === 417) {
        if (result.errorCode === 300) {
          Swal.fire({
            title: 'Thông báo',
            text: 'Tài khoản chưa được kích hoạt, đi tới kích hoạt tài khoản!',
            preConfirm: () => {
              navigate(`/confirmregister?email=${encodeURIComponent(result.email)}`);
            },
          });
        } else {
          toast.warning(result.defaultMessage);
        }
      }

      if (res.status < 300) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));

        const userRole = result.user.authorities.name;

        // Update user role in context
        updateUserRole(userRole);

        if (userRole === 'ROLE_ADMIN') {
          Swal.fire({
            title: 'Thông báo',
            text: 'Đăng nhập trang chủ thành công!!!',
            preConfirm: () => {
              navigate(`/admin/index`);
            },
          });
        } else if (userRole === 'ROLE_USER') {
          Swal.fire({
            title: 'Thông báo',
            text: 'Đăng nhập thành công!!!',
            preConfirm: () => {
              navigate(`/home`);
            },
          });
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Đăng nhập thất bại!');
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
              <h4 className="card-title text-center">Đăng nhập</h4>
              <form onSubmit={handleFormSubmit}>
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
                    required
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
                    required
                  />
                  {errors.password && <div className="text-danger">{errors.password}</div>}
                </div>

                <button type="submit" className="btn btn-success w-100">Đăng nhập</button>
              </form>

              <div className="text-center mt-3">
                <span className="text-muted">Bạn chưa có tài khoản?</span>
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={() => navigate('/register')}
                >
                  Đăng ký
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
