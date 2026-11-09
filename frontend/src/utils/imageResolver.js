// Utility to safely resolve image paths across local development and production Vercel/Vite builds
export const resolveImageUrl = (url, fallbackType = 'doctor') => {
  if (!url) {
    return fallbackType === 'doctor'
      ? '/images/doctors/cardiologist.jpg'
      : '/images/departments/cardiology.jpg';
  }

  // Already a full remote URL (e.g. Unsplash or Supabase Storage)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Strip leading `/src/assets` or `src/assets` so it points to the static `/images/...` directory in public/
  let cleanPath = url;
  if (cleanPath.startsWith('/src/assets/images/')) {
    cleanPath = cleanPath.replace('/src/assets/images/', '/images/');
  } else if (cleanPath.startsWith('src/assets/images/')) {
    cleanPath = cleanPath.replace('src/assets/images/', '/images/');
  } else if (cleanPath.startsWith('/src/assets/')) {
    cleanPath = cleanPath.replace('/src/assets/', '/');
  }

  // Ensure leading slash
  if (!cleanPath.startsWith('/')) {
    cleanPath = '/' + cleanPath;
  }

  return cleanPath;
};
