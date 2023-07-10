import { useMediaQuery } from 'react-responsive';

const useMedia = () => {
  const isMobile = useMediaQuery({
    query: '(max-width:767px)',
  });

  const isDesktop = useMediaQuery({
    query: '(min-width:768px)',
  });

  return { isMobile, isDesktop };
};

export default useMedia;
