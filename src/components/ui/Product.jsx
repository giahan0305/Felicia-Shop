import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMethod } from '@services/request'; // Điều chỉnh đường dẫn nếu cần
import { formatMoney } from '@services/Formatmoney';

function ProductDetail() {
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]); // Sản phẩm liên quan
    const [quantity, setQuantity] = useState(1); // Số lượng sản phẩm
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                const uls = new URL(window.location.href);
                const productId = uls.searchParams.get("productId"); // Lấy ID từ URL

                // Lấy chi tiết sản phẩm
                const result = await getMethod(`http://localhost:8080/api/product/public/findById?id=${productId}`);
                setProduct(result);
                console.log(result);
                // Lấy sản phẩm liên quan
                const relatedResult = await getMethod(`http://localhost:8080/api/product/public/san-pham-lien-quan?id=${productId}`);
                setRelatedProducts(relatedResult || []);
            } catch (error) {
                console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
            }
        };

        fetchProductDetail();
    }, []);

    const addToCart = (product) => {
        const isLoggedIn = !!token;

        if (!isLoggedIn) {
            alert('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!');
            navigate('/login');
            return;
        }

        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const productWithQuantity = { ...product, quantity };
        cart.push(productWithQuantity);
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${product.name} đã được thêm vào giỏ hàng với số lượng ${quantity}!`);
    };

    const handleQuantityChange = (e) => {
        setQuantity(Number(e.target.value));
    };

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container my-5">
    <nav aria-label="breadcrumb">
        <ol className="breadcrumb" style={{ marginTop: '80px' }}>
            <li className="breadcrumb-item" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                Trang chủ
            </li>
            <li className="breadcrumb-item active" aria-current="page">
                {product?.name || 'Sản phẩm'}
            </li>
        </ol>
    </nav>

    {/* Product Detail Section */}
    <div className="row product-container">
        {/* Ảnh sản phẩm */}
        <div className="product-image-container col-md-6" style={{ marginTop: '80px' }}>
            <img 
                src={product?.imageBanner || ''} 
                className="img-fluid product-image" 
                alt={product?.name || 'Sản phẩm'}
                style={{ maxWidth: '100%', height: 'auto' }}
            />
        </div>

        {/* Thông tin sản phẩm */}
        <div className="col-md-6 product-info" style={{ marginTop: '80px' }}>
            <h2 className="product-name">{product?.name || 'Tên sản phẩm'}</h2>
            <p className="product-description">{product?.description || 'Mô tả sản phẩm'}</p>
            <h3 className="product-price">
                {formatMoney(product?.price || 0)} <span style={{ textDecoration: 'underline' }}></span>
            </h3>

            {/* Chọn số lượng */}
            <div className="mt-3">
                <label htmlFor="quantity">Số lượng:</label>
                <input 
                    type="number" 
                    id="quantity" 
                    value={quantity}
                    onChange={handleQuantityChange}
                    min="1" 
                    className="form-control w-auto" 
                    style={{ width: '100px' }}
                />
            </div>

            {/* Thêm vào giỏ hàng */}
            <div className="mt-4">
                <button className="btn btn-primary add-to-cart-btn" onClick={() => addToCart(product)}>
                    Thêm vào giỏ hàng
                </button>
            </div>
        </div>
    </div>

    {/* Sản phẩm liên quan */}
    <h2 className="mt-5 mb-4">Sản phẩm liên quan</h2>
    <div className="row">
        {relatedProducts.length === 0 ? ( // Kiểm tra nếu không có sản phẩm liên quan
            <div className="col-12">
                <p>Không có sản phẩm liên quan</p> {/* Hiển thị thông báo khi không có sản phẩm liên quan */}
            </div>
        ) : (
            relatedProducts.map(product => (
                <div className="col-md-3 mb-4" key={product.id}>
                    <div
                        className="card h-100 d-flex flex-column align-items-center text-center"
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/Product?productId=${product.id}&productName=${product.name}`)}
                    >
                        <div className="d-flex bg-light justify-content-center align-items-center w-100" style={{ height: '150px' }}>
                            <img 
                                src={product.imageBanner} 
                                className="card-img-top h-75 w-75" 
                                alt={product.name}
                                style={{ objectFit: 'contain' }}
                            />
                        </div>
                        <div className="card-body d-flex flex-column align-items-center">
                            <h5 className="card-title">{product.name}</h5>
                            <p className="card-text">
                                <span>
                                    {formatMoney(product.price)} <span style={{ textDecoration: 'underline' }}></span>
                                </span>
                            </p>
                            <button
                                className="btn btn-primary mt-auto"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    addToCart(product);
                                }}
                            >
                                Thêm vào giỏ hàng
                            </button>
                        </div>
                    </div>
                </div>
            ))
        )}
    </div>

    {/* "Show More" Button */}
    {relatedProducts.length > 4 && (
        <div className="text-center mt-4">
            <button className="btn btn-light">Xem thêm</button>
        </div>
    )}
</div>

    );
}

export default ProductDetail;
