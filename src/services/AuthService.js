import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';
const apiClient = axios.create({
  baseURL: API_URL,
});

export const login = async (username, password, tokenFcm) => {
  try {
    const response = await apiClient.post('/login', { username, password, tokenFcm });
    return response.data;  // Return token and user info
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Đăng nhập thất bại');
  }
};

export const handleLogin = async (event) => {
  event.preventDefault();
  const username = event.target.elements.username.value;
  const password = event.target.elements.password.value;
  const tokenFcm = "someToken"; // Replace with actual FCM token if necessary

  try {
    // Call the login API function
    const result = await login(username, password, tokenFcm);

    // Handle response based on error code
    if (result.errorCode === 300) {
      Swal.fire({
        title: "Thông báo",
        text: "Tài khoản chưa được kích hoạt, đi tới kích hoạt tài khoản!",
        preConfirm: () => {
          window.location.href = 'confirm?email=' + username;
        }
      });
    } else {
      toast.success('Đăng nhập thành công!');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save token and user info in local storage
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));

      // Check user role and navigate accordingly
      const userRole = result.user.authorities.name;
      if (userRole === "ROLE_ADMIN") {
        window.location.href = 'admin/dashboard';
      } else if (userRole === "ROLE_USER") {
        window.location.href = '/home';
      }
    }
  } catch (error) {
    toast.error(error.message || 'Đăng nhập thất bại');
  }
};

export const handleChangePass = async (event) => {
  const token = localStorage.getItem('token');
  event.preventDefault();

  if (event.target.elements.newpass.value !== event.target.elements.renewpass.value) {
    toast.error("Mật khẩu mới không trùng khớp");
    return;
  }

  const payload = {
    oldPass: event.target.elements.currentpass.value,
    newPass: event.target.elements.newpass.value
  };

  try {
    const res = await apiClient.post('/user/change-password', payload, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (res.status === 417) {
      const result = res.data;
      toast.error(result.defaultMessage);
    } else if (res.status < 300) {
      toast.success("Đổi mật khẩu thành công!");
      await new Promise(resolve => setTimeout(resolve, 1500));
      window.location.reload();
    }
  } catch (error) {
    toast.error(error.message || 'Đổi mật khẩu thất bại');
  }
};
