import {useEffect, useState} from 'react'

export function useInView({ skip } = {}) {
  const [ref, setRef] = useState(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
      if (skip || !ref) {
        return;
      }

      const observer = new IntersectionObserver((entries) => entries.forEach((entry) => setInView(entry.isIntersecting)));
      observer.observe(ref);

      return () => observer.disconnect()
    },
    [ref, skip]
  );

  return {
    ref: setRef,
    inView,
  };
}
