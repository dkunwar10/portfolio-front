import { getFingerprint } from '@thumbmarkjs/thumbmarkjs';

/**
 * Fetches the user's IP address from an external service
 * @returns Promise that resolves to an object with the IP address
 */
const fetchIpAddress = (): Promise<{ ip_address: string }> => {
  return new Promise((resolve, reject) => {
    fetch('https://api.ipify.org?format=json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => resolve({ ip_address: data.ip }))
      .catch(error => {
        console.error('There was a problem fetching the IP address:', error);
        resolve({ ip_address: 'unknown' }); // Resolve with unknown rather than rejecting
      });
  });
};

// Add the IP address component to ThumbmarkJS
try {
  // @ts-ignore - ThumbmarkJS global API
  if (typeof ThumbmarkJS !== 'undefined' && ThumbmarkJS.includeComponent) {
    // @ts-ignore - ThumbmarkJS global API
    ThumbmarkJS.includeComponent('ip', fetchIpAddress);
  }
} catch (error) {
  console.error('Error including IP component:', error);
}

/**
 * Gets a unique device identifier using ThumbmarkJS
 * ThumbmarkJS is a lightweight, privacy-focused fingerprinting library
 * @returns Promise that resolves to a unique device identifier
 */
export const getDeviceThumbmark = async (): Promise<string> => {
  try {
    // Get the fingerprint with default options
    const fingerprint = await getFingerprint();
    return fingerprint;
  } catch (error) {
    console.error('Error generating thumbmark:', error);
    throw error;
  }
};

/**
 * Gets a unique device identifier using ThumbmarkJS with additional options
 * @returns Promise that resolves to a unique device identifier
 */
export const getDetailedDeviceThumbmark = async (): Promise<string> => {
  try {
    // Try to use the global ThumbmarkJS object if the import fails
    if (typeof getFingerprint !== 'function') {
      // @ts-ignore - ThumbmarkJS global API
      if (typeof ThumbmarkJS !== 'undefined' && typeof ThumbmarkJS.getFingerprint === 'function') {
        // @ts-ignore - ThumbmarkJS global API
        return await ThumbmarkJS.getFingerprint();
      }
      throw new Error('ThumbmarkJS not available');
    }

    // Get the fingerprint with default options
    const fingerprint = await getFingerprint();
    return fingerprint;
  } catch (error) {
    console.error('Error generating detailed thumbmark:', error);
    throw error;
  }
};
