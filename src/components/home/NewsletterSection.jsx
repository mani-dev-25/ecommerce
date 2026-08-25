import React, { useState } from 'react';
import { toast } from 'react-toastify';
import './NewsletterSection.css';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter a valid email address.');
      return;
    }
    
    // Validate simple email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Invalid email address format.');
      return;
    }

    setSubmitting(true);
    
    // Simulate API registration delay
    setTimeout(() => {
      toast.success('Thank you for subscribing! Keep an eye on your inbox for member-only discounts.');
      setEmail('');
      setSubmitting(false);
    }, 1000);
  };

  return (
    <section className="newsletter-section py-5 text-white">
      <div className="container text-center">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <span className="newsletter-badge text-orange text-uppercase">// Stay in the loop</span>
            <h2 className="newsletter-title text-uppercase fw-black my-3">
              Join the Vynex Club
            </h2>
            <p className="newsletter-description text-white-50 mb-4">
              Sign up today and get first access to new collections, exclusive drops, and limited edition deals. Plus, receive <strong className="text-white">10% off</strong> your first order.
            </p>

            <form onSubmit={handleSubscribe} className="newsletter-form">
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="form-control newsletter-input bg-transparent text-white border-white-50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={submitting}
                />
                <button
                  type="submit"
                  className="btn btn-vynex-subscribe"
                  disabled={submitting}
                >
                  {submitting ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
