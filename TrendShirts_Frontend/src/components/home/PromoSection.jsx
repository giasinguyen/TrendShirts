import { Link } from 'react-router-dom';

function PromoSection() {
  return (
    <section className="py-10">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary-dark to-primary">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/10 transform skew-x-12 -translate-x-20"></div>
        <div className="container-custom grid grid-cols-1 md:grid-cols-2 gap-8 py-16">
          <div className="flex flex-col justify-center text-white z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Summer Sale</h2>
            <p className="text-xl mb-8">Get up to 50% off on selected items</p>
            <div>
              <Link 
                to="/products?sale=true" 
                className="inline-block bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-full font-medium"
              >
                Shop Now
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            {/* This would be your promo image, or can be left as decorative space */}
          </div>
        </div>
      </div>
    </section>
  );
}

export default PromoSection;