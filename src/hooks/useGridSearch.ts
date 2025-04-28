import { ChangeEvent, useDeferredValue, useEffect, useState } from "react";
import { useGridStore } from "../components/Grid";

export function useGridSearch() {
    const search = useGridStore(state => state.search)
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