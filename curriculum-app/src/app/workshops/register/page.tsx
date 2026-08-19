"use client";

import React, { useState, useEffect, useRef } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { CheckCircle2, ChevronRight, BookOpen, Loader2, IndianRupee, ChevronDown, Phone, Mail, FileText, LayoutTemplate, MessageSquare, Briefcase } from 'lucide-react';
import Link from 'next/link';
import './register.css';

const WORKSHOPS = {
  3: {
    title: '3-Day Fast Track Workshop',
    price: 999,
    curriculum: [
      { day: 1, topics: 'Resume Building, LinkedIn Building, Job Search, Targetted Resume Revamp' },
      { day: 2, topics: 'Interview Preparation, Mock Interviews, Situation Handling Questions' },
      { day: 3, topics: 'Problem Solving, Guesstimation' }
    ]
  },
  5: {
    title: '5-Day Masterclass',
    price: 1999,
    curriculum: [
      { day: 1, topics: 'Self-Awareness' },
      { day: 2, topics: 'Resume Building, LinkedIn Building, Networking, Job Search, Targetted Resume Revamp' },
      { day: 3, topics: 'Elocution, Group Discussions' },
      { day: 4, topics: 'Interview Preparation, Mock Interviews, Situation Handling Questions' },
      { day: 5, topics: 'Problem Solving, Guesstimation' }
    ]
  },
  10: {
    title: '10-Day Comprehensive Bootcamp',
    price: 3999,
    curriculum: [
      { day: 1, topics: 'Pyschometric Assessment' },
      { day: 2, topics: 'Psychometric Report Analysis' },
      { day: 3, topics: 'Self-Awareness' },
      { day: 4, topics: 'Elocution' },
      { day: 5, topics: 'Resume Building, LinkedIn Building, Networking, Job Search, Targetted Resume Revamp' },
      { day: 6, topics: 'Group Discussions' },
      { day: 7, topics: 'Interview Preparation, Mock Interviews' },
      { day: 8, topics: 'Situation/Scenario Handling , Problem Solving, Guesstimation' },
      { day: 9, topics: 'Aptitude Training' },
      { day: 10, topics: 'Aptitude Test' }
    ]
  }
};

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    workshopDays: ''
  });
  
  const [isLocked, setIsLocked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Navigation Dropdown State
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (menu: string) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };
  
  const handleWorkshopSelect = (days: string) => {
    setFormData(prev => ({ ...prev, workshopDays: days }));
    setActiveDropdown(null);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  
  const selectedWorkshop = formData.workshopDays ? WORKSHOPS[parseInt(formData.workshopDays) as keyof typeof WORKSHOPS] : null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLockChoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.workshopDays) {
      alert("Please fill all fields before proceeding.");
      return;
    }
    setIsLocked(true);
  };


  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayCheckout = async () => {
    setIsSubmitting(true);
    const res = await loadRazorpayScript();
    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      setIsSubmitting(false);
      return;
    }

    try {
      // 1. Create order
      const orderData = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: selectedWorkshop?.price || 0 })
      }).then(t => t.json());

      if (!orderData.success) throw new Error(orderData.error);

      // 2. Open Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use the public key
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "The Career Breweries",
        description: selectedWorkshop?.title,
        order_id: orderData.order.id,
        handler: async function (response: any) {
          try {
            // 3. Verify Payment
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            }).then(t => t.json());

            if (!verifyRes.success) throw new Error("Payment verification failed.");

            // 4. Create Registration
            const registrationsRef = collection(db, 'registrations');
            const docRef = await addDoc(registrationsRef, {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              workshopDays: parseInt(formData.workshopDays, 10),
              status: 'approved', // Auto-approved via Razorpay!
              paymentId: response.razorpay_payment_id,
              createdAt: serverTimestamp()
            });

            // 5. Trigger Backend Server Action to provision credentials and email
            const { approveRegistrationAction } = await import('@/app/actions/adminOps');
            await approveRegistrationAction(docRef.id);
            
            // Push to Google Sheets Pipeline
            try {
              const gasUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL;
              if (gasUrl) {
                await fetch(gasUrl, {
                  method: 'POST',
                  mode: 'no-cors',
                  headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                  body: JSON.stringify({
                    id: docRef.id,
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    workshopDays: formData.workshopDays,
                    utr: response.razorpay_payment_id, // Save payment ID in UTR col
                    status: 'approved'
                  })
                });
              }
            } catch (err) {}

            setIsSuccess(true);
          } catch(err: any) {
            alert('Error processing registration: ' + err.message);
          }
          setIsSubmitting(false);
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#4A3B32"
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

      paymentObject.on('payment.failed', function (response: any) {
        alert('Payment failed: ' + response.error.description);
        setIsSubmitting(false);
      });

    } catch(err: any) {
      alert('Error initiating payment: ' + err.message);
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="success-container">
        <div className="success-card">
          <div className="success-icon">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="success-title">Registration Received!</h2>
          <p style={{ color: 'var(--text-light)', marginBottom: '2rem', lineHeight: '1.6' }}>
            Thank you, <strong>{formData.name}</strong>. We have received your payment confirmation. Our team will verify the transaction and send your login credentials to <strong>{formData.email}</strong> shortly.
          </p>
          <Link href="/" className="btn-primary" style={{ textDecoration: 'none' }}>
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="register-page">
      {/* Header */}
      <header className="register-header">
        <Link href="/" className="brand-logo">
          The Career <span>Breweries</span>
        </Link>
        <nav className="nav-links" ref={navRef}>
          
          {/* Programs Dropdown */}
          <div className="nav-item">
            <button 
              className={`nav-btn ${activeDropdown === 'programs' ? 'active' : ''}`} 
              onClick={() => toggleDropdown('programs')}
            >
              Workshops <ChevronDown size={16} />
            </button>
            <div className={`dropdown-menu ${activeDropdown === 'programs' ? 'open' : ''}`}>
              <div className="dropdown-title">Our Workshops</div>
              <ul className="dropdown-list">
                <li onClick={() => handleWorkshopSelect('3')}><FileText size={16} /> 3-Day Fast Track Workshop</li>
                <li onClick={() => handleWorkshopSelect('5')}><FileText size={16} /> 5-Day Masterclass</li>
                <li onClick={() => handleWorkshopSelect('10')}><FileText size={16} /> 10-Day Comprehensive Bootcamp</li>
              </ul>
            </div>
          </div>

          {/* About Dropdown */}
          <div className="nav-item">
            <button 
              className={`nav-btn ${activeDropdown === 'about' ? 'active' : ''}`} 
              onClick={() => toggleDropdown('about')}
            >
              About <ChevronDown size={16} />
            </button>
            <div className={`dropdown-menu ${activeDropdown === 'about' ? 'open' : ''}`}>
              <div className="dropdown-title">The Career Breweries</div>
              <p className="dropdown-text">
                We are dedicated to bridging the gap between academia and industry. Our intensive programs build standout profiles, master interview techniques, and help you land your dream job with confidence.
              </p>
            </div>
          </div>

          {/* Products Dropdown */}
          <div className="nav-item">
            <button 
              className={`nav-btn ${activeDropdown === 'products' ? 'active' : ''}`} 
              onClick={() => toggleDropdown('products')}
            >
              Products <ChevronDown size={16} />
            </button>
            <div className={`dropdown-menu ${activeDropdown === 'products' ? 'open' : ''}`}>
              <div className="dropdown-title">Digital Products</div>
              <ul className="dropdown-list">
                <li><Briefcase size={16} className="text-blue-600" /> Application Brief</li>
                <li><LayoutTemplate size={16} className="text-blue-600" /> Resume Builder</li>
                <li><FileText size={16} className="text-blue-600" /> Resume Rewriter</li>
                <li><CheckCircle2 size={16} className="text-blue-600" /> Resume Audit</li>
                <li><MessageSquare size={16} className="text-blue-600" /> Interview Simulator</li>
                <li><LayoutTemplate size={16} className="text-blue-600" /> LinkedIn Optimizer</li>
              </ul>
            </div>
          </div>

          {/* Contact Dropdown */}
          <div className="nav-item">
            <button 
              className={`nav-btn ${activeDropdown === 'contact' ? 'active' : ''}`} 
              onClick={() => toggleDropdown('contact')}
            >
              Contact <ChevronDown size={16} />
            </button>
            <div className={`dropdown-menu ${activeDropdown === 'contact' ? 'open' : ''}`}>
              <div className="dropdown-title">Get in Touch</div>
              <ul className="dropdown-list">
                <li><Phone size={16} className="text-blue-600" /> <strong>+91 97437 11584</strong></li>
                <li><Mail size={16} className="text-blue-600" /> <strong>careerbreweries@gmail.com</strong></li>
              </ul>
            </div>
          </div>

        </nav>
      </header>

      {/* Typography Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">
          Good careers aren't rushed.<br/>They're <span>brewed.</span>
        </h1>
        <p className="hero-subtitle">
          Join our intensive workshops to build a standout profile, master interviews, and land your dream job. Apply below to secure your spot in the next cohort.
        </p>
      </section>

      {/* Main Content */}
      <main className="main-container" ref={formRef} style={{ scrollMarginTop: '2rem' }}>
        
        {/* Left Column: Form */}
        <div className="glass-card">
          <h2 className="card-title">
            <span className="step-indicator">1.</span>
            Application Details
          </h2>
          
          <form onSubmit={handleLockChoice}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                name="name"
                required
                disabled={isLocked}
                value={formData.name}
                onChange={handleInputChange}
                className="form-input"
                placeholder="John Doe"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                name="email"
                required
                disabled={isLocked}
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
                placeholder="john@example.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input 
                type="tel" 
                name="phone"
                required
                disabled={isLocked}
                value={formData.phone}
                onChange={handleInputChange}
                className="form-input"
                placeholder="+91 98765 43210"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Select Workshop</label>
              <select 
                name="workshopDays"
                required
                disabled={isLocked}
                value={formData.workshopDays}
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="" disabled>Choose a program...</option>
                <option value="3">3-Day Fast Track Workshop</option>
                <option value="5">5-Day Masterclass</option>
                <option value="10">10-Day Comprehensive Bootcamp</option>
              </select>
            </div>

            {!isLocked && (
              <button type="submit" className="btn-primary" style={{ marginTop: '2rem' }}>
                Proceed to Payment <ChevronRight size={18} />
              </button>
            )}
          </form>
        </div>

        {/* Right Column: Dynamic Info & Payment */}
        <div>
          
          {/* Dynamic Curriculum Display */}
          <div className={`glass-card curriculum-view ${selectedWorkshop ? 'visible' : ''}`} style={{ display: selectedWorkshop ? 'block' : 'none', marginBottom: '2rem' }}>
            {selectedWorkshop && (
              <>
                <div className="curriculum-header">
                  <div>
                    <h3 className="curriculum-title">{selectedWorkshop.title}</h3>
                    <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '0.875rem' }}>Curriculum Outline</p>
                  </div>
                  <div className="price-tag">
                    <IndianRupee size={16} /> {selectedWorkshop.price}
                  </div>
                </div>
                
                <div className="timeline">
                  {selectedWorkshop.curriculum.map((day, idx) => (
                    <div key={idx} className="timeline-item">
                      <div className="timeline-node">
                        <div className="day-circle">{day.day}</div>
                        {idx !== selectedWorkshop.curriculum.length - 1 && (
                          <div className="timeline-line"></div>
                        )}
                      </div>
                      <div className="timeline-content">
                        <h4>Day {day.day}</h4>
                        <p>{day.topics}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {!selectedWorkshop && !isLocked && (
            <div className="glass-card empty-state">
              <BookOpen size={48} />
              <p>Select a workshop to view curriculum details and proceed.</p>
            </div>
          )}

          {isLocked && (
            <div className="payment-section">
              <h2 className="card-title">
                <span className="step-indicator">2.</span>
                Complete Payment
              </h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.5', fontSize: '0.9rem' }}>
                You are about to register for the <strong>{selectedWorkshop?.title}</strong>. 
                Click below to pay securely via Razorpay (UPI, Credit/Debit Card, NetBanking).
              </p>
              
              <div className="qr-container" style={{ padding: '2rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600', marginBottom: '0.5rem' }}>Amount to Pay</div>
                  <div style={{ fontSize: '2.5rem', fontFamily: "'Playfair Display', serif", color: 'var(--text-espresso)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                    <IndianRupee size={28} /> {selectedWorkshop?.price}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '2rem' }}>
                <button 
                  onClick={handleRazorpayCheckout}
                  disabled={isSubmitting}
                  className="btn-primary"
                  style={{ backgroundColor: '#2b6cb0', borderColor: '#2b6cb0' }}
                >
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                  {isSubmitting ? 'Processing...' : 'Pay & Register Securely'}
                </button>
                <button 
                  onClick={() => setIsLocked(false)}
                  disabled={isSubmitting}
                  className="btn-outline"
                >
                  Go Back & Edit Details
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
