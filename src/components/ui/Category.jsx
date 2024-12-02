import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getMethod,getMethodByToken, getMethodPostByToken } from '@services/request';
import { formatMoney } from '@services/Formatmoney';
import { toast } from 'react-toastify';


function Category() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [products, setProducts] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const [visibleCount, setVisibleCount] = useState(4);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const categoryId = params.get('categoryId');
        console.log('categoryId from URL:', categoryId);

        const fetchProducts = async () => {
            try {
                const url = `${apiUrl}/api/product/public/findAll-list`;
                const response = await getMethod(url);
                console.log('API response:', response); 
        
                if (response && Array.isArray(response)) {
                    const filteredProducts = response.filter(
                        (product) => product.category && product.category.id === parseInt(categoryId, 10)
                    );
                    setProducts(filteredProducts);
                } else {
                    console.error('response.content is not an array or is undefined:', response);
                    setProducts([]);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                toast.error('Có lỗi xảy ra khi tải danh sách sản phẩm.');
            }
        };

        if (categoryId) {
            fetchProducts();
        }
    }, [location.search]);

    async function initCart() {
        try {
          const response = await getMethodByToken(`${apiUrl}/api/cart/user/my-cart`);
          await response.json();
        } catch (error) {
          toast.error('Có lỗi xảy ra khi tải giỏ hàng.');
        }
      }
    
      async function updateCartItem(id, quantity) {
        try {
          const url = `${apiUrl}/api/cart/user/up-and-down-cart?id=${id}&quantity=${quantity}`;
          await getMethodByToken(url);
          await initCart();
        } catch (error) {
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

    const handleNavigate = (productId, productName) => {
        navigate(`/product?productId=${productId}&productName=${productName}`);
    };

    const loadMore = () => {
        setVisibleCount((prevCount) => prevCount + 4);
    };

    return (
        <div className="container my-5">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb" style={{ marginTop: '80px' }}>
                    <li
                        className="breadcrumb-item"
                        onClick={() => navigate('/')}
                        style={{ cursor: 'pointer' }}
                    >
                        Trang chủ
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        {new URLSearchParams(location.search).get('categoryName') || 'Danh mục'}
                    </li>
                </ol>
            </nav>
            <div className="row">
                {Array.isArray(products) && products.length > 0 ? (
                    products.slice(0, visibleCount).map((product) => (
                        <div className="col-md-3 mb-4" key={product.id}>
                            <div
                                className="card h-100 d-flex flex-column align-items-center text-center"
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleNavigate(product.id, product.name)}
                            >
                                <div
                                    className="d-flex mt-3 justify-content-center align-items-center w-100"
                                    style={{ height: '150px' }}
                                >
                                    <img
                                        src={product.imageBanner || '../assets/default-image.png'}
                                        className="card-img-top h-100 w-100"
                                        alt={product.name}
                                        style={{ objectFit: 'contain' }}
                                    />
                                </div>

                                <div className="card-body d-flex flex-column align-items-center">
                                    <h5 className="card-title">{product.name}</h5>
                                    <div className="card-text">
                                        <span style={{ fontWeight: 'normal' }}>
                                            {formatMoney(product.price)}
                                        </span>
                                    </div>
                                    <button
                                        className="btn btn-success mt-2"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            addToCart(product,1);
                                        }}
                                    >
                                        Thêm vào giỏ hàng
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12">
                        <p>Không có sản phẩm nào</p>
                    </div>
                )}
            </div>

            {visibleCount < products.length && (
                <div className="text-center mt-4">
                    <button className="btn btn-light" onClick={loadMore}>
                        Xem thêm
                    </button>
                </div>
            )}
        </div>
    );
}

export default Category;