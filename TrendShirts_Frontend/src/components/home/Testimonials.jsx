import { useState, useEffect } from 'react';

const testimonials = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "Fashion Blogger",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    content: "The quality of shirts from this store is exceptional. The fabric feels premium and the fit is perfect. I've been shopping here for years and have never been disappointed."
  },
  {
    id: 2,
    name: "Sarah Williams",
    role: "Regular Customer",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    content: "I love the variety of designs and styles available. The customer service is also outstanding – they helped me find the perfect size when I was unsure about what to order."
  },
  {
    id: 3,
    name: "Michael Chen",
    role: "Style Enthusiast",
    image: "https://randomuser.me/api/portraits/men/67.jpg",
    content: "These are the most comfortable shirts I've ever owned. They retain their shape and color even after multiple washes. Highly recommend to anyone looking for quality apparel."
  }
];

function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section>
      <h2 className="section-title">What Our Customers Say</h2>
      
      <div className="relative overflow-hidden bg-gray-100 rounded-xl p-6 md:p-8">
        <div 
          className="transition-transform duration-500 ease-in-out flex"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {testimonials.map(testimonial => (
            <div 
              key={testimonial.id}
              className="w-full flex-shrink-0 px-4"
            >
              <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{testimonial.name}</h3>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <div className="mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i}
                      className="inline-block w-5 h-5 text-yellow-400 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700">{testimonial.content}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-6 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === activeIndex ? "bg-primary w-5" : "bg-gray-300"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;