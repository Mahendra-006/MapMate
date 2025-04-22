import { useCallback, useState, useEffect, useRef } from "react";

export default function useHttpHook() {
  const [isLoading, setIsLoading] = useState(false); // start with false
  const [error, setError] = useState(null);

  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal,
        });

        const responseData = await response.json();

        // Remove this request's controller after completion
        activeHttpRequests.current = activeHttpRequests.current.filter(
          (ctrl) => ctrl !== httpAbortCtrl
        );

        if (!response.ok) {
          throw new Error(responseData.message || "Something went wrong!");
        }

        setIsLoading(false);
        return responseData;
      } catch (error) {
        if (error.name === "AbortError") {
          // Request was aborted, don't treat as an actual error
          return;
        }
        setError(error.message);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    return () => {
      // Cleanup all active requests on unmount
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
}
