import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, GitCommit, GitPullRequest, AlertCircle, CheckCircle2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Define types for our contribution data
interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface ActivityBreakdown {
  commits: { count: number; percentage: number };
  pull_requests: { count: number; percentage: number };
  issues: { count: number; percentage: number };
  code_reviews: { count: number; percentage: number };
}

interface Repository {
  name: string;
  url: string;
  stars: number;
  language: string | null;
}

interface ContributionData {
  total_contributions: number;
  activity_breakdown: ActivityBreakdown;
  contribution_calendar: ContributionDay[];
  monthly_contributions?: { month: string; year: string; count: number }[];
  contributed_repositories?: Repository[];
}

export const ContributionsChart = () => {
  const [contributionData, setContributionData] = useState<ContributionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        setLoading(true);
        // Fetch from the API endpoint using our utility
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/github/contributions');
        if (!response.ok) {
          throw new Error(`Failed to fetch contributions: ${response.status}`);
        }
        const data = await response.json();

        setContributionData(data);
      } catch (err) {
        setError("Failed to load contribution data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, []);

  // Group contributions by week for display
  const getWeeksArray = (contributions: ContributionDay[]) => {
    const weeks: ContributionDay[][] = [];
    let currentWeek: ContributionDay[] = [];

    // Get the day of week for the first date (0 = Sunday, 6 = Saturday)
    const firstDate = new Date(contributions[0].date);
    const firstDayOfWeek = firstDate.getDay();

    // Add empty cells for the first week
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push({
        date: "",
        count: 0,
        level: -1 // Use -1 to indicate an empty cell
      });
    }

    // Add all contributions
    contributions.forEach((day) => {
      currentWeek.push(day);

      // Check if we've completed a week
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    // Add the last partial week if it exists
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return weeks;
  };

  // Get color based on contribution level
  const getLevelColor = (level: number, isDarkMode: boolean) => {
    if (level === -1) return "bg-transparent"; // Empty cell

    if (isDarkMode) {
      switch (level) {
        case 0: return "bg-gray-800 border border-gray-700";
        case 1: return "bg-green-900 border border-green-800";
        case 2: return "bg-green-700 border border-green-600";
        case 3: return "bg-green-600 border border-green-500";
        case 4: return "bg-green-500 border border-green-400";
        default: return "bg-gray-800 border border-gray-700";
      }
    } else {
      switch (level) {
        case 0: return "bg-gray-100 border border-gray-200";
        case 1: return "bg-green-100 border border-green-200";
        case 2: return "bg-green-300 border border-green-400";
        case 3: return "bg-green-500 border border-green-600";
        case 4: return "bg-green-700 border border-green-800";
        default: return "bg-gray-100 border border-gray-200";
      }
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-md animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="h-64 bg-gray-100 dark:bg-gray-900 rounded-lg"></div>
      </div>
    );
  }

  if (error || !contributionData) {
    return (
      <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-md">
        <div className="flex items-center text-red-500 mb-4">
          <AlertCircle className="mr-2" size={20} />
          <h3 className="text-lg font-medium">Error loading contribution data</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          {error || "Failed to load contribution data. Please try again later."}
        </p>
      </div>
    );
  }

  const weeks = getWeeksArray(contributionData.contribution_calendar);
  const isDarkMode = document.documentElement.classList.contains('dark');

  return (
    <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 transition-colors duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1">
            GitHub Contributions
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {contributionData.total_contributions} contributions in the last 90 days
          </p>
        </div>

        <div className="flex items-center mt-4 md:mt-0 space-x-4">
          <div className="flex items-center">
            <GitCommit size={16} className="text-green-600 dark:text-green-400 mr-1" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {contributionData.activity_breakdown.commits.count} commits
            </span>
          </div>
          <div className="flex items-center">
            <GitPullRequest size={16} className="text-purple-600 dark:text-purple-400 mr-1" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {contributionData.activity_breakdown.pull_requests.count} PRs
            </span>
          </div>
        </div>
      </div>

      {/* Contribution graph */}
      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          <div className="flex mb-2">
            <div className="w-8"></div> {/* Empty space for alignment */}
            <div className="flex justify-between w-full text-xs text-gray-500 dark:text-gray-400">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>
          </div>

          <div className="flex">
            <div className="flex flex-col justify-between pr-2 text-xs text-gray-500 dark:text-gray-400">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
            </div>

            <div className="grid grid-flow-col gap-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-rows-7 gap-1">
                  {week.map((day, dayIndex) => (
                    <TooltipProvider key={dayIndex}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.div
                            className={`w-3 h-3 rounded-sm ${getLevelColor(day.level, isDarkMode)}`}
                            whileHover={{ scale: 1.2 }}
                          />
                        </TooltipTrigger>
                        {day.date && (
                          <TooltipContent side="top" className="text-xs">
                            <div className="font-medium">{day.count} contributions</div>
                            <div className="text-gray-500">{formatDate(day.date)}</div>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex justify-end items-center mt-4 text-xs text-gray-600 dark:text-gray-400">
            <span className="mr-2">Less</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`w-3 h-3 rounded-sm mx-0.5 ${getLevelColor(level, isDarkMode)}`}
              />
            ))}
            <span className="ml-2">More</span>
          </div>
        </div>
      </div>

      {/* Activity breakdown */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          Activity Breakdown
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(contributionData.activity_breakdown).map(([key, value]) => (
            <div key={key} className="flex items-center">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                <motion.div
                  className={`h-2.5 rounded-full ${
                    key === 'commits' ? 'bg-green-600 dark:bg-green-500' :
                    key === 'pull_requests' ? 'bg-purple-600 dark:bg-purple-500' :
                    key === 'issues' ? 'bg-yellow-600 dark:bg-yellow-500' :
                    'bg-blue-600 dark:bg-blue-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${value.percentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <div className="flex justify-between items-center min-w-[120px]">
                <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                  {key.replace('_', ' ')}
                </span>
                <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
                  {value.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contributed repositories */}
      {contributionData.contributed_repositories && contributionData.contributed_repositories.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Contributed Repositories
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contributionData.contributed_repositories.slice(0, 6).map((repo, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                whileHover={{ y: -3, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h5 className="font-medium text-gray-800 dark:text-gray-200">{repo.name}</h5>
                    {repo.language && (
                      <div className="flex items-center mt-1">
                        <span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span>
                        <span className="text-xs text-gray-600 dark:text-gray-400">{repo.language}</span>
                      </div>
                    )}
                  </div>
                  {repo.stars > 0 && (
                    <div className="flex items-center">
                      <Star size={14} className="text-yellow-500 mr-1" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">{repo.stars}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {contributionData.contributed_repositories.length > 6 && (
            <div className="text-center mt-4">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                asChild
              >
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  View all {contributionData.contributed_repositories.length} repositories
                </a>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
