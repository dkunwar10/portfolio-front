
import { useState, useEffect } from 'react';
import { ContributionData } from '@/types/github';

export const useGithubContributions = () => {
  const [contributionData, setContributionData] = useState<ContributionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        setLoading(true);
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

  return { contributionData, loading, error };
};
