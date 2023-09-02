// gets domain name from window



import { useEffect, useState } from "react";



export const useOrigin = () => {


  const [mounted, setMounted] = useState(false);
  const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';
  

  // forces data to be in sync
  useEffect(() => {
    setMounted(true);
  }, [])
  if (!mounted) {
    return null;
  }


  return origin;
  
}
