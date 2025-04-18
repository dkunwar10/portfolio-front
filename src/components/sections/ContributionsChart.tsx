
import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useGithubContributions } from '@/hooks/useGithubContributions';
import { getWeeksArray, getLevelColor, formatDate } from '@/utils/contributionUtils';
import ContributionHeader from '@/components/github/ContributionHeader';
import ActivityBreakdown from '@/components/github/ActivityBreakdown';

export const ContributionsChart = () => {
  const { contributionData, loading, error } = useGithubContributions();
  
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
      <ContributionHeader data={contributionData} />

      {/* Contribution graph */}
      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          <div className="flex mb-2">
            <div className="w-8"></div>
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

      <ActivityBreakdown data={contributionData.activity_breakdown} />

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
