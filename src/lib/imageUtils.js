export const getSafeProfileImage = (url, name) => {
  if (!url || url.includes('googleusercontent.com') || url.includes('lh3.google')) {
    return `https://api.dicebear.com/7.x/initials/svg?seed=${name || 'D'}&backgroundColor=ff9933&textColor=ffffff`;
  }
  return url;
};
