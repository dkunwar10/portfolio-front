import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { toast } from '@/components/ui/sonner';

// Define the base API URL from environment variables or fallback to a default
const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

// Define types for request handlers
export type SuccessHandler<T> = (data: T) => void;
export type ErrorHandler = (error: any) => void;
export type FinallyHandler = () => void;

// Define request options interface
export interface RequestOptions<T> {
  dispatch?: (action: any) => void;
  onSuccess?: SuccessHandler<T>;
  onError?: ErrorHandler;
  onFinally?: FinallyHandler;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
}

// Create HTTP base class
class HttpBase {
  private instance: AxiosInstance;

  constructor(baseURL: string = API_URL) {
    // Create axios instance with default config
    this.instance = axios.create({
      baseURL,
      timeout: 30000, // 30 seconds timeout
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Add request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        // You can add auth token here if needed
        // const token = localStorage.getItem('token');
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor
    this.instance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error: AxiosError) => {
        // Handle global error responses here
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          const status = error.response.status;
          
          if (status === 401) {
            // Handle unauthorized access
            // You might want to redirect to login page or refresh token
            console.error('Unauthorized access');
          } else if (status === 403) {
            // Handle forbidden access
            console.error('Forbidden access');
          } else if (status === 404) {
            // Handle not found
            console.error('Resource not found');
          } else if (status >= 500) {
            // Handle server errors
            console.error('Server error');
          }
        } else if (error.request) {
          // The request was made but no response was received
          console.error('No response received from server');
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error setting up request:', error.message);
        }
        
        return Promise.reject(error);
      }
    );
  }

  // Generic request method
  private async request<T>(
    method: string,
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
    options?: RequestOptions<T>
  ): Promise<T> {
    try {
      let response: AxiosResponse<T>;

      // Make the appropriate request based on the method
      switch (method.toUpperCase()) {
        case 'GET':
          response = await this.instance.get<T>(url, { ...config, params: data });
          break;
        case 'POST':
          response = await this.instance.post<T>(url, data, config);
          break;
        case 'PUT':
          response = await this.instance.put<T>(url, data, config);
          break;
        case 'DELETE':
          response = await this.instance.delete<T>(url, { ...config, data });
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }

      // Handle success
      if (options?.onSuccess) {
        options.onSuccess(response.data);
      }

      // Show success toast if enabled
      if (options?.showSuccessToast) {
        toast.success(options.successMessage || 'Operation completed successfully');
      }

      return response.data;
    } catch (error: any) {
      // Handle error
      if (options?.onError) {
        options.onError(error);
      }

      // Show error toast if enabled
      if (options?.showErrorToast) {
        const errorMessage = error.response?.data?.detail || error.message || 'An error occurred';
        toast.error(errorMessage);
      }

      throw error;
    } finally {
      // Execute finally handler if provided
      if (options?.onFinally) {
        options.onFinally();
      }
    }
  }

  // Public methods for different HTTP methods
  public async get<T>(
    url: string,
    params?: any,
    config?: AxiosRequestConfig,
    options?: RequestOptions<T>
  ): Promise<T> {
    return this.request<T>('GET', url, params, config, options);
  }

  public async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
    options?: RequestOptions<T>
  ): Promise<T> {
    return this.request<T>('POST', url, data, config, options);
  }

  public async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
    options?: RequestOptions<T>
  ): Promise<T> {
    return this.request<T>('PUT', url, data, config, options);
  }

  public async delete<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
    options?: RequestOptions<T>
  ): Promise<T> {
    return this.request<T>('DELETE', url, data, config, options);
  }

  // Method to get the axios instance (in case direct access is needed)
  public getInstance(): AxiosInstance {
    return this.instance;
  }
}

// Create and export a singleton instance
const httpBase = new HttpBase();
export default httpBase;
