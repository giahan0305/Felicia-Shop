import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function AdminLayout({children}) {
  const navigate = useNavigate();

  useEffect(() => {
    checkAdmin();
    const interval = setInterval(() => {
      const currentTime = getDateTime();
      const clockElement = document.getElementById('digital-clock');
      if (clockElement) clockElement.innerHTML = currentTime;
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getDateTime = () => {
    const now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    let hour = now.getHours();
    let minute = now.getMinutes();
    let second = now.getSeconds();

    month = month.toString().padStart(2, '0');
    day = day.toString().padStart(2, '0');
    hour = hour.toString().padStart(2, '0');
    minute = minute.toString().padStart(2, '0');
    second = second.toString().padStart(2, '0');

    return `${year}/${month}/${day} ${hour}:${minute}:${second}`;
  };

  const checkAdmin = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const url = 'http://localhost:8080/api/admin/check-role-admin';
    try {
      const response = await fetch(url, {
        headers: new Headers({
          Authorization: `Bearer ${token}`,
        }),
      });

      if (response.status > 300) {
        navigate('/login');
      }
    } catch (error) {
      console.error("Error checking admin role:", error);
      navigate('/login');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload('/home'); 
  };

  return (
    <>
      <div className="navleft" id="navleft">
        <div className="divroot">
          <h3>Quản trị</h3>
        </div>
        <div className="listmenumain">
          <ul className="no-list-style">
            <li><Link to="/admin/index">Trang chủ</Link></li>
            <li><Link to="/admin/users">Tài khoản</Link></li>
            <li><Link to="/admin/categories">Danh mục</Link></li>
            <li><Link to="/admin/products">Sản phẩm</Link></li>
            <li><Link to="/admin/orders">Đơn hàng</Link></li>
          </ul>
        </div>
      </div>

      <div className="contentadminweb">
        <div className="headerweb" id="headerweb">
          <div className="lichheader">
            <img className="iconlich" src="../assets/lich.png" alt="Lich Icon" />
            <p className="text-gray fst-italic mb-0">
              <span id="digital-clock"></span>
            </p>
          </div>
          <div className="userheader">
            <img src="../assets/user.svg" className="userlogo" alt="User Avatar" />
            <button
              className="logout-btn"
              onClick={logout}
              type="button"
            >
              Đăng xuất
            </button>
          </div>

        </div>
        {children}
      </div>
    </>
  );
}

export default AdminLayout;
