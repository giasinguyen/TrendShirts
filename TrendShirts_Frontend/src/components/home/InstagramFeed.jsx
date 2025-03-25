import React from 'react';

const instagramPosts = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f',
    likes: 234,
    comments: 12
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b',
    likes: 456,
    comments: 23
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e',
    likes: 789,
    comments: 45
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c',
    likes: 321,
    comments: 16
  }
];

export const InstagramFeed = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">@trendshirts</h2>
        <p className="text-gray-600 text-center mb-12">Follow us on Instagram for daily inspiration</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {instagramPosts.map((post) => (
            <a
              key={post.id}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
            >
              <img
                src={post.image}
                alt="Instagram post"
                className="w-full aspect-square object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white">
                <div className="text-center">
                  <p className="font-semibold">{post.likes} likes</p>
                  <p>{post.comments} comments</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};