import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getMethodByToken, uploadSingleFile } from '@services/request';

const token = localStorage.getItem('token');

const AdminCategory = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [cate, setCate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await getMethodByToken('http://localhost:8080/api/category/public/findAll');
      const list = await response.json();
      setItems(list);
      setFilteredItems(list);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const result = items.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(result);
  }, [searchTerm, items]);

  const saveCategory = async (event) => {
    event.preventDefault();
    const id = event.target.elements.idcate.value;
    const name = event.target.elements.catename.value;
  
    const isDuplicate = items.some(
      (item) => item.name.toLowerCase() === name.toLowerCase() && item.id !== id
    );
  
    if (isDuplicate) {
      toast.error('Tên danh mục đã tồn tại! Vui lòng chọn tên khác.');
      return;
    }
  
    let image = cate?.image; // Mặc định giữ hình ảnh cũ nếu không thay đổi
  
    const fileInput = document.getElementById('fileimage');
    if (fileInput.files && fileInput.files.length > 0) {
      // Nếu người dùng chọn hình ảnh mới
      image = await uploadSingleFile(fileInput);
    }
  
    const payload = {
      id,
      name,
      image,
    };
  
    const url = id
      ? `http://localhost:8080/api/category/admin/update` // Update nếu có ID
      : `http://localhost:8080/api/category/admin/create`; // Tạo mới nếu không có ID
  
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
    if (res.status < 300) {
      const result = await res.json();
      toast.success(id ? 'Cập nhật danh mục thành công!' : 'Thêm danh mục thành công!');
      if (id) {
        setItems((prevItems) => prevItems.map((item) => (item.id === id ? result : item)));
      } else {
        setItems((prevItems) => [...prevItems, result]);
      }
      clearInput(); 
      document.getElementById('addCategoryCloseBtn').click();
      window.location.reload();
    } else if (res.status === 417) {
      const result = await res.json();
      toast.error(result.defaultMessage);
      window.location.reload();
    }
  };
  

  const deleteCategory = async (id) => {
    const confirmDelete = window.confirm('Bạn chắc chắn muốn xóa danh mục này?');
    if (!confirmDelete) return;

    const url = `http://localhost:8080/api/category/admin/delete?id=${id}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status < 300) {
      toast.success('Xóa danh mục thành công!');
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
      window.location.reload();
    } else if (response.status === 417) {
      const result = await response.json();
      toast.warning(result.defaultMessage);
    }
  };

  const loadCategory = async (id) => {
    const response = await getMethodByToken(`http://localhost:8080/api/category/admin/findById?id=${id}`);
    const result = await response.json();
    setCate(result);
  };

  const clearInput = () => {
    setCate(null);
  };

  return (
    <>
      <div className="mt-5 ms-3 row">
        <div className="col-md-6">
          <button
            onClick={clearInput}
            data-bs-toggle="modal"
            data-bs-target="#addCategory"
            className="btn btn-primary"
          >
            <i className="bi bi-plus"></i> Thêm danh mục
          </button>
        </div>
        <div className="col-md-6 text-end">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Tìm kiếm danh mục..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="tablediv">
        <div className="headertable">
          <span className="lbtable">Danh sách danh mục</span>
        </div>
        <div className="divcontenttable">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Ảnh</th>
                <th>Tên danh mục</th>
                <th className="sticky-col">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>
                    <img src={item.image} alt="Danh mục" className="imgadmin table-img" />
                  </td>
                  <td>{item.name}</td>
                  <td className="sticky-col">
                    <button
                      onClick={() => deleteCategory(item.id)}
                      className="action-btn me-2"
                      title="Xóa danh mục"
                    >
                      <i className="bi bi-trash iconaction"></i>
                    </button>
                    <button
                      onClick={() => loadCategory(item.id)}
                      data-bs-toggle="modal"
                      data-bs-target="#addCategory"
                      className="action-btn"
                      title="Chỉnh sửa danh mục"
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

      <div className="modal fade" id="addCategory" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header text-center">
              <h5 className="modal-title" id="exampleModalLabel">
                {cate ? 'Cập nhật danh mục' : 'Thêm danh mục'}
              </h5>
              <button
                type="button"
                className="btn-close"
                id="addCategoryCloseBtn"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form className="col-sm-8 mx-auto" onSubmit={saveCategory}>
                <input defaultValue={cate ? cate.id : ''} name="idcate" id="idcate" type="hidden" />
                <div className="mb-3">
                  <label className="form-label">Tên danh mục</label>
                  <input
                    defaultValue={cate ? cate.name : ''}
                    name="catename"
                    id="catename"
                    type="text"
                    className="form-control"
                    placeholder="Nhập tên danh mục"
                  />
                </div>
                <div className="mb-3">
  <label className="form-label">Ảnh</label>
  <input
    id="fileimage"
    name="fileimage"
    type="file"
    className="form-control"
    onChange={(e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          document.getElementById('imgpreview').src = event.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        document.getElementById('imgpreview').src = cate ? cate.image : '';
      }
    }}
  />
</div>
<div className="mb-3 text-center">
  <img
    src={cate == null ? '' : cate.image}
    id="imgpreview"
    alt="Preview"
    className="img-fluid rounded shadow"
    style={{ maxHeight: '200px', maxWidth: '100%' }}
  />
</div>

                <button type="submit" className="btn btn-success w-100">
                  {cate ? 'Cập nhật' : 'Thêm'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminCategory;
