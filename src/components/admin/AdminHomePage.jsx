import { useState, useEffect } from 'react';
import { getMethodByToken } from '@services/Request';
import { formatMoney } from '@services/Formatmoney.js';
import Chart from 'chart.js/auto';

const token = localStorage.getItem('token');
const HomeAdmin = () => {
  const [doanhthu, setDoanhThu] = useState(0);
  const [quantri, setQt] = useState(null);
  const [doanhthuHomNay, setDoanhThuHomNay] = useState(0);
  const [donHoanThanhHomNay, setDonHoanThanhHomNay] = useState(0);
  const [items, setItems] = useState([]);
  useEffect(() => {
    const getThongKe = async () => {
      const responseMonth = await getMethodByToken('http://localhost:8080/api/statistic/admin/revenue-this-month');
      setDoanhThu(await responseMonth.text());
  
      const responseToday = await getMethodByToken('http://localhost:8080/api/statistic/admin/revenue-today');
      setDoanhThuHomNay(await responseToday.text());
  
      const responseAdmins = await getMethodByToken('http://localhost:8080/api/statistic/admin/number-admin');
      setQt(await responseAdmins.text());
  
      const responseInvoices = await getMethodByToken('http://localhost:8080/api/statistic/admin/number-invoice-today-finish');
      setDonHoanThanhHomNay(await responseInvoices.text());
    };
  
    const getProductBanChay = async () => {
      const response = await getMethodByToken('http://localhost:8080/api/product/public/san-pham-ban-chay');
      setItems(await response.json());
    };
  
    const getMauSac = () => {
      const colors = ['#4e73df', '#1cc88a', '#36b9cc', '#eb9534', '#ed00c6', '#edd500'];
      const actElements = document.getElementsByClassName('border-left');
      const labelElements = document.getElementsByClassName('lbcard');
  
      Array.from(actElements).forEach((el, i) => {
        el.style.borderLeft = `.25rem solid ${colors[i]}`;
      });
  
      Array.from(labelElements).forEach((el, i) => {
        el.style.color = colors[i];
      });
    };
  
    const revenueYear = async (year) => {
      if (year < 2000) year = new Date().getFullYear();
  
      const url = `http://localhost:8080/api/statistic/admin/revenue-year?year=${year}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const list = await response.json();
  
      const labels = Array.from({ length: 12 }, (_, i) => `tháng ${i + 1}`);
      const ctx = document.getElementById('chart').getContext('2d');
  
      let chartStatus = Chart.getChart('chart');
      if (chartStatus) chartStatus.destroy();
  
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: `Doanh thu năm ${year}`,
              backgroundColor: 'rgba(161, 198, 247, 1)',
              borderColor: 'rgb(47, 128, 237)',
              data: list.map((item) => (item ? item : 0)),
            },
          ],
        },
        options: {
          scales: {
            y: {
              ticks: {
                callback: (value) => formatmoney(value),
              },
            },
          },
        },
      });
    };
  
    getThongKe();
    getProductBanChay();
    getMauSac();
    revenueYear(new Date().getFullYear());
  }, []);  // This ensures the effect runs once on mount.
  

  async function revenueYear(year) {
    if (year < 2000) year = new Date().getFullYear();

    const url = `http://localhost:8080/api/statistic/admin/revenue-year?year=${year}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const list = await response.json();

    const labels = Array.from({ length: 12 }, (_, i) => `tháng ${i + 1}`);
    const ctx = document.getElementById('chart').getContext('2d');

    let chartStatus = Chart.getChart('chart');
    if (chartStatus) chartStatus.destroy();

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: `Doanh thu năm ${year}`,
            backgroundColor: 'rgba(161, 198, 247, 1)',
            borderColor: 'rgb(47, 128, 237)',
            data: list.map((item) => (item ? item : 0)),
          },
        ],
      },
      options: {
        scales: {
          y: {
            ticks: {
              callback: (value) => formatmoney(value),
            },
          },
        },
      },
    });
  }

  function loadByNam() {
    const nam = document.getElementById('nams').value;
    revenueYear(nam);
  }

  const VND = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });

  function formatmoney(money) {
    return VND.format(money);
  }

  return (
    <>
      <div className="row mt-3 ms-3">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left shadow h-100 py-2">
            <span className="lbcard">Doanh thu tháng này</span>
            <span className="solieudoanhthu">{formatMoney(doanhthu)}</span>
          </div>
        </div>
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left shadow h-100 py-2">
            <span className="lbcard">Doanh thu hôm nay</span>
            <span className="solieudoanhthu">{formatMoney(doanhthuHomNay)}</span>
          </div>
        </div>
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left shadow h-100 py-2">
            <span className="lbcard">Số lượng quản trị</span>
            <span className="solieudoanhthu">{quantri}</span>
          </div>
        </div>
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left shadow h-100 py-2">
            <span className="lbcard">Đơn hoàn thành hôm nay</span>
            <span className="solieudoanhthu">{donHoanThanhHomNay}</span>
          </div>
        </div>
      </div>

      <div>
      <div className="ms-3 mt-3 mb-3 col-sm-12 header-sp-thongke d-flex align-items-center gap-3">
  <label className="lbbooking mb-0">Chọn năm cần xem</label>
  <select id="nams" className="form-control w-auto">
    {[2023, 2024, 2025, 2026, 2027, 2028].map((year) => (
      <option key={year} id={year}>
        {year}
      </option>
    ))}
  </select>
  <button onClick={loadByNam} className="btn btn-primary">
    <i className="bi bi-filter"></i> Lọc
  </button>
</div>

        <div className="col-sm-12 divtale">
          <div className="card chart-container divtale">
            <canvas id="chart"></canvas>
          </div>
        </div>
      </div>

      <div className="tablediv">
        <div className="headertable">
          <span className="lbtable">Danh sách sản phẩm bán chạy</span>
        </div>
        <div className="divcontenttable">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Id</th>
                <th>Ảnh bìa</th>
                <th>Tên sản phẩm</th>
                <th>Giá hiện tại</th>
                <th>Giá cũ</th>
                <th>Hạn sử dụng</th>
                <th>Số lượng bán</th>
                <th>Danh mục</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>
                    <img src={item.imageBanner} className="imgadmin" alt="banner" />
                  </td>
                  <td>{item.name}</td>
                  <td>{formatMoney(item.price)}</td>
                  <td>{formatMoney(item.oldPrice)}</td>
                  <td>{item.expiry}</td>
                  <td>{item.quantitySold}</td>
                  <td>{item.category.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default HomeAdmin;
