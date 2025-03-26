import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Thực tế sẽ gửi dữ liệu đến API
    console.log('Form submitted:', formData);
    setSubmitted(true);
    // Reset form sau 3 giây
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Contact Us</h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        {/* Contact Information */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-2xl font-semibold">Get In Touch</h2>
          <p className="mb-6 text-gray-700">
            Have questions about our products or need assistance with an order? 
            Reach out to us using any of the methods below, and we'll get back to you as soon as possible.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <MapPin className="mr-3 h-6 w-6 text-indigo-600" />
              <div>
                <h3 className="text-lg font-medium">Address</h3>
                <p className="text-gray-600">
                  123 Fashion Street<br />
                  Suite 101<br />
                  New York, NY 10001
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Phone className="mr-3 h-6 w-6 text-indigo-600" />
              <div>
                <h3 className="text-lg font-medium">Phone</h3>
                <p className="text-gray-600">(555) 123-4567</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Mail className="mr-3 h-6 w-6 text-indigo-600" />
              <div>
                <h3 className="text-lg font-medium">Email</h3>
                <p className="text-gray-600">support@trendshirts.com</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="mb-3 text-lg font-medium">Business Hours</h3>
            <ul className="space-y-1 text-gray-600">
              <li>Monday - Friday: 9:00 AM - 6:00 PM</li>
              <li>Saturday: 10:00 AM - 4:00 PM</li>
              <li>Sunday: Closed</li>
            </ul>
          </div>
        </div>
        
        {/* Contact Form */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-2xl font-semibold">Send Us a Message</h2>
          
          {submitted ? (
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Send className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Message sent!</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>Thank you for your message. We'll get back to you shortly.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="subject" className="mb-1 block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="message" className="mb-1 block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  required
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;