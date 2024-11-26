
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMethod } from '@services/request'; // Adjust the import path as needed.
import { formatMoney } from '@services/Formatmoney';
function DefaultLayout() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [visibleCount, setVisibleCount] = useState(4);

    // Fetch products from the API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const result = await getMethod('http://localhost:8080/api/product/public/find-all');
                setProducts(result.content); // Adjust based on your API's response structure.
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, []);

    const handleShowMore = () => {
        setVisibleCount(prevCount => Math.min(prevCount + 4, products.length));
    };

    // Function to handle adding to cart
    const addToCart = (product) => {
        const isLoggedIn = !!localStorage.getItem('token'); // Check if token exists
    
        if (!isLoggedIn) {
            alert('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!');
            navigate('/login'); // Redirect to login page
            return;
        }
        else {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${product.name} đã được thêm vào giỏ hàng!`);
        }
    };
    

    return (
        <>
            <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner h-100">
                    <div className="carousel-item h-100 active">
                        <img className="d-block h-100 w-100 object-fit-cover" src="./assets/banner1.jpg" alt="First slide" />
                    </div>
                    <div className="carousel-item h-100">
                        <img className="d-block h-100 w-100 object-fit-cover" src="./assets/banner2.jpg" alt="Second slide" />
                    </div>
                    <div className="carousel-item h-100">
                        <img className="d-block h-100 w-100 object-fit-cover" src="./assets/banner3.jpg" alt="Third slide" />
                    </div>
                </div>
                <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </a>
                <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </a>
            </div>

            <div className="container my-5">
                <h2 className="text-center mb-4">Sản phẩm nổi bật</h2>
                <div className="row">
                    {products.slice(0, visibleCount).map(product => (
                        // In DefaultLayout.js

<div className="col-md-3 mb-4" key={product.id}>
    <div
        className="card h-100 d-flex flex-column align-items-center text-center"
        style={{ cursor: 'pointer' }}
   
// On the click event:
onClick={() => navigate(`/Product?productId=${product.id}&productName=${product.name}`)}


    >
        <div className="d-flex mt-2 bg-light justify-content-center align-items-center w-100" style={{ height: "150px" }}>
            <img src={product.imageBanner} className="card-img-top h-75 w-75" alt={product.name} style={{ objectFit: "contain" }} />
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

                    ))}
                </div>

                {/* "Show More" Button */}
                {visibleCount < products.length && (
                    <div className="text-center mt-4">
                        <button className="btn btn-light" onClick={handleShowMore}>Xem thêm</button>
                    </div>
                )}
            </div>
        </>
    );
}

export default DefaultLayout;
