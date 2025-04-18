
export interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

export interface ActivityBreakdown {
  commits: { count: number; percentage: number };
  pull_requests: { count: number; percentage: number };
  issues: { count: number; percentage: number };
  code_reviews: { count: number; percentage: number };
}

export interface Repository {
  name: string;
  url: string;
  stars: number;
  language: string | null;
}

export interface ContributionData {
  total_contributions: number;
  activity_breakdown: ActivityBreakdown;
  contribution_calendar: ContributionDay[];
  monthly_contributions?: { month: string; year: string; count: number }[];
  contributed_repositories?: Repository[];
}
