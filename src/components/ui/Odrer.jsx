
import { getMethodByToken, getMethodPostByToken } from '@services/request';
import { formatMoney } from '@services/Formatmoney';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';


async function checkUser() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.replace('/login');
    return;
  }
  try {
    const response = await fetch(`${apiUrl}/api/user/check-role-user`, {
      headers: new Headers({
        'Authorization': 'Bearer ' + token
      })
    });
    if (response.status > 300) {
      window.location.replace('/login');
    }
  } catch (error) {
    console.error('Error checking user role:', error);
  }
}

function PublicAccount() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [items, setItems] = useState([]);
  const [itemDetail, setItemDetail] = useState([]);

  useEffect(() => {
    checkUser();
    const fetchInvoices = async () => {
      try {
        const response = await getMethodByToken(`${apiUrl}/api/invoice/user/find-by-user`);
        const list = await response.json();
        setItems(list);
        console.log(list);
      } catch (error) {
        console.error('Failed to fetch invoices:', error);
      }
    };
    fetchInvoices();
  }, []);

  function loadTrangThai(name) {
    if (name === 'DEPOSITED') {
      return <span className='dadatcoc'>Đã đặt cọc</span>;
    }
    if (name === 'PAID') {
      return <span className='dathanhtoan'>Đã thanh toán</span>;
    }
    if (name === 'CANCELLED') {
      return <span className='dahuy'>Đã hủy</span>;
    }
  }

  const getInvoiceDetail = async (id) => {
    try {
      const response = await getMethodByToken(`${apiUrl}/api/invoice-detail/user/find-by-invoice?idInvoice=${id}`);
      const list = await response.json();
      setItemDetail(list);
    } catch (error) {
      console.error('Failed to fetch invoice detail:', error);
    }
  };

  const cancelInvoice = async (id) => {
    const confirm = window.confirm('Xác nhận hủy đơn hàng?');
    if (!confirm) return;

    try {
      const response = await getMethodPostByToken(`${apiUrl}/api/invoice/user/cancel-invoice?idInvoice=${id}`);
      if (response.status < 300) {
        toast.success('Hủy thành công');
        const updatedResponse = await getMethodByToken(`${apiUrl}/api/invoice/user/find-by-user`);
        const list = await updatedResponse.json();
        setItems(list);
      } else {
        toast.warning('Hủy thất bại');
      }
    } catch (error) {
      console.error('Error canceling invoice:', error);
      toast.error('Có lỗi xảy ra khi hủy đơn hàng.');
    }
  };

  return (
    <>
      <h3 className="order-title">Đơn hàng của tôi</h3>
      <div className="order-table-container">
        <table className="order-table">
          <thead>
            <tr>
              <th style={{ width: '8%' }}>Mã đơn đặt</th>
              <th style={{ width: '10%' }}>Ngày đặt</th>
              <th style={{ width: '12%' }}>Họ tên</th>
              <th style={{ width: '10%' }}>Số điện thoại</th>
              <th style={{ width: '15%' }}>Địa chỉ nhận</th>
              <th style={{ width: '10%' }}>Ghi chú</th>
              <th style={{ width: '10%' }}>Loại thanh toán</th>
              <th style={{ width: '10%' }}>Trạng thái đơn hàng</th>
              <th style={{ width: '12%' }}>Tổng số tiền</th>
              <th style={{ width: '5%' }}>Chức năng</th>
            </tr>
          </thead>
          <tbody>
            {items.slice(0, 10).map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.createdTime}, {item.createdDate}</td>
                <td>{item.receiverName}</td>
                <td>{item.phone}</td>
                <td>{item.address}</td>
                <td>{item.note}</td>
                <td>{item.payType}</td>
                <td>{item.statusInvoice}</td>
                <td>{formatMoney(item.totalAmount)} {item.voucher == null ? '' : '-' + formatMoney(item.voucher.discount)}</td>
                <td>
                  {(item.statusInvoice === 'DANG_CHO_XAC_NHAN' || item.statusInvoice === 'DA_XAC_NHAN') && item.payType === 'COD' ? 
                    <i onClick={() => cancelInvoice(item.id)} className="bi bi-trash action-icon"></i> : ''}
                  <i onClick={() => getInvoiceDetail(item.id)} data-bs-toggle="modal" data-bs-target="#modaldeail" className="bi bi-eye action-icon"></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="modal fade" id="modaldeail" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Chi tiết đơn hàng</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <table className="order-detail-table">
                <thead>
                  <tr>
                    <th>Ảnh</th>
                    <th>Tên sản phẩm</th>
                    <th>Giá tiền</th>
                    <th>Số lượng</th>
                  </tr>
                </thead>
                <tbody>
                  {itemDetail.map((item, index) => (
                    <tr key={index}>
                      <td><img src={item.product.imageBanner} className="product-image" alt="Product" /></td>
                      <td>{item.product.name}</td>
                      <td>{formatMoney(item.price)}</td>
                      <td>{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
  
}

export default PublicAccount;
