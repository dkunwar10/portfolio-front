
import React, { createContext, useContext, useState, useEffect, ReactNode, useReducer } from 'react';
import { ProfileData } from '@/services/apiService';
import apiService from '@/services/apiService';
import { FETCH_PROFILE_REQUEST, FETCH_PROFILE_SUCCESS, FETCH_PROFILE_FAILURE } from '@/types/actionTypes';

// Define the state interface
interface ProfileState {
  profileData: ProfileData | null;
  loading: boolean;
  error: string | null;
}

// Define the context interface
interface ProfileContextType extends ProfileState {
  dispatch: React.Dispatch<ProfileAction>;
}

// Define action types
type ProfileAction =
  | { type: typeof FETCH_PROFILE_REQUEST }
  | { type: typeof FETCH_PROFILE_SUCCESS; payload: ProfileData }
  | { type: typeof FETCH_PROFILE_FAILURE; error: any };

// Initial state
const initialState: ProfileState = {
  profileData: null,
  loading: false,
  error: null,
};

// Reducer function
const profileReducer = (state: ProfileState, action: ProfileAction): ProfileState => {
  switch (action.type) {
    case FETCH_PROFILE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        profileData: action.payload,
        error: null,
      };
    case FETCH_PROFILE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error?.message || 'Failed to fetch profile data',
      };
    default:
      return state;
  }
};

// Create context with default values
const ProfileContext = createContext<ProfileContextType>({
  ...initialState,
  dispatch: () => null,
});

export const useProfile = () => useContext(ProfileContext);

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(profileReducer, initialState);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Dispatch request action
        dispatch({ type: FETCH_PROFILE_REQUEST });

        // Fetch profile data
        const data = await apiService.getProfile({
          dispatch,
          showErrorToast: true
        });

        // Dispatch success action (handled by the apiService)
      } catch (err) {
        // Error handling is done by the apiService
        console.error('Error in ProfileContext:', err);
      }
    };

    fetchProfileData();
  }, []);

  return (
    <ProfileContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ProfileContext.Provider>
  );
};
