import { authBaseURL } from '@/config';
import LogOutSession from '@/lib/LogoutSession';

class AuthService {
  async login(email: string, password: string) {
    try {
      const response = await fetch(`${authBaseURL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error(`Invalid Email or Password, Please try again.`);
      }

      const data = await response.json();
      // You might store a token or session data here
      localStorage.setItem('authToken', data.token); // Example: storing token in local storage
      return data;
    } catch (error) {
      console.error('Error logging in: ', error);
      throw error; // Propagate the error for further handling
    }
  }

  async logout() {
    // Example: Clear local storage or perform logout API call
    try {
      localStorage.removeItem('authToken');
      localStorage.clear();
      LogOutSession();
      console.log('Logged out successfully');
    } catch (error) {
      console.error('Error logging out: ', error);
    }
  }

  async register(name: string, email: string, password: string) {
    try {
      const response = await fetch(`${authBaseURL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        throw new Error(`Registration failed, ${response.statusText}`);
      }

      const data = await response.json();
      // You might store a token or session data here
      localStorage.setItem('authToken', data.token); // Example: storing token in local storage
      return data;
    } catch (error) {
      console.error('Error registering: ', error);
      throw error; // Propagate the error for further handling
    }
  }
}

const authServiceInstance = new AuthService();
export default authServiceInstance;
