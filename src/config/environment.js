// frontend/src/config/environment.js
const config = {
  development: {
    API_URL: 'http://localhost:5000/api',
    SOCKET_URL: 'http://localhost:5000',
    CLOUDINARY_CLOUD_NAME: 'your-cloud-name',
    STRIPE_PUBLIC_KEY: 'pk_test_your-stripe-public-key',
    GOOGLE_CLIENT_ID: 'your-google-client-id',
    FACEBOOK_APP_ID: 'your-facebook-app-id',
    ENABLE_ANALYTICS: false,
    LOG_LEVEL: 'debug'
  },
  
  production: {
    API_URL: process.env.REACT_APP_API_URL || 'https://your-render-app.onrender.com/api',
    SOCKET_URL: process.env.REACT_APP_SOCKET_URL || 'https://your-render-app.onrender.com',
    CLOUDINARY_CLOUD_NAME: 'your-cloud-name',
    STRIPE_PUBLIC_KEY: 'pk_live_your-stripe-public-key',
    GOOGLE_CLIENT_ID: 'your-google-client-id',
    FACEBOOK_APP_ID: 'your-facebook-app-id',
    ENABLE_ANALYTICS: true,
    LOG_LEVEL: 'error'
  },
  
  test: {
    API_URL: 'http://localhost:5001/api',
    SOCKET_URL: 'http://localhost:5001',
    CLOUDINARY_CLOUD_NAME: 'test-cloud-name',
    STRIPE_PUBLIC_KEY: 'pk_test_your-stripe-public-key',
    GOOGLE_CLIENT_ID: 'test-google-client-id',
    FACEBOOK_APP_ID: 'test-facebook-app-id',
    ENABLE_ANALYTICS: false,
    LOG_LEVEL: 'debug'
  }
};

const environment = process.env.NODE_ENV || 'development';

export default config[environment];