/*
getWindowDimensions() comes from the stack overflow found below. Thank you!
https://stackoverflow.com/questions/36862334/get-viewport-window-height-in-reactjs
*/


import React from 'react';

export function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = React.useState({
    fullWidth: 100,
    fullHeight: 100
  });

  React.useEffect(() => {
    function getWindowDimensions() {
      const { innerWidth: fullWidth, innerHeight: fullHeight } = window;
      return {
        fullWidth,
        fullHeight
      };
    }

    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    handleResize()
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}