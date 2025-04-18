
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ProfileData, profileService } from '../services/api';

interface ProfileContextType {
  profileData: ProfileData | null;
  loading: boolean;
  error: string | null;
}

const ProfileContext = createContext<ProfileContextType>({
  profileData: null,
  loading: false,
  error: null,
});

export const useProfile = () => useContext(ProfileContext);

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const data = await profileService.getProfile();
        setProfileData(data);
      } catch (err) {
        setError('Failed to fetch profile data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  return (
    <ProfileContext.Provider value={{ profileData, loading, error }}>
      {children}
    </ProfileContext.Provider>
  );
};
