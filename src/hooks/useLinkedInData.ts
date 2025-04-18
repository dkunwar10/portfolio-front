import { useReducer, useEffect } from 'react';
import linkedinService from '@/services/linkedinService';
import { LinkedInExperience, LinkedInEducation, LinkedInCertificate } from '@/services/apiService';
import {
  FETCH_LINKEDIN_EXPERIENCE_REQUEST,
  FETCH_LINKEDIN_EXPERIENCE_SUCCESS,
  FETCH_LINKEDIN_EXPERIENCE_FAILURE,
  FETCH_LINKEDIN_EDUCATION_REQUEST,
  FETCH_LINKEDIN_EDUCATION_SUCCESS,
  FETCH_LINKEDIN_EDUCATION_FAILURE,
  FETCH_LINKEDIN_CERTIFICATES_REQUEST,
  FETCH_LINKEDIN_CERTIFICATES_SUCCESS,
  FETCH_LINKEDIN_CERTIFICATES_FAILURE,
  FETCH_LINKEDIN_SKILLS_REQUEST,
  FETCH_LINKEDIN_SKILLS_SUCCESS,
  FETCH_LINKEDIN_SKILLS_FAILURE
} from '@/types/actionTypes';

// Define the state interface
interface LinkedInState {
  experience: {
    data: LinkedInExperience | null;
    loading: boolean;
    error: string | null;
  };
  education: {
    data: LinkedInEducation[] | null;
    loading: boolean;
    error: string | null;
  };
  certificates: {
    data: LinkedInCertificate[] | null;
    loading: boolean;
    error: string | null;
  };
  skills: {
    data: string[] | null;
    loading: boolean;
    error: string | null;
  };
  categorizedSkills: {
    data: Record<string, string[]> | null;
    loading: boolean;
    error: string | null;
  };
}

// Define action types
type LinkedInAction = 
  | { type: typeof FETCH_LINKEDIN_EXPERIENCE_REQUEST }
  | { type: typeof FETCH_LINKEDIN_EXPERIENCE_SUCCESS; payload: LinkedInExperience }
  | { type: typeof FETCH_LINKEDIN_EXPERIENCE_FAILURE; error: any }
  | { type: typeof FETCH_LINKEDIN_EDUCATION_REQUEST }
  | { type: typeof FETCH_LINKEDIN_EDUCATION_SUCCESS; payload: LinkedInEducation[] }
  | { type: typeof FETCH_LINKEDIN_EDUCATION_FAILURE; error: any }
  | { type: typeof FETCH_LINKEDIN_CERTIFICATES_REQUEST }
  | { type: typeof FETCH_LINKEDIN_CERTIFICATES_SUCCESS; payload: LinkedInCertificate[] }
  | { type: typeof FETCH_LINKEDIN_CERTIFICATES_FAILURE; error: any }
  | { type: typeof FETCH_LINKEDIN_SKILLS_REQUEST }
  | { type: typeof FETCH_LINKEDIN_SKILLS_SUCCESS; payload: string[] }
  | { type: typeof FETCH_LINKEDIN_SKILLS_FAILURE; error: any }
  | { type: 'FETCH_LINKEDIN_CATEGORIZED_SKILLS_REQUEST' }
  | { type: 'FETCH_LINKEDIN_CATEGORIZED_SKILLS_SUCCESS'; payload: Record<string, string[]> }
  | { type: 'FETCH_LINKEDIN_CATEGORIZED_SKILLS_FAILURE'; error: any };

// Initial state
const initialState: LinkedInState = {
  experience: {
    data: null,
    loading: false,
    error: null,
  },
  education: {
    data: null,
    loading: false,
    error: null,
  },
  certificates: {
    data: null,
    loading: false,
    error: null,
  },
  skills: {
    data: null,
    loading: false,
    error: null,
  },
  categorizedSkills: {
    data: null,
    loading: false,
    error: null,
  },
};

