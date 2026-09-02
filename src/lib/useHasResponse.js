"use client";

import { useEffect, useState } from "react";

export function useHasResponse() {
  const [hasResponse, setHasResponse] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/responses/me")
      .then((res) => {
        if (active) {
          setHasResponse(res.ok);
          setLoaded(true);
        }
      })
      .catch(() => {
        if (active) {
          setHasResponse(false);
          setLoaded(true);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  return { hasResponse, loaded };
}
