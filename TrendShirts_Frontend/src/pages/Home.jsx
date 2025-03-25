import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-bold mb-6">Welcome to ShirtStore</h1>
      <p className="mb-8">Your one-stop shop for quality apparel and accessories.</p>
      <Link to="/products" className="btn-primary">
        Browse Products
      </Link>
    </div>
  );
}

export default Home;