import React from 'react';
import { useProfile } from '@/store/ProfileContext';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const ProfileDebug = () => {
  const { profileData, loading, error, dispatch } = useProfile();

  const handleRefetch = async () => {
    try {
      // Import dynamically to avoid circular dependencies
      const { default: apiService } = await import('@/services/apiService');
      const { FETCH_PROFILE_REQUEST } = await import('@/types/actionTypes');
      
      // Dispatch request action
      dispatch({ type: FETCH_PROFILE_REQUEST });
      
      // Fetch profile data
      await apiService.getProfile({
        dispatch,
        showErrorToast: true
      });
    } catch (err) {
      console.error('Error refetching profile data:', err);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-8 text-left">
      <h3 className="text-white text-lg font-semibold mb-2">Profile Data Debug</h3>
      
      <div className="flex items-center gap-2 mb-4">
        <span className="text-gray-400">Status:</span>
        {loading ? (
          <span className="flex items-center text-yellow-400">
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            Loading...
          </span>
        ) : error ? (
          <span className="text-red-400">Error: {error}</span>
        ) : profileData ? (
          <span className="text-green-400">Data loaded successfully</span>
        ) : (
          <span className="text-gray-400">No data</span>
        )}
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefetch}
          className="ml-auto"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              Refetching...
            </>
          ) : (
            'Refetch Profile'
          )}
        </Button>
      </div>
      
      {profileData && (
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-gray-400">Endpoint:</span>
            <span className="text-blue-400 ml-2">/profile/</span>
          </div>
          <div>
            <span className="text-gray-400">Name:</span>
            <span className="text-white ml-2">{profileData.profile.name}</span>
          </div>
          <div>
            <span className="text-gray-400">Headline:</span>
            <span className="text-white ml-2">{profileData.profile.headline}</span>
          </div>
          <div>
            <span className="text-gray-400">Social Links:</span>
            <div className="ml-2 mt-1">
              {profileData.profile.Urls.map((url, index) => (
                <div key={index} className="flex items-center text-xs">
                  <span className="text-gray-500">{url.name}:</span>
                  <a 
                    href={url.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 ml-1 truncate"
                  >
                    {url.url}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDebug;
