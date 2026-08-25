const BASE_URL = 'http://localhost:5000/api';

let currentAccessToken = null;

export const setAccessToken = (token) => {
  currentAccessToken = token;
};

const getAuthHeaders = () => {
  return currentAccessToken ? { 'Authorization': `Bearer ${currentAccessToken}` } : {};
};

// Generic fetch wrapper with 401 interceptor
const fetchWithAuth = async (url, options = {}) => {
  // Ensure credentials are included if hitting backend (for cookies)
  options.credentials = 'include';
  
  let res = await fetch(url, options);
  
  if (res.status === 401) {
    // Attempt token refresh
    try {
      const refreshRes = await fetch(`${BASE_URL}/auth/refresh-token`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (refreshRes.ok) {
        const { token } = await refreshRes.json();
        setAccessToken(token);
        
        // Retry original request with new token
        const newOptions = { ...options };
        newOptions.headers = {
          ...newOptions.headers,
          'Authorization': `Bearer ${token}`
        };
        res = await fetch(url, newOptions);
      } else {
        // Refresh failed, user needs to log in again
        setAccessToken(null);
        window.dispatchEvent(new Event('auth-expired'));
      }
    } catch (err) {
      setAccessToken(null);
      window.dispatchEvent(new Event('auth-expired'));
    }
  }

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    const error = new Error((data && data.error) || 'Request failed');
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
};

export const api = {
  // ================= AUTH API =================
  async sendOtp(email) {
    return fetchWithAuth(`${BASE_URL}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
  },

  async register(name, email, password, phone = '', address = '', otp = '') {
    const data = await fetchWithAuth(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phone, address, otp })
    });
    if (data.token) setAccessToken(data.token);
    return data;
  },

  async login(email, password) {
    const data = await fetchWithAuth(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (data.token) setAccessToken(data.token);
    return data;
  },

  async logout() {
    try {
      await fetchWithAuth(`${BASE_URL}/auth/logout`, { method: 'POST' });
    } finally {
      setAccessToken(null);
    }
  },

  async getMe() {
    return fetchWithAuth(`${BASE_URL}/auth/me`, {
      headers: { ...getAuthHeaders() }
    });
  },

  // ================= ADMIN USERS API =================
  async getAdminUsers(page = 1, limit = 12) {
    return fetchWithAuth(`${BASE_URL}/auth/admin/users?page=${page}&limit=${limit}`, {
      headers: { ...getAuthHeaders() }
    });
  },

  async updateAdminUserRole(id, role) {
    return fetchWithAuth(`${BASE_URL}/auth/admin/users/${id}/role`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders() 
      },
      body: JSON.stringify({ role })
    });
  },

  // ================= PRODUCTS API =================
  async getProducts(page = 1, limit = 12) {
    return fetchWithAuth(`${BASE_URL}/products?page=${page}&limit=${limit}`);
  },

  async getProductsCustom(queryString) {
    return fetchWithAuth(`${BASE_URL}/products${queryString}`);
  },

  async getProduct(id) {
    return fetchWithAuth(`${BASE_URL}/products/${id}`);
  },

  async addProduct(productData) {
    return fetchWithAuth(`${BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(productData)
    });
  },

  async updateProduct(id, productData) {
    return fetchWithAuth(`${BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(productData)
    });
  },

  async deleteProduct(id) {
    return fetchWithAuth(`${BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() }
    });
  },

  // ================= CATEGORIES API =================
  async getCategories() {
    return fetchWithAuth(`${BASE_URL}/categories`);
  },

  // ================= ORDERS API =================
  async placeOrder(orderData) {
    return fetchWithAuth(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(orderData)
    });
  },

  async getUserOrders(page = 1, limit = 12) {
    return fetchWithAuth(`${BASE_URL}/orders?page=${page}&limit=${limit}`, {
      headers: { ...getAuthHeaders() }
    });
  },

  async getAdminOrders(page = 1, limit = 12) {
    return fetchWithAuth(`${BASE_URL}/orders/admin?page=${page}&limit=${limit}`, {
      headers: { ...getAuthHeaders() }
    });
  },

  async getAdminStats() {
    return fetchWithAuth(`${BASE_URL}/orders/admin/stats`, {
      headers: { ...getAuthHeaders() }
    });
  },

  async updateOrderStatus(id, updateData) {
    return fetchWithAuth(`${BASE_URL}/orders/admin/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(updateData)
    });
  },

  // ================= PAYMENT API =================
  async getRazorpayKey() {
    return fetchWithAuth(`${BASE_URL}/payment/key`, {
      headers: { ...getAuthHeaders() }
    });
  },

  async createRazorpayOrder(items) {
    return fetchWithAuth(`${BASE_URL}/payment/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ items })
    });
  },

  async verifyRazorpayPayment(paymentData) {
    return fetchWithAuth(`${BASE_URL}/payment/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(paymentData)
    });
  }
};
