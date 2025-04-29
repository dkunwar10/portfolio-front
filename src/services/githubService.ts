import httpBase, { RequestOptions } from './httpBase';
import { 
  GithubProfile, 
  GithubRepo, 
  GithubContribution 
} from './apiService';
import {
  FETCH_GITHUB_PROFILE_REQUEST,
  FETCH_GITHUB_PROFILE_SUCCESS,
  FETCH_GITHUB_PROFILE_FAILURE,
  FETCH_GITHUB_REPOS_REQUEST,
  FETCH_GITHUB_REPOS_SUCCESS,
  FETCH_GITHUB_REPOS_FAILURE,
  FETCH_GITHUB_CONTRIBUTIONS_REQUEST,
  FETCH_GITHUB_CONTRIBUTIONS_SUCCESS,
  FETCH_GITHUB_CONTRIBUTIONS_FAILURE
} from '@/types/actionTypes';
import { createApiActions } from '@/utils/dispatchUtils';

// Create API action creators
const githubProfileActions = createApiActions<GithubProfile>(
  FETCH_GITHUB_PROFILE_REQUEST,
  FETCH_GITHUB_PROFILE_SUCCESS,
  FETCH_GITHUB_PROFILE_FAILURE
);

const githubReposActions = createApiActions<GithubRepo[]>(
  FETCH_GITHUB_REPOS_REQUEST,
  FETCH_GITHUB_REPOS_SUCCESS,
  FETCH_GITHUB_REPOS_FAILURE
);

const githubContributionsActions = createApiActions<GithubContribution>(
  FETCH_GITHUB_CONTRIBUTIONS_REQUEST,
  FETCH_GITHUB_CONTRIBUTIONS_SUCCESS,
  FETCH_GITHUB_CONTRIBUTIONS_FAILURE
);

// GitHub service class
class GithubService {
  // Get GitHub profile
  async getProfile(options?: RequestOptions<GithubProfile>): Promise<GithubProfile> {
    if (options?.dispatch) {
      options.dispatch(githubProfileActions.request());
      
      return httpBase.get<GithubProfile>('/github/profile', undefined, undefined, {
        ...options,
        onSuccess: (data) => {
          options.dispatch(githubProfileActions.success(data));
          options.onSuccess?.(data);
        },
        onError: (error) => {
          options.dispatch(githubProfileActions.failure(error));
          options.onError?.(error);
        }
      });
    }
    
    return httpBase.get<GithubProfile>('/github/profile', undefined, undefined, options);
  }

  // Get all GitHub repositories
  async getRepos(includeDetails: boolean = true, options?: RequestOptions<GithubRepo[]>): Promise<GithubRepo[]> {
    if (options?.dispatch) {
      options.dispatch(githubReposActions.request());
      
      return httpBase.get<GithubRepo[]>('/github/repos', { include_details: includeDetails }, undefined, {
        ...options,
        onSuccess: (data) => {
          options.dispatch(githubReposActions.success(data));
          options.onSuccess?.(data);
        },
        onError: (error) => {
          options.dispatch(githubReposActions.failure(error));
          options.onError?.(error);
        }
      });
    }
    
    return httpBase.get<GithubRepo[]>('/github/repos', { include_details: includeDetails }, undefined, options);
  }

  // Get top GitHub repositories
  async getTopRepos(limit: number = 8, options?: RequestOptions<GithubRepo[]>): Promise<GithubRepo[]> {
    if (options?.dispatch) {
      options.dispatch(githubReposActions.request());
      
      return httpBase.get<GithubRepo[]>('/github/top-repos', { limit }, undefined, {
        ...options,
        onSuccess: (data) => {
          options.dispatch(githubReposActions.success(data));
          options.onSuccess?.(data);
        },
        onError: (error) => {
          options.dispatch(githubReposActions.failure(error));
          options.onError?.(error);
        }
      });
    }
    
    return httpBase.get<GithubRepo[]>('/github/top-repos', { limit }, undefined, options);
  }

  // Get all repositories sorted by Python first
  async getAllRepos(options?: RequestOptions<GithubRepo[]>): Promise<GithubRepo[]> {
    if (options?.dispatch) {
      options.dispatch(githubReposActions.request());
      
      return httpBase.get<GithubRepo[]>('/github/repos/all', undefined, undefined, {
        ...options,
        onSuccess: (data) => {
          options.dispatch(githubReposActions.success(data));
          options.onSuccess?.(data);
        },
        onError: (error) => {
          options.dispatch(githubReposActions.failure(error));
          options.onError?.(error);
        }
      });
    }
    
    return httpBase.get<GithubRepo[]>('/github/repos/all', undefined, undefined, options);
  }

  // Get repository details
  async getRepoDetails(repoName: string, options?: RequestOptions<GithubRepo>): Promise<GithubRepo> {
    return httpBase.get<GithubRepo>(`/github/repos/${repoName}`, undefined, undefined, options);
  }

  // Get repository commits
  async getRepoCommits(repoName: string, options?: RequestOptions<Record<string, Record<string, string[]>>>): Promise<Record<string, Record<string, string[]>>> {
    return httpBase.get<Record<string, Record<string, string[]>>>(`/github/repos/${repoName}/commits`, undefined, undefined, options);
  }

  // Get GitHub contributions
  async getContributions(months: number = 12, options?: RequestOptions<GithubContribution>): Promise<GithubContribution> {
    if (options?.dispatch) {
      options.dispatch(githubContributionsActions.request());
      
      return httpBase.get<GithubContribution>('/github/contributions', { months }, undefined, {
        ...options,
        onSuccess: (data) => {
          options.dispatch(githubContributionsActions.success(data));
          options.onSuccess?.(data);
        },
        onError: (error) => {
          options.dispatch(githubContributionsActions.failure(error));
          options.onError?.(error);
        }
      });
    }
    
    return httpBase.get<GithubContribution>('/github/contributions', { months }, undefined, options);
  }

  // Get recent GitHub contributions
  async getRecentContributions(months: number = 3, options?: RequestOptions<GithubContribution>): Promise<GithubContribution> {
    if (options?.dispatch) {
      options.dispatch(githubContributionsActions.request());
      
      return httpBase.get<GithubContribution>('/github/contributions/recent', { months }, undefined, {
        ...options,
        onSuccess: (data) => {
          options.dispatch(githubContributionsActions.success(data));
          options.onSuccess?.(data);
        },
        onError: (error) => {
          options.dispatch(githubContributionsActions.failure(error));
          options.onError?.(error);
        }
      });
    }
    
    return httpBase.get<GithubContribution>('/github/contributions/recent', { months }, undefined, options);
  }

  // Get processed GitHub data for portfolio display
  async getPortfolioData(months: number = 3, options?: RequestOptions<any>): Promise<any> {
    return httpBase.get<any>('/github/contributions/portfolio-data', { months }, undefined, options);
  }
}

// Create and export a singleton instance
const githubService = new GithubService();
export default githubService;
