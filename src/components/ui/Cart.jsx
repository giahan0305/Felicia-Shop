import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getMethodByToken, getMethodDeleteByToken, getMethodPostPayload } from '@services/request';
import { formatMoney } from '@services/Formatmoney';
import Swal from 'sweetalert2';

function PublicCart() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [items, setItems] = useState([]);
  const [numCart, setNumCart] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [user, setUser] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const userlocal = JSON.parse(localStorage.getItem('user')) || {};
    setUser(userlocal);

    // Fetch cart data on component mount
    fetchCart();
  }, []);

  // Fetch cart data from the server
  async function fetchCart() {
    try {
      const response = await getMethodByToken(`${apiUrl}/api/cart/user/my-cart`);
      const list = await response.json();

      console.log('Fetched cart data:', list);
      setItems(list);

      let num = 0;
      let total = 0;
      list.forEach(item => {
        num += item.quantity;
        total += item.quantity * item.product.price;
      });

      setNumCart(num);
      setTotalAmount(total);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      toast.error('Có lỗi xảy ra khi tải giỏ hàng.');
    }
  }

  // Update cart item quantity
  async function updateCartItem(id, quantityDelta) {
    try {
      const currentQuantity = items.find(item => item.id === id)?.quantity || 0;
      const newQuantity = currentQuantity + quantityDelta;

      if (newQuantity < 1) return; // Prevent invalid quantity

      const url = `${apiUrl}/api/cart/user/up-and-down-cart?id=${id}&quantity=${newQuantity}`;
      await getMethodByToken(url);
      fetchCart();
    } catch (error) {
      console.error('Failed to update cart:', error);
      toast.error('Có lỗi xảy ra khi cập nhật giỏ hàng.');
    }
  }

  // Delete a cart item
  async function deleteCartItem(id) {
    if (window.confirm('Xóa sản phẩm khỏi giỏ hàng?')) {
      try {
        const response = await getMethodDeleteByToken(`${apiUrl}/api/cart/user/delete?id=${id}`);
        if (response.status < 300) {
          toast.success('Xóa thành công!');
          fetchCart();
        } else {
          const result = await response.json();
          toast.warning(result.defaultMessage);
        }
      } catch (error) {
        console.error('Failed to delete item:', error);
        toast.error('Có lỗi xảy ra khi xóa sản phẩm.');
      }
    }
  }

  // Clear all items in the cart
  async function clearCart() {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?')) {
      try {
        const response = await getMethodDeleteByToken(`${apiUrl}/api/cart/user/delete-all`);
        if (response.status < 300) {
          toast.success('Giỏ hàng đã được xóa thành công.');
          fetchCart();
        } else {
          toast.error('Có lỗi xảy ra khi xóa giỏ hàng.');
        }
      } catch (error) {
        console.error('Failed to clear cart:', error);
        toast.error('Có lỗi xảy ra khi xóa giỏ hàng.');
      }
    }
  }

  // Handle checkout process
  async function handleCheckout() {
    const confirmation = window.confirm('Xác nhận đặt hàng!');
    if (!confirmation) return;
  
  
    const orderDto = {
      payType: "COD", 
      fullname: document.getElementById("fullname").value,
      phone: document.getElementById("phone").value,
      address: document.getElementById("diachinhan").value,
      note: document.getElementById("ghichudonhang").value,
      codeVoucher: "", // Optional: Set voucher code if applicable
    };
  
    try {
      const url = `${apiUrl}/api/invoice/user/create`;
      const res = await getMethodPostPayload(url, orderDto);
      if (res.status < 300) {
        // Hiển thị thông báo thành công và xử lý xóa giỏ hàng trước khi đóng popup
        Swal.fire({
          title: "Thông báo",
          text: "Đặt hàng thành công!",
          icon: "success",
          preConfirm: async () => {
            try {
              const response = await getMethodDeleteByToken(`${apiUrl}/api/cart/user/delete-all`);
              window.location.href = 'order';
            } catch (error) {
              console.error('Lỗi khi xóa giỏ hàng:', error.message);
              toast.error('Có lỗi xảy ra khi xóa giỏ hàng.');
            }
          },
        });
      } else if (res.status === 417) {
        const result = await res.json();
        toast.error(result.defaultMessage || 'Dữ liệu không hợp lệ.');
      } else {
        toast.error("Đặt hàng thất bại. Vui lòng thử lại sau.");
      }
    } catch (error) {
      console.error('Lỗi khi xử lý đơn hàng:', error.message);
      toast.error('Có lỗi xảy ra khi thanh toán.');
    }
    
  }

  // Handle form validation before checkout
  function handleFormSubmit() {
    const fullname = document.getElementById('fullname');
    const phone = document.getElementById('phone');
    const address = document.getElementById('diachinhan');

    let isValid = true;

    if (fullname.value.trim() === '') {
      isValid = false;
      fullname.classList.add('is-invalid');
    } else {
      fullname.classList.remove('is-invalid');
    }

    if (!/^\d+$/.test(phone.value.trim())) {
      isValid = false;
      phone.classList.add('is-invalid');
    } else {
      phone.classList.remove('is-invalid');
    }

    if (address.value.trim() === '') {
      isValid = false;
      address.classList.add('is-invalid');
    } else {
      address.classList.remove('is-invalid');
    }

    if (isValid) {
      handleCheckout();
    } else {
      toast.error('Vui lòng điền đầy đủ thông tin hợp lệ.');
    }
  }

  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light">
      <div className="container divcart">
        <h2 className="text-center d-flex align-items-center">
          Giỏ hàng ({items.length} sản phẩm)
          {items.length > 0 && (
            <button className="btn btn-light ms-auto" style={{ fontSize: '20px' }} onClick={() => clearCart()}>
              <i className="bi bi-cart-x me-2"></i>
              Xóa giỏ hàng
            </button>
          )}
        </h2>

        {items.length === 0 ? (
          <div className="text-center mt-4">
            <h5>Không có sản phẩm nào trong giỏ hàng.</h5>
            <button className="btn btn-success mt-3" onClick={() => window.location.href = '/home'}>
              Tiếp tục mua sắm
            </button>
          </div>


        ) : (
          <>
            <table className="table table-bordered">
              <thead>
                <tr className=' text-center'>
                  <th>Sản phẩm</th>
                  <th>Đơn giá</th>
                  <th>Số lượng</th>
                  <th>Tổng tiền</th>
                  <th> </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td className="text-left py-3">
                    <img
  className="img-fluid"
  src={item.product.imageBanner || 'default-image-path.jpg'}
  alt={item.product.name || 'Product Image'}
  style={{
    height: '60px',
    width: '60px',
    objectFit: 'cover',
    borderRadius: '10px', // Bo góc nếu muốn
    marginRight: '10px',
    marginLeft: '15px',
  }}
/>

                      {item.product.name}
                    </td>
                    <td className=' text-center'>{formatMoney(item.product.price)}</td>
                    <td className=' text-center'>
                      <div className="d-flex justify-content-center align-items-center">
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => updateCartItem(item.id, -1)}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          min="1"
                          onChange={(e) => {
                            const newQuantity = parseInt(e.target.value, 10);
                            if (newQuantity >= 1) {
                              updateCartItem(item.id, newQuantity);
                            }
                          }}
                          className="[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none form-control mx-2"
                          style={{ width: '70px', textAlign: 'center' }}
                        />
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => updateCartItem(item.id, 1)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className=' text-center'>{formatMoney(item.product.price * item.quantity)}</td>
                    <td className=' text-center'>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteCartItem(item.id)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 d-flex justify-content-end align-items-center">
              <h5>Tổng đơn: {formatMoney(totalAmount)}</h5>
              <button
                data-bs-toggle="modal"
                data-bs-target="#checkoutModal"
                className="btn btn-md btn-success ms-5 mb-3 px-4 font-weight-bold"
              >
                Thanh toán
              </button>
            </div>
          </>
        )}
      </div>
      <div className="modal fade" id="checkoutModal" tabIndex="-1" aria-labelledby="checkoutModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="checkoutModalLabel">Thanh toán đơn hàng</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-sm-6">
                  <label className="lbcheckout">Họ tên người nhận</label>
                  <input
                    required
                    defaultValue={user?.fullname || ''}
                    id="fullname"
                    className="form-control fomd"
                    placeholder="Họ tên"
                    aria-describedby="fullnameError"
                  />
                  <div id="fullnameError" className="invalid-feedback">Vui lòng nhập họ tên người nhận.</div>

                  <label className="lbcheckout">Số điện thoại người nhận</label>
                  <input
                    required
                    type="tel"
                    pattern="^[0-9]+$"
                    defaultValue={user?.phone || ''}
                    id="phone"
                    className="form-control fomd"
                    placeholder="Số điện thoại"
                    aria-describedby="phoneError"
                  />
                  <div id="phoneError" className="invalid-feedback">Số điện thoại không hợp lệ. Chỉ chấp nhận ký tự số.</div>

                  <label className="lbcheckout">Ghi chú nhận hàng</label>
                  <textarea
                    defaultValue={''}
                    id="ghichudonhang"
                    className="form-control fomd mt-2"
                    placeholder="Ghi chú"></textarea>
                </div>
                <div className="col-sm-6">
                  <span className="titlecheckout mt-3">Loại hình thanh toán</span>
                  <table className="table table-bordered">
                    <tbody>
                      <tr>
                        <td>
                          <label className="radiocustom">
                            <input
                              type="radio"
                              name="paytype"
                              value="cod"
                              id="code"
                              checked
                              onChange={(e) => console.log(`Selected: ${e.target.value}`)}
                            />
                            <span className="checkmark"></span>
                          </label>
                        </td>
                        <td><label htmlFor="code">Thanh toán khi nhận hàng (COD)</label></td>
                        <td><i className="bi bi-cash paycode"></i></td>
                      </tr>
                    </tbody>
                  </table>
                  <label className="lbcheckout">Địa chỉ người nhận</label>
                  <input
                    required
                    id="diachinhan"
                    className="form-control fomd"
                    placeholder="Tên đường, số nhà"
                    aria-describedby="addressError"
                  />
                  <div id="addressError" className="invalid-feedback">Vui lòng nhập địa chỉ người nhận.</div>

                  <table className="table table-borderless">
                    <tbody>
                      <tr>
                        <td><span className="titlecheckout">Tạm tính</span></td>
                        <td><span className="tongtienthanhtoan">{formatMoney(totalAmount)}</span></td>
                      </tr>
                      <tr>
                        <td><span className="titlecheckout">Tổng tiền phải thanh toán</span></td>
                        <td><span className="tongtienthanhtoan" id="tongtienthanhtoan">{formatMoney(totalAmount)}</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button className="btn btn-success" type="button" onClick={handleFormSubmit}>Xác nhận đặt hàng</button>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}

export default PublicCart;
