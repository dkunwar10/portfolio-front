import { ApiAction } from '@/types/actionTypes';

/**
 * Creates a request action
 * @param type The action type
 * @param meta Additional metadata
 * @returns The request action
 */
export const createRequestAction = (type: string, meta?: any): ApiAction => ({
  type,
  meta
});

/**
 * Creates a success action
 * @param type The action type
 * @param payload The payload data
 * @param meta Additional metadata
 * @returns The success action
 */
export const createSuccessAction = <T>(type: string, payload: T, meta?: any): ApiAction<T> => ({
  type,
  payload,
  meta
});

/**
 * Creates a failure action
 * @param type The action type
 * @param error The error object
 * @param meta Additional metadata
 * @returns The failure action
 */
export const createFailureAction = (type: string, error: any, meta?: any): ApiAction => ({
  type,
  error,
  meta
});

/**
 * Creates a set of action creators for API requests
 * @param requestType The request action type
 * @param successType The success action type
 * @param failureType The failure action type
 * @returns Object containing request, success, and failure action creators
 */
export const createApiActions = <T>(
  requestType: string,
  successType: string,
  failureType: string
) => ({
  request: (meta?: any) => createRequestAction(requestType, meta),
  success: (payload: T, meta?: any) => createSuccessAction<T>(successType, payload, meta),
  failure: (error: any, meta?: any) => createFailureAction(failureType, error, meta)
});

/**
 * Utility function to handle API requests with dispatch
 * @param dispatch The dispatch function
 * @param requestType The request action type
 * @param successType The success action type
 * @param failureType The failure action type
 * @param apiCall The API call function
 * @param meta Additional metadata
 * @returns Promise with the API response
 */
export const handleApiRequest = async <T>(
  dispatch: (action: ApiAction) => void,
  requestType: string,
  successType: string,
  failureType: string,
  apiCall: () => Promise<T>,
  meta?: any
): Promise<T | undefined> => {
  try {
    // Dispatch request action
    dispatch(createRequestAction(requestType, meta));
    
    // Make API call
    const response = await apiCall();
    
    // Dispatch success action
    dispatch(createSuccessAction<T>(successType, response, meta));
    
    return response;
  } catch (error) {
    // Dispatch failure action
    dispatch(createFailureAction(failureType, error, meta));
    
    // Re-throw the error for further handling if needed
    throw error;
  }
};
