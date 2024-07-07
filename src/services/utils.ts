export const getFullImageUrl = (url: string | null | undefined) => {
  if (!url) {
    return process.env.REACT_APP_DEFAULT_PROFILE_IMAGE || '/image/default_profile_image.png';
  }

  if (url.startsWith('/media/')) {
    return `${process.env.REACT_APP_API_URL}${url}`;
  }
  return url;
};