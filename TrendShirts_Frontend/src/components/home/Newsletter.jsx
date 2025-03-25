import { useState } from 'react';

function Newsletter() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      setMessage('Please enter a valid email address');
      setStatus('error');
      return;
    }

    try {
      setStatus('loading');
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage('Thank you for subscribing to our newsletter!');
      setStatus('success');
      setEmail('');
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  return (
    <section className="bg-gray-100 rounded-xl p-8 md:p-12">
      <div className="max-w-xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
        <p className="text-gray-600 mb-6">
          Stay updated on our latest collections, exclusive offers, and style tips.
        </p>
        
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-grow px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
            <button
              type="submit"
              className="btn-primary whitespace-nowrap"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>
          
          {message && (
            <p className={`mt-3 text-sm ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}
        </form>
        
        <p className="mt-4 text-xs text-gray-500">
          By subscribing, you agree to our privacy policy and consent to receive updates from our company.
        </p>
      </div>
    </section>
  );
}

export default Newsletter;