// Reducer function
const linkedinReducer = (state: LinkedInState, action: LinkedInAction): LinkedInState => {
  switch (action.type) {
    // Experience actions
    case FETCH_LINKEDIN_EXPERIENCE_REQUEST:
      return {
        ...state,
        experience: {
          ...state.experience,
          loading: true,
          error: null,
        },
      };
    case FETCH_LINKEDIN_EXPERIENCE_SUCCESS:
      return {
        ...state,
        experience: {
          ...state.experience,
          loading: false,
          data: action.payload,
          error: null,
        },
      };
    case FETCH_LINKEDIN_EXPERIENCE_FAILURE:
      return {
        ...state,
        experience: {
          ...state.experience,
          loading: false,
          error: action.error?.message || 'Failed to fetch LinkedIn experience',
        },
      };
    
    // Education actions
    case FETCH_LINKEDIN_EDUCATION_REQUEST:
      return {
        ...state,
        education: {
          ...state.education,
          loading: true,
          error: null,
        },
      };
    case FETCH_LINKEDIN_EDUCATION_SUCCESS:
      return {
        ...state,
        education: {
          ...state.education,
          loading: false,
          data: action.payload,
          error: null,
        },
      };
    case FETCH_LINKEDIN_EDUCATION_FAILURE:
      return {
        ...state,
        education: {
          ...state.education,
          loading: false,
          error: action.error?.message || 'Failed to fetch LinkedIn education',
        },
      };
    
    // Certificates actions
    case FETCH_LINKEDIN_CERTIFICATES_REQUEST:
      return {
        ...state,
        certificates: {
          ...state.certificates,
          loading: true,
          error: null,
        },
      };
    case FETCH_LINKEDIN_CERTIFICATES_SUCCESS:
      return {
        ...state,
        certificates: {
          ...state.certificates,
          loading: false,
          data: action.payload,
          error: null,
        },
      };
    case FETCH_LINKEDIN_CERTIFICATES_FAILURE:
      return {
        ...state,
        certificates: {
          ...state.certificates,
          loading: false,
          error: action.error?.message || 'Failed to fetch LinkedIn certificates',
        },
      };
    
    // Skills actions
    case FETCH_LINKEDIN_SKILLS_REQUEST:
      return {
        ...state,
        skills: {
          ...state.skills,
          loading: true,
          error: null,
        },
      };
    case FETCH_LINKEDIN_SKILLS_SUCCESS:
      return {
        ...state,
        skills: {
          ...state.skills,
          loading: false,
          data: action.payload,
          error: null,
        },
      };
    case FETCH_LINKEDIN_SKILLS_FAILURE:
      return {
        ...state,
        skills: {
          ...state.skills,
          loading: false,
          error: action.error?.message || 'Failed to fetch LinkedIn skills',
        },
      };
    
    // Categorized skills actions
    case 'FETCH_LINKEDIN_CATEGORIZED_SKILLS_REQUEST':
      return {
        ...state,
        categorizedSkills: {
          ...state.categorizedSkills,
          loading: true,
          error: null,
        },
      };
    case 'FETCH_LINKEDIN_CATEGORIZED_SKILLS_SUCCESS':
      return {
        ...state,
        categorizedSkills: {
          ...state.categorizedSkills,
          loading: false,
          data: action.payload,
          error: null,
        },
      };
    case 'FETCH_LINKEDIN_CATEGORIZED_SKILLS_FAILURE':
      return {
        ...state,
        categorizedSkills: {
          ...state.categorizedSkills,
          loading: false,
          error: action.error?.message || 'Failed to fetch categorized LinkedIn skills',
        },
      };
    
    default:
      return state;
  }
};

// Hook for LinkedIn data
export const useLinkedInData = (fetchOnMount: boolean = true) => {
  const [state, dispatch] = useReducer(linkedinReducer, initialState);

  // Fetch LinkedIn experience
  const fetchExperience = async () => {
    try {
      await linkedinService.getExperience({ dispatch });
    } catch (error) {
      console.error('Error fetching LinkedIn experience:', error);
    }
  };

  // Fetch LinkedIn education
  const fetchEducation = async () => {
    try {
      await linkedinService.getEducation({ dispatch });
    } catch (error) {
      console.error('Error fetching LinkedIn education:', error);
    }
  };

  // Fetch LinkedIn certificates
  const fetchCertificates = async () => {
    try {
      await linkedinService.getCertificates({ dispatch });
    } catch (error) {
      console.error('Error fetching LinkedIn certificates:', error);
    }
  };

  // Fetch LinkedIn skills
  const fetchSkills = async () => {
    try {
      await linkedinService.getSkills({ dispatch });
    } catch (error) {
      console.error('Error fetching LinkedIn skills:', error);
    }
  };

  // Fetch categorized LinkedIn skills
  const fetchCategorizedSkills = async () => {
    try {
      dispatch({ type: 'FETCH_LINKEDIN_CATEGORIZED_SKILLS_REQUEST' });
      const data = await linkedinService.getCategorizedSkills();
      dispatch({ type: 'FETCH_LINKEDIN_CATEGORIZED_SKILLS_SUCCESS', payload: data });
    } catch (error) {
      console.error('Error fetching categorized LinkedIn skills:', error);
      dispatch({ type: 'FETCH_LINKEDIN_CATEGORIZED_SKILLS_FAILURE', error });
    }
  };

  // Fetch all LinkedIn data
  const fetchAllData = async () => {
    await Promise.all([
      fetchExperience(),
      fetchEducation(),
      fetchCertificates(),
      fetchSkills(),
      fetchCategorizedSkills()
    ]);
  };

  // Fetch data on mount if requested
  useEffect(() => {
    if (fetchOnMount) {
      fetchAllData();
    }
  }, [fetchOnMount]);

  return {
    ...state,
    fetchExperience,
    fetchEducation,
    fetchCertificates,
    fetchSkills,
    fetchCategorizedSkills,
    fetchAllData,
  };
};

export default useLinkedInData;
