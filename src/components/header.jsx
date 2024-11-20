import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

function Header() {
  
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const user = JSON.parse(localStorage.getItem('user'));
  const isLoggedIn = user !== null;

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header id="headerweb" className="fixed-top">
      <div className="subheader">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-4 col-sm-3 col-md-3 col-lg-3">
              <div className="logo-container">
                <a href="/home"><img src="../assets/logo.png" className="logoheader" alt="logo" /></a>
              </div>
            </div>
            <div className="col-8 col-sm-3 col-md-3 col-lg-3">
              <form action="product" className="searchheader">
                <input name="search" placeholder="Hôm nay bạn cần tìm gì?" className="inputsearchheader" />
                <button className="btnsearchheader"><i className="bi bi-search"></i></button>
              </form>
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-lg-6">
              <ul className="container subcontainerheader mt-3">
                <li><a href="/home">Trang Chủ</a></li>
                <li><a href="/home">Giới thiệu</a></li>
                <li
                  onMouseEnter={() => setShowProductDropdown(true)}
                  onMouseLeave={() => setShowProductDropdown(false)}
                  className="menu-item"
                  style={{ position: 'relative' }}
                >
                  <a href="#">Sản phẩm</a>
                  {showProductDropdown && (
                    <div className="dropdown-menu" style={{ position: 'absolute', top: '100%', left: '0', display: 'block' }}>
                      <button className="dropdown-item" type="button">Thức uống</button>
                      <button className="dropdown-item" type="button">Bánh</button>
                      <button className="dropdown-item" type="button">Ăn vặt</button>
                    </div>
                  )}
                </li>
                <li><a href="/home">Cửa hàng</a></li>
                <li><a href="/home">Liên hệ</a></li>
                <li>
                  {isLoggedIn ? (
                      <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                      {/* Cart Icon */}
                      <Link to="/cart4" className="bi bi-cart4" style={{ fontSize: '16px', cursor: 'pointer', marginRight: '15px' }}></Link>
                      
                      {/* Profile Icon Button */}
                      <button
                        className="bi bi-person-circle"
                        style={{ fontSize: '16px', cursor: 'pointer', background: 'none', border: 'none' }}
                        onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                      ></button>

                      {/* Profile Dropdown Menu */}
                      {showProfileDropdown && (
                        <div
                          ref={dropdownRef}
                          className="dropdown-menu"
                          style={{
                            position: 'absolute',
                            top: '100%',
                            right: '-20px',
                            display: 'block',
                            backgroundColor: '#fff',
                            borderRadius: '5px',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            width: '200px',
                            zIndex: 999,
                          }}
                        >
                          <button
                            onClick={() => navigate('/profile')}
                            className="dropdown-item"
                            style={{
                              fontSize: '14px',
                              background: 'none',
                              border: 'none',
                              padding: '10px 15px',
                              cursor: 'pointer',
                              textAlign: 'left',
                              width: '100%',
                            }}
                          >
                            Thông tin người dùng
                          </button>
                          <button
                            onClick={() => navigate('/orders')}
                            className="dropdown-item"
                            style={{
                              fontSize: '14px',
                              background: 'none',
                              border: 'none',
                              padding: '10px 15px',
                              cursor: 'pointer',
                              textAlign: 'left',
                              width: '100%',
                            }}
                          >
                            Danh sách đơn hàng
                          </button>
                          <button
                            onClick={handleLogout}
                            className="dropdown-item"
                            style={{
                              fontSize: '14px',
                              cursor: 'pointer',
                              background: 'none',
                              border: 'none',
                              padding: '10px 15px',
                              textAlign: 'left',
                              width: '100%',
                            }}
                          >
                            Đăng xuất
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link to="/login" className="bi bi-person-circle" style={{ fontSize: '16px', cursor: 'pointer' }}></Link>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
