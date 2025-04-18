import httpBase, { RequestOptions } from './httpBase';
import {
  LinkedInExperience,
  LinkedInEducation,
  LinkedInCertificate
} from './apiService';
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
import { createApiActions } from '@/utils/dispatchUtils';

// Create API action creators
const linkedinExperienceActions = createApiActions<LinkedInExperience>(
  FETCH_LINKEDIN_EXPERIENCE_REQUEST,
  FETCH_LINKEDIN_EXPERIENCE_SUCCESS,
  FETCH_LINKEDIN_EXPERIENCE_FAILURE
);

const linkedinEducationActions = createApiActions<LinkedInEducation[]>(
  FETCH_LINKEDIN_EDUCATION_REQUEST,
  FETCH_LINKEDIN_EDUCATION_SUCCESS,
  FETCH_LINKEDIN_EDUCATION_FAILURE
);

const linkedinCertificatesActions = createApiActions<LinkedInCertificate[]>(
  FETCH_LINKEDIN_CERTIFICATES_REQUEST,
  FETCH_LINKEDIN_CERTIFICATES_SUCCESS,
  FETCH_LINKEDIN_CERTIFICATES_FAILURE
);

const linkedinSkillsActions = createApiActions<string[]>(
  FETCH_LINKEDIN_SKILLS_REQUEST,
  FETCH_LINKEDIN_SKILLS_SUCCESS,
  FETCH_LINKEDIN_SKILLS_FAILURE
);

// LinkedIn service class
class LinkedInService {
  // Get LinkedIn experience
  async getExperience(options?: RequestOptions<LinkedInExperience>): Promise<LinkedInExperience> {
    if (options?.dispatch) {
      options.dispatch(linkedinExperienceActions.request());
      
      return httpBase.get<LinkedInExperience>('/linkedin/experience', undefined, undefined, {
        ...options,
        onSuccess: (data) => {
          options.dispatch(linkedinExperienceActions.success(data));
          options.onSuccess?.(data);
        },
        onError: (error) => {
          options.dispatch(linkedinExperienceActions.failure(error));
          options.onError?.(error);
        }
      });
    }
    
    return httpBase.get<LinkedInExperience>('/linkedin/experience', undefined, undefined, options);
  }

  // Get LinkedIn education
  async getEducation(options?: RequestOptions<LinkedInEducation[]>): Promise<LinkedInEducation[]> {
    if (options?.dispatch) {
      options.dispatch(linkedinEducationActions.request());
      
      return httpBase.get<LinkedInEducation[]>('/linkedin/education', undefined, undefined, {
        ...options,
        onSuccess: (data) => {
          options.dispatch(linkedinEducationActions.success(data));
          options.onSuccess?.(data);
        },
        onError: (error) => {
          options.dispatch(linkedinEducationActions.failure(error));
          options.onError?.(error);
        }
      });
    }
    
    return httpBase.get<LinkedInEducation[]>('/linkedin/education', undefined, undefined, options);
  }

  // Get LinkedIn certificates
  async getCertificates(options?: RequestOptions<LinkedInCertificate[]>): Promise<LinkedInCertificate[]> {
    if (options?.dispatch) {
      options.dispatch(linkedinCertificatesActions.request());
      
      return httpBase.get<LinkedInCertificate[]>('/linkedin/certificates', undefined, undefined, {
        ...options,
        onSuccess: (data) => {
          options.dispatch(linkedinCertificatesActions.success(data));
          options.onSuccess?.(data);
        },
        onError: (error) => {
          options.dispatch(linkedinCertificatesActions.failure(error));
          options.onError?.(error);
        }
      });
    }
    
    return httpBase.get<LinkedInCertificate[]>('/linkedin/certificates', undefined, undefined, options);
  }

  // Get LinkedIn skills
  async getSkills(options?: RequestOptions<string[]>): Promise<string[]> {
    if (options?.dispatch) {
      options.dispatch(linkedinSkillsActions.request());
      
      return httpBase.get<string[]>('/linkedin/skills', undefined, undefined, {
        ...options,
        onSuccess: (data) => {
          options.dispatch(linkedinSkillsActions.success(data));
          options.onSuccess?.(data);
        },
        onError: (error) => {
          options.dispatch(linkedinSkillsActions.failure(error));
          options.onError?.(error);
        }
      });
    }
    
    return httpBase.get<string[]>('/linkedin/skills', undefined, undefined, options);
  }

  // Get categorized LinkedIn skills
  async getCategorizedSkills(options?: RequestOptions<Record<string, string[]>>): Promise<Record<string, string[]>> {
    return httpBase.get<Record<string, string[]>>('/linkedin/skills/categorized', undefined, undefined, options);
  }

  // Get all LinkedIn data
  async getAllData(options?: RequestOptions<any>): Promise<any> {
    return httpBase.get<any>('/linkedin/data', undefined, undefined, options);
  }

  // Check LinkedIn status
  async checkStatus(options?: RequestOptions<any>): Promise<any> {
    return httpBase.get<any>('/linkedin/status', undefined, undefined, options);
  }

  // Refresh LinkedIn cookies
  async refreshCookies(options?: RequestOptions<any>): Promise<any> {
    return httpBase.post<any>('/linkedin/refresh-cookies', undefined, undefined, options);
  }
}

// Create and export a singleton instance
const linkedinService = new LinkedInService();
export default linkedinService;
