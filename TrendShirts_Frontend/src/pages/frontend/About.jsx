import React from 'react';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">About TrendShirts</h1>
      
      <div className="mb-8 rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-2xl font-semibold">Our Story</h2>
        <p className="mb-4 text-gray-700">
          TrendShirts was founded in 2020 with a simple mission: to provide high-quality, 
          trendy clothing at affordable prices. What started as a small operation has grown 
          into a beloved brand known for its commitment to style, quality, and customer satisfaction.
        </p>
        <p className="text-gray-700">
          We believe that fashion should be accessible to everyone, and that's why we work 
          tirelessly to bring you the latest trends and timeless classics that won't break the bank.
        </p>
      </div>
      
      <div className="mb-8 rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-2xl font-semibold">Our Values</h2>
        <ul className="list-inside list-disc space-y-2 text-gray-700">
          <li><strong>Quality:</strong> We never compromise on the quality of our products.</li>
          <li><strong>Affordability:</strong> Fashion shouldn't be expensive.</li>
          <li><strong>Sustainability:</strong> We're committed to reducing our environmental impact.</li>
          <li><strong>Inclusivity:</strong> Our clothing is designed for everyone.</li>
          <li><strong>Customer Service:</strong> Your satisfaction is our top priority.</li>
        </ul>
      </div>
      
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-2xl font-semibold">Meet the Team</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {/* Team member cards would go here */}
          <div className="rounded border p-4 text-center">
            <div className="mx-auto mb-3 h-24 w-24 overflow-hidden rounded-full">
              <img 
                src="https://via.placeholder.com/150" 
                alt="CEO" 
                className="h-full w-full object-cover"
              />
            </div>
            <h3 className="text-lg font-semibold">Jane Doe</h3>
            <p className="text-gray-600">Founder & CEO</p>
          </div>
          
          <div className="rounded border p-4 text-center">
            <div className="mx-auto mb-3 h-24 w-24 overflow-hidden rounded-full">
              <img 
                src="https://via.placeholder.com/150" 
                alt="Creative Director" 
                className="h-full w-full object-cover"
              />
            </div>
            <h3 className="text-lg font-semibold">John Smith</h3>
            <p className="text-gray-600">Creative Director</p>
          </div>
          
          <div className="rounded border p-4 text-center">
            <div className="mx-auto mb-3 h-24 w-24 overflow-hidden rounded-full">
              <img 
                src="https://via.placeholder.com/150" 
                alt="Head of Design" 
                className="h-full w-full object-cover"
              />
            </div>
            <h3 className="text-lg font-semibold">Emily Johnson</h3>
            <p className="text-gray-600">Head of Design</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;