export const getFullImageUrl = (url?: string) => {
    if (!url) return '';
    if (url.startsWith('/media/')) {
      return `http://localhost:8000${url}`;
    }
    return url;
  };
  