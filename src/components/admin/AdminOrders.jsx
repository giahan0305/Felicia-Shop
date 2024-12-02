import { useState, useEffect } from 'react';
import { getMethodByToken, getMethodPostByToken} from '@services/Request';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from 'jquery';
import { formatMoney } from '@services/Formatmoney';

const AdminInvoice = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [items, setItems] = useState([]);
  const [statusInvoice, setStatusInvoice] = useState([]);
  const [itemDetail, setItemDetail] = useState([]);
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getMethodByToken(`${apiUrl}/api/invoice/admin/find-all`);
        const invoices = await response.json();
        setItems(invoices);

        const statusResponse = await getMethodByToken(`${apiUrl}/api/invoice/admin/all-status`);
        const statuses = await statusResponse.json();
        setStatusInvoice(statuses);
      } catch (error) {
        toast.error('Lỗi khi tải dữ liệu hóa đơn.');
      }
    };
    fetchData();

    $(document).ready(function () {
      if (items.length > 0) {
        $('#example').DataTable();
      }
    });
  }, [items.length]);

  const filterInvoice = async () => {
    $('#example').DataTable().destroy();

    let url = `${apiUrl}/api/invoice/admin/find-all?oke=1`;
    const start = document.getElementById('start').value;
    const end = document.getElementById('end').value;
    const type = document.getElementById('type').value;
    const status = document.getElementById('trangthai').value;

    if (start && end) url += `&from=${start}&to=${end}`;
    if (type !== '-1') url += `&paytype=${type}`;
    if (status !== '-1') url += `&status=${status}`;

    try {
      const response = await getMethodByToken(url);
      const filteredItems = await response.json();
      setItems(filteredItems);
    } catch (error) {
      toast.error('Lỗi khi lọc hóa đơn.');
    }
  };

  const getInvoiceDetail = async (item) => {
    try {
      const response = await getMethodByToken(`${apiUrl}/api/invoice-detail/admin/find-by-invoice?idInvoice=${item.id}`);
      const details = await response.json();
      setItemDetail(details);
      document.getElementById('trangthaiupdate').value = item.statusInvoice;
    } catch (error) {
      toast.error('Lỗi khi lấy chi tiết hóa đơn.');
    }
  };

  const updateStatus = async () => {
    const newStatus = document.getElementById('trangthaiupdate').value;
    try {
      const response = await getMethodPostByToken(
        `${apiUrl}/api/invoice/admin/update-status?idInvoice=${invoice.id}&status=${newStatus}`
      );
      if (response.status < 300) {
        toast.success('Cập nhật trạng thái đơn hàng thành công!');
        const updatedInvoicesResponse = await getMethodByToken(`${apiUrl}/api/invoice/admin/find-all`);
        const updatedInvoices = await updatedInvoicesResponse.json();
        setItems(updatedInvoices);
      } else {
        const result = await response.json();
        toast.warning(result.defaultMessage);
      }
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái đơn hàng.');
    }
  };

  const setValueInp = (item) => {
    setInvoice(item);
    document.getElementById('trangthaiupdate').value = item.statusInvoice;
  };

  return (
    <>
      {/* Bộ lọc hóa đơn */}
      <div className="row mt-3 ms-3">
        <div className="col-md-2">
          <label>Từ ngày</label>
          <input id="start" type="date" className="form-control" />
        </div>
        <div className="col-md-2">
          <label>Đến ngày</label>
          <input id="end" type="date" className="form-control" />
        </div>
        <div className="col-md-3">
          <label>Loại thanh toán</label>
          <select id="type" className="form-control">
            <option value="-1">--- Tất cả ---</option>
            <option value="MOMO">Thanh toán bằng momo</option>
            <option value="COD">Thanh toán khi nhận hàng</option>
          </select>
        </div>
        <div className="col-md-3">
          <label>Trạng thái đơn hàng</label>
          <select id="trangthai" className="form-control">
            <option value="-1">--- Tất cả ---</option>
            {statusInvoice.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-2 mt-3" >
          <button onClick={filterInvoice} className="btn btn-success text-center form-control">
            <i className="bi bi-filter pt-3"></i> Lọc
          </button>
        </div>
      </div>

      {/* Danh sách hóa đơn */}
      <div className="tablediv">
  <div className="headertable">
    <span className="lbtable">Danh sách đơn hàng</span>
  </div>
  <div className="divcontenttable">
    <div className="table-wrapper"> {/* Bao bọc bảng để cuộn ngang */}
      <table id="example" className="table table-bordered">
        <thead>
          <tr>
            <th>Mã đơn hàng</th>
            <th>Ngày đặt</th>
            <th>Địa chỉ</th>
            <th>Liên hệ</th>
            <th>Giá trị đơn hàng</th>
            <th>Trạng thái thanh toán</th>
            <th>Trạng thái vận chuyển</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.createdTime}, {item.createdDate}</td>
              <td>{item.address}</td>
              <td>{item.receiverName}, sđt: {item.phone}</td>
              <td>{formatMoney(item.totalAmount)}</td>
              <td>{item.payType}</td>
              <td>{item.statusInvoice}</td>
              <td className="sticky-col-orders">
                <button
                  onClick={() => setValueInp(item)}
                  data-bs-toggle="modal"
                  data-bs-target="#capnhatdonhang"
                  className="action-btn me-2"
                  title="Cập nhật trạng thái đơn hàng"
                >
                  <i className="bi bi-pencil-square iconaction"></i>
                </button>

                <button
                  onClick={() => getInvoiceDetail(item)}
                  data-bs-toggle="modal"
                  data-bs-target="#modaldeail"
                  className="action-btn"
                  title="Xem chi tiết đơn hàng"
                >
                  <i className="bi bi-eye iconaction"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div> {/* Kết thúc table-wrapper */}
  </div>
</div>

      {/* Modal chi tiết đơn hàng */}
      <div className="modal fade" id="modaldeail" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Chi tiết đơn hàng</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <table className="table table-cart table-order" id="detailInvoice">
                <thead className="thead-default theaddetail">
                  <tr>
                    <th>Ảnh</th>
                    <th>Tên sản phẩm</th>
                    <th>Giá tiền</th>
                    <th>Số lượng</th>
                  </tr>
                </thead>
                <tbody>
                  {itemDetail.map((detail) => (
                    <tr key={detail.id}>
                      <td>
                        <img src={detail.product.imageBanner} className="imgdetailhd" alt="Product" />
                      </td>
                      <td>{detail.product.name}</td>
                      <td>{formatMoney(detail.price)}</td>
                      <td>{detail.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal cập nhật trạng thái đơn hàng */}
      <div className="modal fade" id="capnhatdonhang" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-sm">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Cập nhật trạng thái đơn hàng
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <select className="form-control" id="trangthaiupdate">
                {statusInvoice.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <br />
              <button onClick={updateStatus} className="btn btn-success form-control action-btn">
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminInvoice;
