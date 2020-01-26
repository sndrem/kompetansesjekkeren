import { useState, useEffect } from "react";

function useFetch<T>(url: string, options?: RequestInit) {
    const [response, setResponse] = useState<T | null>(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        setResponse(null);
        setError(null);
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(url, options);
                if (!res.ok) {
                    throw new Error("Klarte ikke hente data");
                }
                const json = await res.json();
                setResponse(json);
                setIsLoading(false)
            } catch (error) {
                setError(error);
            }
        };
        fetchData();
    }, [url]);
    return { response, error, isLoading };
};

export { useFetch }