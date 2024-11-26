import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getMethod } from '@services/request'; // Adjust the import path as needed
import { formatMoney } from '@services/Formatmoney';

function ProductDetail() {
    const { productId } = useParams(); // Get the productId from URL
    const [product, setProduct] = useState(null);
    const navigate = useNavigate();

    // Fetch product details when component mounts or productId changes
    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                // Get the product ID from the current URL
                const uls = new URL(document.URL);
                const id = uls.searchParams.get("id");
                // Fetch product details using the ID
                const response = await getMethod(`http://localhost:8080/api/product/public/find-by-id/${id || product.id}`);
                setProduct(response.content); // Adjust based on your API's response structure
                console.log(response.content); // Debugging: Check the response structure
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
        };
        fetchProductDetail();
    }, [product.id]);

    // Handle adding product to cart
    const addToCart = () => {
        const token = localStorage.getItem('token'); // Check if user is logged in

        if (!token) {
            alert('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!');
            navigate('/login'); // Redirect to login page
            return;
        }

        if (product) {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart.push(product); // Add the product to the cart
            localStorage.setItem('cart', JSON.stringify(cart));
            alert(`${product.name} đã được thêm vào giỏ hàng!`);
        }
    };

    if (!product) {
        return <div>Loading...</div>; // Show loading state while the product is being fetched
    }

    return (
        <div className="container my-5">
            <div className="row">
                {/* Product Image */}
                <div className="col-md-6">
                    <img src={product.imageBanner} className="img-fluid" alt={product.name} />
                </div>

                {/* Product Info */}
                <div className="col-md-6">
                    <h2>{product.name}</h2>
                    <p className="text-muted">{product.description}</p>
                    <h3>
                        {formatMoney(product.price)} <span style={{ textDecoration: 'underline' }}>đ</span>
                    </h3>

                    {/* Product Details */}
                    <div className="mt-4">
                        <button className="btn btn-primary" onClick={addToCart}>
                            Thêm vào giỏ hàng
                        </button>
                    </div>
                </div>
            </div>

            {/* Product Ratings (Optional) */}
            <div className="mt-4">
                <h4>Đánh giá sản phẩm</h4>
                <div className="d-flex">
                    {/* You can add a rating system here */}
                    <span className="badge bg-success">4.5/5</span>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
