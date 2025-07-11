// frontend/src/pages/Payment.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import './Payment.css';

const Payment = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    description: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
  try {
    const response = await api.get('/payments');
    if (response.data.success) {
      setPayments(response.data.data.payments || []);
    }
  } catch (error) {
    console.error('Error fetching payments:', error);
    toast.error('Failed to fetch payment history');
  } finally {
    setLoading(false);
  }
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePayment = async (e) => {
  e.preventDefault();
  setIsProcessing(true);

  try {
    const paymentData = {
      amount: parseFloat(paymentForm.amount),
      paymentMethod: 'stripe', // or 'razorpay'
      type: 'exam', // or 'subscription'
      description: paymentForm.description
    };

    const response = await api.post('/payments', paymentData);
    if (response.data.success) {
      toast.success('Payment processed successfully!');
      setPaymentForm({
        amount: '',
        description: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: ''
      });
      fetchPayments();
    }
  } catch (error) {
    console.error('Payment error:', error);
    toast.error('Payment failed. Please try again.');
  } finally {
    setIsProcessing(false);
  }
};

  if (loading) {
    return <div className="loading">Loading payment information...</div>;
  }

  return (
    <div className="payment-container">
      <div className="payment-header">
        <h1>Payment Center</h1>
        <p>Manage your exam fees and payment history</p>
      </div>

      <div className="payment-content">
        <div className="payment-form-section">
          <h2>Make a Payment</h2>
          <form onSubmit={handlePayment} className="payment-form">
            <div className="form-group">
              <label>Amount ($)</label>
              <input
                type="number"
                name="amount"
                value={paymentForm.amount}
                onChange={handleInputChange}
                placeholder="Enter amount"
                required
                min="1"
                step="0.01"
              />
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                name="description"
                value={paymentForm.description}
                onChange={handleInputChange}
                placeholder="e.g., Exam Fee"
                required
              />
            </div>

            <div className="card-details">
              <h3>Card Details</h3>
              <div className="form-group">
                <label>Cardholder Name</label>
                <input
                  type="text"
                  name="cardholderName"
                  value={paymentForm.cardholderName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={paymentForm.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                  required
                  maxLength="19"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={paymentForm.expiryDate}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    required
                    maxLength="5"
                  />
                </div>
                
                <div className="form-group">
                  <label>CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    value={paymentForm.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    required
                    maxLength="3"
                  />
                </div>
              </div>
            </div>

            <button type="submit" disabled={isProcessing}>
              {isProcessing ? 'Processing...' : 'Pay Now'}
            </button>
          </form>
        </div>

        <div className="payment-history">
          <h2>Payment History</h2>
          {payments.length === 0 ? (
            <div className="no-payments">
              <i className="fas fa-credit-card"></i>
              <p>No payments found</p>
            </div>
          ) : (
            <div className="payments-list">
              {payments.map(payment => (
                <div key={payment._id} className="payment-card">
                  <div className="payment-info">
                    <h3>{payment.description}</h3>
                    <p className="payment-date">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="payment-amount">
                    <span className="amount">${payment.amount}</span>
                    <span className={`status ${payment.status.toLowerCase()}`}>
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;