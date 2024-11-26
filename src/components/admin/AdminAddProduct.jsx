import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getMethodByToken, uploadSingleFile, uploadMultipleFile } from '@services/request';
import Swal from 'sweetalert2';
var token = localStorage.getItem("token");

var linkbanner = '';
var description = '';
const listFile = [];

async function saveProduct(event) {
    event.preventDefault();
    document.getElementById("loading").style.display = 'block';
    var uls = new URL(document.URL);
    var id = uls.searchParams.get("id");

    // Validate if price is greater than 1000
    const price = parseFloat(event.target.elements.price.value);
    if (price <= 1000) {
        toast.error("Giá tiền phải lớn hơn 1000!");
        document.getElementById("loading").style.display = 'none';
        return;
    }

    var listLinkImg = await uploadMultipleFile(listFile);
    var ims = await uploadSingleFile(document.getElementById("imgbanner"));
    if (ims != null) {
        linkbanner = ims;
    }

    var prod = {
        "product": {
            "id": id,
            "name": event.target.elements.tensp.value,
            "imageBanner": linkbanner,
            "price": event.target.elements.price.value,
            "description": description,
            "category": {
                "id": event.target.elements.danhmuc.value
            },
        },
        "linkLinkImages": listLinkImg,
    };

    console.log(prod);

    const response = await fetch('http://localhost:8080/api/product/admin/create-update', {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(prod)
    });

    var result = await response.json();
    console.log(result);
    if (response.status < 300) {
        Swal.fire({
            title: "Thông báo",
            text: "Thêm sản phẩm thành công!",
            preConfirm: () => {
                window.location.href = '/admin/products';
            }
        });
    } else {
        toast.error("Thêm/ sửa sản phẩm thất bại");
        document.getElementById("loading").style.display = 'none';
    }
}

const AdminAddProduct = () => {
    const [product, setProduct] = useState(null);
    const [itemDanhmuc, setItemDanhMuc] = useState([]);

    useEffect(() => {
        const getBlog = async () => {
            var uls = new URL(document.URL);
            var id = uls.searchParams.get("id");
            if (id != null) {
                var response = await getMethodByToken('http://localhost:8080/api/product/public/findById?id=' + id);
                var result = await response.json();
                setProduct(result);
                linkbanner = result.imageBanner;
                description = result.description;
            }
        };
        getBlog();

        const getDanhMuc = async () => {
            var response = await getMethodByToken("http://localhost:8080/api/category/public/findAll");
            var list = await response.json();
            setItemDanhMuc(list);
        };
        getDanhMuc();
    }, []);

    function handleEditorChange(content) {
        description = content;
    }

    console.log(product);
    return (
        <div>
        <div className="col-sm-12 text-center mt-3 header-sps">
            <div className="title-add-admin">
                <h4>Thêm/ cập nhật sản phẩm</h4>
            </div>
        </div>
        <div className="col-sm-12">
            <div className="form-add" style={{ marginLeft: '120px' }}> {/* Moved form 5px to the right */}
                <form className="row" onSubmit={saveProduct} method="post">
                    <div className="col-md-4 col-sm-4 col-12" style={{ marginBottom: '5px' }}> {/* Adjust column size */}
                        <label className="mt-3 lb-form">Tên sản phẩm</label>
                        <input
                            name="tensp"
                            defaultValue={product == null ? '' : product.name}
                            className="form-control"
                        />
                        <label className="mt-3 lb-form">Giá tiền</label>
                        <input
                            name="price"
                            defaultValue={product == null ? '' : product.price}
                            className="form-control"
                        />
                        
                        <label className="lb-form">Danh mục</label>
                            <select name="danhmuc" className="form-control">
                                {itemDanhmuc.map((item) => {
                                    const selected = product == null ? '' : product.category.id === item.id ? 'selected' : '';
                                    return (
                                        <option selected={selected} value={item.id} key={item.id}>
                                            {item.name}
                                        </option>
                                    );
                                })}
                            </select>
                        <br />
                        <div className="loading" id="loading">
                            <div className="bar1 bar"></div>
                        </div>
                        <br />
                    </div>
                    <div className="col-md-6 col-sm-6 col-12" style={{ marginBottom: '5px' }}>
                        <label className="lb-form lbmotadv">Mô tả sản phẩm</label>
                        <textarea
                            name="editor"
                            className="form-control"
                            rows="5"
                            defaultValue={product == null ? '' : product.description}
                            onChange={(e) => handleEditorChange(e.target.value)}
                        />
                        <label className="lb-form">Ảnh nền</label>
                        <input id="imgbanner" type="file" className="form-control" />
                        <img
                            src={product == null ? '' : product.image}
                            id="imgpreproduct"
                            className="imgadmin"
                            style={{ width: '100%', marginTop: '15px' }} // Ensure the image fits
                        />
                        <br /><br />
                    </div>
                    <button className="btn btn-primary text-center w-50 form-control"
                    style={{ marginLeft: '150px' }}>
                        Thêm/ cập nhật
                    </button>

                </form>
            </div>
        </div>
    </div>
    
    


    );
}

export default AdminAddProduct;
