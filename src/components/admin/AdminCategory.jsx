import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getMethodByToken, uploadSingleFile } from '@services/request';

const token = localStorage.getItem("token");

const AdminCategory = () => {
  const [items, setItems] = useState([]);
  const [cate, setCate] = useState(null);
  const [ setImgBanner] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await getMethodByToken("http://localhost:8080/api/category/public/findAll");
      const list = await response.json();
      setItems(list);
    };
    fetchCategories();
  }, []);

  const saveCategory = async (event) => {
    event.preventDefault();
    const image = await uploadSingleFile(document.getElementById("fileimage"));
    if (image) setImgBanner(image);

    const payload = {
      id: event.target.elements.idcate.value,
      name: event.target.elements.catename.value,
      image: image,
    };

    const res = await fetch('http://localhost:8080/api/category/admin/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (res.status < 300) {
      toast.success('Thành công!');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      window.location.reload();
    } else if (res.status === 417) {
      const result = await res.json();
      toast.error(result.defaultMessage);
    }
  };

  const deleteCategory = async (id) => {
    const confirmDelete = window.confirm("Bạn chắc chắn muốn xóa danh mục này?");
    if (!confirmDelete) return;

    const url = `http://localhost:8080/api/category/admin/delete?id=${id}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status < 300) {
      toast.success("Xóa danh mục thành công!");
      const updatedItems = items.filter((item) => item.id !== id);
      setItems(updatedItems);
    } else if (response.status === 417) {
      const result = await response.json();
      toast.warning(result.defaultMessage);
    }
  };

  const loadCategory = async (id) => {
    const response = await getMethodByToken(`http://localhost:8080/api/category/admin/findById?id=${id}`);
    const result = await response.json();
    setCate(result);
    setImgBanner(result.image);
  };

  const clearInput = () => {
    setCate(null);
    setImgBanner('');
  };

  return (
    <>
      <div className="mt-5 ms-3 row">
        <div className="col-md-3">
          <button onClick={clearInput} data-bs-toggle="modal" data-bs-target="#addCategory" className="btn btn-primary">
            <i className="bi bi-plus"></i> Thêm danh mục
          </button>
        </div>
      </div>
      <div className="tablediv">
        <div className="headertable">
          <span className="lbtable">Danh sách danh mục</span>
        </div>
        <div className="divcontenttable">
          <table id="example" className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Ảnh</th>
                <th>Tên danh mục</th>
                <th className="sticky-col">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td><img src={item.image} alt="Danh mục" className="imgadmin table-img" /></td>
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
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Thêm/ Cập nhật danh mục</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form className="col-sm-5 marginauto" onSubmit={saveCategory} method="post">
                <input defaultValue={cate ? cate.id : ''} name="idcate" id="idcate" type="hidden" />
                <label>Tên danh mục</label>
                <input defaultValue={cate ? cate.name : ''} name="catename" id="catename" type="text" className="form-control" />
                <label>Ảnh</label>
                <input id="fileimage" name="fileimage" type="file" className="form-control" />
                <img src={cate==null?'':cate.image} id="imgpreview" alt="Preview" className="imgadmin img-preview" />
                <br /><br />
                <button className="btn btn-success form-control action-btn">Thêm/ Cập nhật danh mục</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminCategory;
