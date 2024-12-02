import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { getMethodByToken } from '@services/Request';

function Header() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]); 
  const [filteredProducts, setFilteredProducts] = useState([]); 
  const [searchQuery, setSearchQuery] = useState('');
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(true);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const user = JSON.parse(localStorage.getItem('user'));
  const isLoggedIn = user !== null;

const handleProductClick = (product) => {
  setIsSearchVisible(false);
  navigate(`/product?productId=${product.id}&productName=${product.name}`);
  window.location.reload();
};
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getMethodByToken(`${apiUrl}/api/category/public/findAll`);
        const categoryList = await response.json();
        setCategories(categoryList);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
  
    const fetchProducts = async () => {
      try {
        const response = await getMethodByToken(`${apiUrl}/api/product/public/findAll-list`);
        const productList = await response.json();
        setProducts(productList);
        setFilteredProducts(productList); 
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
  
    fetchCategories();
    fetchProducts();
  
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
  useEffect(() => {
    const fetchCartItems = async () => {
      if (isLoggedIn) { 
        try {
          const response = await getMethodByToken(`${apiUrl}/api/cart/user/my-cart`);
          const list = await response.json();
          setItems(list);
        } catch (error) {
          console.error('Error fetching cart items:', error);
        }
      }
    };
  
    fetchCartItems();
  }, [isLoggedIn]); 
  

  const handleNavigate = (categoryId, categoryName) => {
    navigate(`/category?categoryId=${categoryId}&categoryName=${(categoryName)}`);
    window.location.reload();
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    if (query === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(query)
      );
      setFilteredProducts(filtered);
    }
  };

  return (
    <header id="headerweb" className="fixed-top">
      <div className="subheader">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-4 col-sm-3 col-md-3 col-lg-3">
              <div className="logo-container">
                <a href="/home"><img src="./assets/logo.png" className="logoheader" alt="logo" /></a>
              </div>
            </div>
            <div className="col-8 col-sm-3 col-md-3 col-lg-3">
              <form action="product" className="searchheader ">
                <input
                  name="search"
                  placeholder="Hôm nay bạn cần tìm gì?"
                  className="inputsearchheader"
                  value={searchQuery}
                  onChange={handleSearch}
                />
                <button className="btnsearchheader "><i className="bi bi-search"></i></button>
              </form>
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-lg-6">
              <ul className="container subcontainerheader">
                <li><a href="/home"> <h5 className="mt-3">Trang Chủ</h5></a></li>
                <li><a href="/home"> <h5 className="mt-3">Giới thiệu</h5></a></li>
                <li
                  onMouseEnter={() => setShowProductDropdown(true)}
                  onMouseLeave={() => setShowProductDropdown(false)}
                  className="menu-item"
                  style={{ position: 'relative' }}
                >
                  <a href="#"> <h5 className="mt-3">Sản phẩm</h5></a>
                  {showProductDropdown && (
                      <div className="dropdown-menu" style={{ position: 'absolute', top: '100%', left: '0', display: 'block' }}>
                      {categories.map(category => (
                        <button
                          key={category.id}
                          className="dropdown-item"
                          type="button"
                          onClick={() => handleNavigate(category.id, category.name)}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  )}
                </li>
                <li><a href="/home"> <h5 className="mt-3">Cửa hàng</h5></a></li>
                <li><a href="/home"> <h5 className="mt-3">Liên hệ</h5></a></li>
                
                  {isLoggedIn ? (
                    <li>
                    <div style={{ display: 'flex', alignItems: 'center', position: 'relative', paddingTop: '5px' }}>
                      <Link to="/cart" className="position-relative" style={{ fontSize: '24px', cursor: 'pointer', marginRight: '15px', marginBottom: '5px' }}>
                        <i className="bi bi-cart4"></i>
                        {items.length > 0 && (
                          <span className="position-absolute bottom-0 start-50 translate-end badge rounded-pill bg-success" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>
                            {items.length}
                          </span>
                        )}
                      </Link>
                      <button
  className="bi custom-button bi-person-circle"
  style={{ fontSize: '24px', cursor: 'pointer', background: 'none', border: 'none' }}
  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
  title={user.name} // Sử dụng dấu ngoặc đơn để chèn giá trị của user.name
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
                            onClick={() => navigate(`/order`)}
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
                    </li>
                  ) : (
                    <li className='mt-2'><Link to="/login" className="bi bi-person-circle header-default" style={{ fontSize: '24px', cursor: 'pointer', marginTop: '30px' }}></Link></li>
                  )}
                
              </ul>
            </div>
          </div>
        </div>
      </div>
      {searchQuery && filteredProducts.length > 0 && isSearchVisible && (
  <div className="search-results">
    <h5>Kết quả tìm kiếm:</h5>
    <div className="results-list">
      {filteredProducts.map(products => (
        <div key={products.id} className="result-item" onClick={() => handleProductClick(products)}>
          <img src={products.imageBanner || '../assets/default-image.png'} alt={products.name} className="result-image" />
          <p className="result-name">{products.name}</p>
        </div>
      ))}
    </div>
  </div>
)}
    </header>
  );
}

export default Header;
