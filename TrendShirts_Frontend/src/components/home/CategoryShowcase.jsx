import { Link } from 'react-router-dom';

const categories = [
  {
    id: 1,
    name: "T-Shirts",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80",
    link: "/products?category=tshirts"
  },
  {
    id: 2,
    name: "Shirts",
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80",
    link: "/products?category=shirts"
  },
  {
    id: 3,
    name: "Hoodies",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80",
    link: "/products?category=hoodies"
  },
  {
    id: 4,
    name: "Accessories",
    image: "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?auto=format&fit=crop&q=80",
    link: "/products?category=accessories"
  }
];

function CategoryShowcase() {
  return (
    <section>
      <h2 className="section-title">Shop by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {categories.map(category => (
          <Link 
            key={category.id} 
            to={category.link}
            className="group relative overflow-hidden rounded-lg aspect-square"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
            <img 
              src={category.image} 
              alt={category.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
              <h3 className="text-white text-xl font-bold">{category.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default CategoryShowcase;