import  { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';
import $ from 'jquery'; 


const AdminUser = () => {
  const [items, setItems] = useState([]);
  const token = localStorage.getItem('token');

  const loadUser = async (role = '') => {
    const url = role ? `http://localhost:8080/api/admin/get-user-by-role?role=${role}` : 'http://localhost:8080/api/admin/get-user-by-role';
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  };

  // Function to handle adding a new admin account
  const handleAddAccount = async (event) => {
    event.preventDefault();
    const { fullname, email, phone, password, repassword } = event.target.elements;

    if (password.value !== repassword.value) {
      toast.error('Mật khẩu không trùng khớp');
      return;
    }

    const payload = {
      fullname: fullname.value,
      email: email.value,
      phone: phone.value,
      password: password.value,
    };

    const res = await fetch('http://localhost:8080/api/admin/addaccount', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (res.status === 417) {
      toast.error(result.defaultMessage);
    } else if (res.status < 300) {
      Swal.fire({
        title: 'Thông báo',
        text: 'Tạo tài khoản thành công!',
        preConfirm: () => {
          window.location.reload();
        },
      });
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const listUser = await loadUser();
        setItems(listUser);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);
  

  // Filter users by role
  const filterUser = async () => {
    $('#example').DataTable().destroy();
    const role = document.getElementById('role').value;
    const listUser = await loadUser(role);
    setItems(listUser);
  };

  // Lock or unlock user
  const lockOrUnlockUser = async (id, type) => {
    const confirmAction = window.confirm('Xác nhận hành động?');
    if (!confirmAction) return;

    const url = `http://localhost:8080/api/admin/lockOrUnlockUser?id=${id}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status < 300) {
      const message = type === 1 ? 'Khóa thành công' : 'Mở khóa thành công';
      toast.success(message);
      window.location.reload(); // Reload the page
    } else {
      toast.error('Thất bại');
    }
  };

  return (
    <>
      <div className="ms-3 row">
        <div className="col-md-3 col-sm-6 col-6">
        <label  className="lb-form" dangerouslySetInnerHTML={{__html:'&ThinSpace;'}}></label>
          <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addtk">
            <i className="bi bi-person-add"></i> Thêm admin
          </button>
        </div>
        <div className="col-md-3 col-sm-6 col-6">
          <label className="lb-form">Chọn quyền</label>
          <select onChange={filterUser} id="role" className="form-control">
            <option value="">Tất cả quyền</option>
            <option value="ROLE_USER">Tài khoản người dùng</option>
            <option value="ROLE_ADMIN">Tài khoản admin</option>
          </select>
        </div>
      </div>

      <div className="tablediv">
        <div className="headertable">
          <span className="lbtable">Danh sách tài khoản</span>
        </div>
        <div className="divcontenttable">
          <table id="example" className="table table-bordered">
            <thead>
              <tr>
                <th>id</th>
                <th>Email</th>
                <th>Họ tên</th>
                <th>Số điện thoại</th>
                <th>Ngày tạo</th>
                <th>Quyền</th>
                <th>Khóa</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.email}</td>
                  <td>{item.fullname}</td>
                  <td>{item.phone}</td>
                  <td>{item.createdDate}</td>
                  <td>{item.authorities.name}</td>
                  <td className="sticky-col">
                    <button
                      onClick={() => lockOrUnlockUser(item.id, item.actived ? 1 : 0)}
                      className={`btn ${item.actived ? 'btn-primary' : 'btn-danger'}`}
                    >
                      <i className={`fa ${item.actived ? 'fa-lock' : 'fa-unlock'}`}></i> {item.actived ? 'Khóa' : 'Mở khóa'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Account Modal */}
      <div className="modal fade" id="addtk" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Thêm tài khoản quản trị</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body row">
              <form onSubmit={handleAddAccount} className="col-sm-6" style={{ margin: 'auto' }}>
                <label className="lb-form">Họ tên</label>
                <input name="fullname" className="form-control" />
                <label className="lb-form">Số điện thoại</label>
                <input name="phone" className="form-control" />
                <label className="lb-form">Email</label>
                <input name="email" required className="form-control" />
                <label className="lb-form">Mật khẩu</label>
                <input name="password" required type="password" className="form-control" />
                <label className="lb-form">Nhắc lại mật khẩu</label>
                <input name="repassword" required type="password" className="form-control" />
                <br />
                <button className="form-control btn btn-primary">Thêm tài khoản</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminUser;
