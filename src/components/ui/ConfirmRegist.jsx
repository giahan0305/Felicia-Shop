
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

async function handleConfirm(event) {
    event.preventDefault();
    var uls = new URL(document.URL);
    var email = uls.searchParams.get("email");
    var key = event.target.elements.maxacthuc.value;
    var url = 'http://localhost:8080/api/active-account?email=' + email + '&key=' + key;
    console.log(email)
    console.log(key)
    try {
        const res = await fetch(url, { method: 'POST' });

        if (res.status === 417) {
            const result = await res.json();
            Swal.fire({
                title: 'Lỗi',
                text: result.defaultMessage,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
        
        
        if (res.status < 300) {
            Swal.fire({
                title: "Thông báo",
                text: "Xác nhận tài khoản thành công!",
                preConfirm: () => {
                    window.location.href = '/login';
                }
            });
        }
    } catch (error) {
        throw error('Có lỗi xảy ra. Vui lòng thử lại.');
    }
}

const ConfirmRegist = () => {
    return (
        <div className="container-login">
            <div className="row">
            <div className="col-md-6 d-flex align-items-center justify-content-center bg-white p-5">
                    <div className="text-center">
                        <img
                            src="./assets/logo.jpg"
                            alt="Logo Felicia"
                            style={{ maxWidth: '500px', marginBottom: '20px' }}
                        />
                        <h2>Chào mừng đến với Felicia</h2>
                        <p>Xác nhận đăng ký tài khoản của bạn!</p>
                    </div>
                </div>
                <div className="col-md-6 d-flex align-items-center justify-content-center bg-white p-5">
                    <div className="card shadow-sm w-75">
                        <div className="card-body confirm-register">
                            <h4 className="card-title text-center">Xác Nhận Đăng Ký</h4>
                            <form onSubmit={handleConfirm} autoComplete="off">
                                <div className="mb-3">
                                    <label htmlFor="maxacthuc" className="form-label">Nhập mã xác nhận của bạn</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="maxacthuc"
                                        name="maxacthuc"
                                        placeholder="Nhập mã xác nhận"
                                        required
                                    />
                                </div>

                                <button type="submit" className="btn btn-success w-100">XÁC NHẬN</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmRegist;

