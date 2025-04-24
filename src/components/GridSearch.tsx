import { useGridSearch } from "../hooks/useGridSearch"

import { type InputHTMLAttributes } from "react"

interface GridSearchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'id' | 'type' | 'onChange' > {
    id: string;
}

function GridSearch({id, ...inputProps}: GridSearchProps) {
    const { query, handleSearch } = useGridSearch(id)
    return (
        <input
            type="text"
            value={query}
            onChange={handleSearch}
            id={id+"-search"}
            {...inputProps}
        />
    )
}

export default GridSearch
