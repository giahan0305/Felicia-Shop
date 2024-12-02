import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getMethodByToken } from '@services/request';
import { formatMoney } from '@services/Formatmoney';
import { useNavigate } from 'react-router-dom'; // Importing useNavigate for navigation

const token = localStorage.getItem("token");
const AdminProduct = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    const getProduct = async () => {
      const response = await getMethodByToken(`${apiUrl}/api/product/public/findAll-list`);
      const list = await response.json();
      setItems(list);
      setFilteredItems(list);  // Initially show all items
    };
    getProduct();
  }, []);

  useEffect(() => {
    // Filter items whenever search term changes
    const filtered = items.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchTerm, items]);


  const deleteProduct = async (id) => {
    const con = window.confirm("Bạn chắc chắn muốn xóa sản phẩm này?");
    if (con === false) {
      return;
    }
    const url = `${apiUrl}/api/product/admin/delete?id=${id}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: new Headers({
        'Authorization': `Bearer ${token}`
      })
    });

    if (response.status < 300) {
      toast.success("xóa thành công!");
      const res = await getMethodByToken(`${apiUrl}/api/product/public/findAll-list`);
      const list = await res.json();
      window.location.reload()
      setItems(list);
    } else if (response.status === 417) {
      const result = await response.json();
      toast.warning(result.defaultMessage);
    }
  };

  return (
    <>
      <div className="mt-3 ms-3 row">
        <div className="col-md-6">
          <button
            onClick={() => navigate('/admin/addproduct')} // Navigate to the addproduct page
            className="btn btn-success w-50 d-flex align-items-center justify-content-center"
          >
            <i className="bi bi-plus me-2"></i> Thêm sản phẩm
          </button>
        </div>
        <div className="col-md-6 text-md-end">
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0 mb-2">
              <i className="bi bi-search "></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
          </div>
        </div>
      </div>

      <div className="tablediv mt-4">
        <div className="headertable">
          <span className="lbtable">Danh sách sản phẩm</span>
        </div>

        <div className="divcontenttable mt-3">
          <table id="example" className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Giá hiện tại</th>
                <th>Danh mục</th>
                <th className="sticky-col">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>
                    <img
                      src={item.imageBanner}
                      className="imgadmin table-img"
                      alt="Product Banner"
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                  </td>
                  <td>{item.name}</td>
                  <td>{formatMoney(item.price)}</td>
                  <td>{item.category.name}</td>
                  <td className="sticky-col">
                    <button
                      onClick={() => deleteProduct(item.id)}
                      className="action-btn me-2"
                      title="Xóa sản phẩm"
                    >
                      <i className="bi bi-trash iconaction"></i>
                    </button>
                    <button
                      onClick={() => navigate(`/admin/addproduct?id=${item.id}`)} // Navigate to edit page
                      className="action-btn me-2"
                      title="Chỉnh sửa sản phẩm"
                    >
                      <i className="bi bi-pencil-square iconaction"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminProduct;
