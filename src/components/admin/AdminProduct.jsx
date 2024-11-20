import { useState, useEffect, useRef } from 'react';
import { getMethodByToken, uploadSingleFile, uploadMultipleFile } from '@services/request';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { formatMoney } from '@services/Formatmoney';
import { Editor } from '@tinymce/tinymce-react';

var token = localStorage.getItem("token");

const AdminProduct = () => {
    const [items, setItems] = useState([]);
    const [itemDanhMuc, setItemDanhMuc] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const editorRef = useRef(null);

    // Fetch products and categories when the component loads
    useEffect(() => {
        const fetchProductsAndCategories = async () => {
            try {
                const productsResponse = await getMethodByToken('http://localhost:8080/api/product/public/findAll-list');
                const products = await productsResponse.json();
                setItems(products);
                
                const categoriesResponse = await getMethodByToken('http://localhost:8080/api/category/public/findAll');
                const categories = await categoriesResponse.json();
                setItemDanhMuc(categories);
            } catch (error) {
                toast.error('Lỗi khi tải dữ liệu sản phẩm và danh mục');
            }
        };

        fetchProductsAndCategories();
    }, []);

    const openModal = (product = null) => {
        setSelectedProduct(product || {
            id: null,
            name: '',
            imageBanner: '',
            price: '',
            oldPrice: '',
            expiry: '',
            description: '',
            category: { id: '' }
        });
    };

    const closeModal = () => {
        setSelectedProduct(null);
    };

    const saveProduct = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const images = await uploadMultipleFile([]);  // Handle multiple file uploads
        const imageBanner = await uploadSingleFile(document.getElementById("imgbanner"));  // Handle the banner image upload
        
        const productData = {
            product: {
                id: selectedProduct.id,
                name: formData.get('tensp'),
                imageBanner: imageBanner || selectedProduct.imageBanner,
                price: formData.get('price'),
                oldPrice: formData.get('oldPrice'),
                expiry: formData.get('expiry'),
                description: editorRef.current.getContent(),
                category: { id: formData.get('danhmuc') }
            },
            linkLinkImages: images,
        };

        try {
            const response = await fetch('http://localhost:8080/api/product/admin/create-update', {
                method: 'POST',
                headers: new Headers({
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify(productData)
            });

            if (response.status < 300) {
                toast.success('Sản phẩm đã được lưu thành công');
                const res = await getMethodByToken('http://localhost:8080/api/product/public/findAll-list');
                const list = await res.json();
                setItems(list);
                closeModal();
                window.location.reload();
            } else {
                console.log(response)
            }
        } catch (error) {
            console.log(error)
        }
    };

    const deleteProduct = async (id) => {
        const confirm = window.confirm('Bạn chắc chắn muốn xóa sản phẩm này?');
        if (!confirm) return;

        try {
            const response = await fetch(`http://localhost:8080/api/product/admin/delete?id=${id}`, {
                method: 'DELETE',
                headers: new Headers({
                    'Authorization': 'Bearer ' + token
                })
            });

            if (response.status < 300) {
                toast.success('Sản phẩm đã được xóa thành công!');
                const res = await getMethodByToken('http://localhost:8080/api/product/public/findAll-list');
                const list = await res.json();
                setItems(list);
            } else {
                toast.error('Xóa sản phẩm thất bại!');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi xóa sản phẩm');
        }
    };

    return (
        <>
            <div className="row">
                <div className="col-md-3">
                    <button className="ms-5 mt-3 btn btn-primary" onClick={() => openModal()}>
                        <i className=" bi bi-plus"></i> Thêm sản phẩm
                    </button>
                </div>
            </div>
            <div className="tablediv">
                <div className="headertable">
                    <span className="lbtable">Danh sách sản phẩm</span>
                </div>
                <div className="divcontenttable">
                    <table id="example" className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Ảnh bìa</th>
                                <th>Tên sản phẩm</th>
                                <th>Giá hiện tại</th>
                                <th>Giá cũ</th>
                                <th>Danh mục</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>
                                        <img src={item.imageBanner} className="imgadmin" alt="product" />
                                    </td>
                                    <td>{item.name}</td>
                                    <td>{formatMoney(item.price)}</td>
                                    <td>{formatMoney(item.oldPrice)}</td>
                                    <td>{item.category.name}</td>
                                    <td>
                                        <i
                                            onClick={() => deleteProduct(item.id)}
                                            className="bi bi-trash3 iconaction"
                                            title="Xóa"
                                        ></i>
                                        <i
                                            onClick={() => openModal(item)}
                                            className="bi bi-pencil-square iconaction"
                                            title="Sửa"
                                        ></i>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedProduct && (
                <div className="modal show d-block" role="dialog">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <form onSubmit={saveProduct}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Thêm/ Cập nhật sản phẩm</h5>
                                    <button type="button" className="btn-close" onClick={closeModal}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label>Tên sản phẩm</label>
                                        <input name="tensp" defaultValue={selectedProduct.name} className="form-control" />
                                    </div>
                                    <div className="form-group">
                                        <label>Giá hiện tại</label>
                                        <input name="price" defaultValue={selectedProduct.price} className="form-control" />
                                    </div>
                                    <div className="form-group">
                                        <label>Giá cũ</label>
                                        <input name="oldPrice" defaultValue={selectedProduct.oldPrice} className="form-control" />
                                    </div>
                                    <div className="form-group">
                                        <label>Danh mục</label>
                                        <select name="danhmuc" defaultValue={selectedProduct.category.id} className="form-control">
                                            {itemDanhMuc.map(category => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Ảnh bìa</label>
                                        <input id="imgbanner" type="file" className="form-control" />
                                    </div>
                                    <div className="form-group">
                                        <label>Mô tả</label>
                                        <Editor
                                            tinymceScriptSrc={'https://cdn.tiny.cloud/1/no-api-key/tinymce/6/tinymce.min.js'}
                                            onInit={(evt, editor) => (editorRef.current = editor)}
                                            initialValue={selectedProduct.description}
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="submit" className="btn btn-primary">Lưu</button>
                                    <button type="button" className="btn btn-secondary" onClick={closeModal}>Đóng</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminProduct;
