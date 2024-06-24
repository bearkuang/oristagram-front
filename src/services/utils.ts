export const getFullImageUrl = (url: string) => {
  if (!url) {
    return '/profile_picture/default/profile_picture.png';
  }

  if (url.startsWith('/media/')) {
    return `http://localhost:8000${url}`;
  }
  return url;
};
