# HTTP Base Service

This directory contains a robust HTTP base service for making API calls with proper dispatch handling for success and failure callbacks.

## Overview

The HTTP base service provides a centralized way to make API calls with consistent error handling, loading states, and success/failure callbacks. It uses Axios under the hood and provides a clean interface for making HTTP requests.

## Files

- `httpBase.ts`: The core HTTP base service that handles all HTTP requests
- `apiService.ts`: A service that uses the HTTP base to make API calls
- `githubService.ts`: A service for GitHub-related API calls
- `linkedinService.ts`: A service for LinkedIn-related API calls
- `api.ts`: Legacy API service (kept for backward compatibility)

## Usage

### Basic Usage

```typescript
import httpBase from '@/services/httpBase';

// Simple GET request
const data = await httpBase.get('/api/endpoint');

// POST request with data
const response = await httpBase.post('/api/endpoint', { name: 'John' });

// PUT request with data
const updatedData = await httpBase.put('/api/endpoint/1', { name: 'John Updated' });

// DELETE request
const deleteResponse = await httpBase.delete('/api/endpoint/1');
```

### With Success and Error Callbacks

```typescript
import httpBase from '@/services/httpBase';

const data = await httpBase.get('/api/endpoint', undefined, undefined, {
  onSuccess: (data) => {
    console.log('Success:', data);
  },
  onError: (error) => {
    console.error('Error:', error);
  },
  onFinally: () => {
    console.log('Request completed');
  }
});
```

### With Toast Notifications

```typescript
import httpBase from '@/services/httpBase';

const data = await httpBase.post('/api/endpoint', { name: 'John' }, undefined, {
  showSuccessToast: true,
  showErrorToast: true,
  successMessage: 'Data saved successfully'
});
```

### With Redux Dispatch

```typescript
import httpBase from '@/services/httpBase';
import { useDispatch } from 'react-redux';
import { fetchDataRequest, fetchDataSuccess, fetchDataFailure } from '@/store/actions';

const MyComponent = () => {
  const dispatch = useDispatch();

  const fetchData = async () => {
    try {
      dispatch(fetchDataRequest());
      
      const data = await httpBase.get('/api/endpoint', undefined, undefined, {
        onSuccess: (data) => {
          dispatch(fetchDataSuccess(data));
        },
        onError: (error) => {
          dispatch(fetchDataFailure(error));
        }
      });
      
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // ...
};
```

### Using Service Classes

```typescript
import apiService from '@/services/apiService';
import githubService from '@/services/githubService';
import linkedinService from '@/services/linkedinService';

// Using apiService
const profile = await apiService.getProfile();

// Using githubService
const repos = await githubService.getRepos();

// Using linkedinService
const experience = await linkedinService.getExperience();
```

### Using Hooks

```typescript
import { useGithubData } from '@/hooks/useGithubData';
import { useLinkedInData } from '@/hooks/useLinkedInData';

const MyComponent = () => {
  // GitHub data
  const { 
    profile, 
    repos, 
    contributions,
    fetchProfile,
    fetchRepos,
    fetchContributions
  } = useGithubData();

  // LinkedIn data
  const {
    experience,
    education,
    certificates,
    skills,
    fetchExperience,
    fetchEducation,
    fetchCertificates,
    fetchSkills
  } = useLinkedInData();

  // ...
};
```

## Configuration

The HTTP base service uses the following environment variables:

- `VITE_BACKEND_URL`: The base URL for API requests (defaults to `http://127.0.0.1:8000` if not set)

You can configure the HTTP base service by modifying the `httpBase.ts` file:

- Timeout: The default timeout is 30 seconds
- Headers: The default headers include `Content-Type: application/json` and `Accept: application/json`
- Interceptors: You can add request and response interceptors for global handling

## Error Handling

The HTTP base service provides comprehensive error handling:

- 401 Unauthorized: Handles unauthorized access
- 403 Forbidden: Handles forbidden access
- 404 Not Found: Handles not found resources
- 500+ Server Errors: Handles server errors
- Network Errors: Handles network connectivity issues

## Toast Notifications

The HTTP base service integrates with the UI toast system to display success and error messages:

- Success toasts: Displayed when a request succeeds (if enabled)
- Error toasts: Displayed when a request fails (if enabled)

## Dispatch Actions

The HTTP base service supports dispatching actions for Redux or other state management libraries:

- Request actions: Dispatched when a request starts
- Success actions: Dispatched when a request succeeds
- Failure actions: Dispatched when a request fails

## License

This code is part of the portfolio-front project and is subject to its license terms.
