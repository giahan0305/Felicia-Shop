import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function DefaultLayout() {
    const navigate = useNavigate();
    const products = [
        { id: 1, name: "Trà sữa Phúc Long", price: "30,000 đ", image: "./assets/trasua.jpg" },
        { id: 2, name: "Cà phê sữa đá", price: "25,000 đ", image: "./assets/cafesuada.jpg" },
        { id: 3, name: "Trà đào cam sả", price: "35,000 đ", image: "./assets/tradao.jpg" },
        { id: 4, name: "Bánh kem dâu", price: "45,000 đ", image: "./assets/banhkemdau.jpg" },
        { id: 5, name: "Sinh tố xoài", price: "40,000 đ", image: "./assets/sinhtox.jpg" },
        { id: 6, name: "Cà phê đen", price: "20,000 đ", image: "./assets/cafeden.jpg" },

    ];
    const [visibleCount, setVisibleCount] = useState(4);

    const handleShowMore = () => {
        setVisibleCount(prevCount => Math.min(prevCount + 4, products.length));
    };

    // Function to handle adding to cart
    const addToCart = (product) => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${product.name} đã được thêm vào giỏ hàng!`);
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
                        <div className="col-md-3 mb-4" key={product.id}>
                            <div
                                className="card h-100 d-flex flex-column align-items-center text-center"
                                style={{ cursor: 'pointer' }}
                                onClick={() => navigate(`/Product/${product.id}`)}
                            >
                                <div className="d-flex bg-light justify-content-center align-items-center w-100" style={{ height: "150px" }}>
                                    <img src="./assets/tra.png" className="card-img-top h-75 w-75" alt={product.name} style={{ objectFit: "contain" }} />
                                </div>
                                <div className="card-body d-flex flex-column align-items-center">
                                    <h5 className="card-title">{product.name}</h5>
                                    <p className="card-text">{product.price}</p>
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
