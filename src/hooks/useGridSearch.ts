import { ChangeEvent, useDeferredValue, useEffect, useMemo, useState } from "react";
import { useGridStores } from "./useGridStores";

export function useGridSearch(id: string) {
    const { useGridStore } = useMemo(
        () => useGridStores(id), 
        [id]
      );
    const { search } = useGridStore();
    const [query, setQuery] = useState("");
    const searchTerm = useDeferredValue(query);
    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    }

    useEffect(() => {
        search(searchTerm);
    }, [searchTerm])

    return {
        query,
        handleSearch
    }
}