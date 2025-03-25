import { useParams } from 'react-router-dom';

function ProductDetail() {
  const { id } = useParams();
  
  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-bold mb-6">Product Details</h1>
      <p>Product ID: {id}</p>
    </div>
  );
}

export default ProductDetail;