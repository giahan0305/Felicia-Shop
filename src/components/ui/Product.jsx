import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMethod, getMethodByToken, getMethodPostByToken} from '@services/request'; // Điều chỉnh đường dẫn nếu cần
import { formatMoney } from '@services/Formatmoney';
import { toast } from 'react-toastify';
function ProductDetail() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();
   
    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                const uls = new URL(window.location.href);
                const productId = uls.searchParams.get('productId');
                
                const result = await getMethod(`${apiUrl}/api/product/public/findById?id=${productId}`);
                console.log('Product details:', result); 
                setProduct(result);
        
                const relatedResult = await getMethod(`${apiUrl}/api/product/public/san-pham-lien-quan?id=${productId}`);
                console.log('Related products:', relatedResult); 
                setRelatedProducts(relatedResult || []);
            } catch (error) {
                console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
            }
        };
        
        fetchProductDetail();
    }, []);

    async function initCart() {
        try {
          const response = await getMethodByToken(`${apiUrl}/api/cart/user/my-cart`);
          await response.json();
        } catch (error) {
          console.error('Failed to fetch cart:', error);
          toast.error('Có lỗi xảy ra khi tải giỏ hàng.');
        }
      }
    
      async function updateCartItem(id, quantity) {
        try {
          const url = `${apiUrl}/api/cart/user/up-and-down-cart?id=${id}&quantity=${quantity}`;
          await getMethodByToken(url);
          await initCart();
        } catch (error) {
          console.error('Failed to update cart:', error);
          toast.error('Có lỗi xảy ra khi cập nhật giỏ hàng.');
        }
      }
      
    const addToCart = async (product,newQuantity) => {
        try {
            const response = await getMethodByToken(`${apiUrl}/api/cart/user/my-cart`);
            const cartItems = await response.json();
            const existingItem = cartItems.find(item => item.product.id === product.id);
            if (existingItem) {
                updateCartItem(existingItem.id,newQuantity)
                alert("Số lượng sản phẩm đã được cập nhật trong giỏ hàng");
            } else {
                const url = `${apiUrl}/api/cart/user/create?idproduct=${product.id}`;
                const result = await getMethodPostByToken(url);
                if (newQuantity>1)
                {
                    newQuantity=newQuantity-1;
                    addToCart(product,newQuantity)
                }
                if (result.status < 300) {
                    alert("Thêm giỏ hàng thành công");
                } else {
                    alert("Hãy đăng nhập");
                }
            }
            const url2 = `${apiUrl}/api/cart/user/count-cart`;
            await getMethodByToken(url2);
        } catch (error) {
            console.error("Error adding product to cart:", error);
            toast.error('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.');
        }
    };
    
    
    const handleQuantityChange = (e) => {
        const newQuantity = Number(e.target.value);
    
        if (newQuantity <= 1) {
            alert("Số lượng phải lớn hơn 1!");
        } else {
            setQuantity(newQuantity);
        }
    };
    

    const handleNavigate = (productId, productName) => {
        navigate(`/product?productId=${productId}&productName=${productName}`);
        window.location.reload();
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
                    <li className="breadcrumb-item" onClick={() => navigate(`/category?categoryId=${product.category.id}&categoryName=${encodeURIComponent(product.category.name)}`)} style={{ cursor: 'pointer' }}>
                        {product.category.name || 'Danh mục'}
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        {product?.name || 'Sản phẩm'}
                    </li>
                </ol>
            </nav>

            <div className="row product-container">
                <div className="col-md-4" style={{ height: '400px',marginTop: '5px', width: '300px' }}>
                    <img
                        src={product?.imageBanner || ''}
                        className="img-fluid"
                        alt={product?.name || 'Sản phẩm'}
                        style={{ maxWidth: '100%', height: '90%', objectFit: 'cover' }}
                    />
                </div>

                <div className="col-md-6" style={{ marginRight: '150px',marginTop:' -60px'}}>
                    <h1>{product?.name || 'Tên sản phẩm'}</h1>
                    <p>{product?.description || 'Mô tả sản phẩm'}</p>
                    <h3>{formatMoney(product?.price || 0)}</h3>

                    <p>Lượt mua: {product?.purchaseCount || 0}</p>

                    <div className="mt-3">
                        <label htmlFor="quantity">Số lượng:</label>
                        <input
                            type="number"
                            id="quantity-box"
                            value={quantity}
                            onChange={handleQuantityChange}
                            min="1"
                            className="form-control"
                            style={{ width: '150px' }}
                        />
                    </div>

                    <div className="mt-4">
                        <button className="btn btn-success" onClick={() => addToCart(product,quantity)}>
                            Thêm vào giỏ hàng
                        </button>
                    </div>
                </div>
            </div>

            <h2 className="mt-5 mb-4">Sản phẩm liên quan</h2>
            <div className="row">
                {relatedProducts.length === 0 ? (
                    <div className="col-12">
                        <p>Không có sản phẩm liên quan</p>
                    </div>
                ) : (
                    relatedProducts.map((relatedProduct) => (
                        <div className="col-md-3 mb-4" key={relatedProduct.id}>
                            <div
                                className="card h-100 text-center"
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleNavigate(relatedProduct.id, relatedProduct.name)}
                            >
                                <img
                                    src={relatedProduct.imageBanner}
                                    className="mt-3 card-img-top"
                                    alt={relatedProduct.name}
                                    style={{ height: '150px', objectFit: 'contain' }}
                                />
                                <div className="card-body">
                                    <h5>{relatedProduct.name}</h5>
                                    <div className="card-text">   <p>{formatMoney(relatedProduct.price)}</p> <span style={{ textDecoration: 'underline' }}></span></div>
                                    <button
                                        className="btn btn-success"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            addToCart(relatedProduct,1);
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
        </div>
    );
}

export default ProductDetail;
