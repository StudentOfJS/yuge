import { useGridSearch } from "../hooks/useGridSearch"
import { type InputHTMLAttributes } from "react"


type GridSearchProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'name' | 'value' | 'type' | 'onChange' >

function GridSearch(props: GridSearchProps) {
    const { query, handleSearch } = useGridSearch()
    return (
        <input
            type="search"
            name="search"
            value={query}
            onChange={handleSearch}
            {...props}
        />
    )
}

export default GridSearch
