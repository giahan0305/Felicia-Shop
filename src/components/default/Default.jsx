import Header from '@components/header/header';
import Footer from '@components/footer/footer';

function Default(Children) {
    return (
        <div>
            <Header />
            {Children}
            <Footer />
        </div>
    );
}

export default Default;
