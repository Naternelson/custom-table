import { useEffect, useRef, useState } from "react"

export function useTableHooks({onLoadEnd, ...props}){
    const tableRef = useRef()
    const [data, setData] = useState({})
    const [renderCount, setRenderCount] = useState(props.groupSize || 50)
    const [rowsMax, setRowsMax] = useState(props.rowsMax || -1)
    const [headers, setHeaders] = useState([])
    const [tableName, setTableName] = useState(props.name || "")
    const [selected, setSelected] = useState({})
    const [sortColumn, setSortColumn] = useState(null)
    const [sortDirection, setSortDirection] = useState("desc")
    const [sortedKeys, setSortedKeys] = useState([])

    const value = {
        data: {value: data, setter: setData},
        renderCount: {value: renderCount, setter: setRenderCount},
        rowsMax: {value: rowsMax, setter: setRowsMax},
        headers: {value: headers, setter: setHeaders},
        name: {value: tableName, setter: setTableName},
        selected: {value: selected, setter: setSelected},
        sortColumn: {value: sortColumn, setter: setSortColumn},
        sortedKeys: {value: sortedKeys, setter: setSortedKeys},
        groupSize: {value: props.groupSize || 50},
        sortDirection: {value: sortDirection, setter: setSortDirection},
        tableRef: {value: tableRef.current}
    }
    const addRows = () => {
        const size = Object.keys(data).length
        if(renderCount < size) setRenderCount(previous => previous + (props.groupSize || 50))
    }
    const resetRows = () => {
        setRenderCount(value.groupSize.value)
    }
    useEffect(()=>{
        return tableRef.current.addEventListener("scroll", (e) => {
            const position = Math.floor(e.target.scrollHeight - e.target.scrollTop)
            const atEnd = Math.abs(position - Math.floor(e.target.offsetHeight)) <=2
            if(atEnd) {
                if(onLoadEnd && typeof onLoadEnd === "function") onLoadEnd(data, value)
                addRows()
            }
            if(e.target.scrollTop === 0) resetRows()  
        })
    })
    return {value, ref: tableRef}
}

// ====================
// useTableHooks
// High level effects for the custom table
// All values for the provider are returned as the variable 'value' 
// A ref is also returned for use in the table container
// ====================

// ====================
// Table Effects
// States: 
// >  data - the data to draw from to display. Not all data will be displayed, or rendered. This should hold all the raw data needed, with each [key, value] representing a new row
// >  renderCount - the batch size currently being rendered. If no property was passed the default is 50
// >  rowsMax - The maximum number of rows the table will be allowed to display at any given point. If -1, no limit will be placed
// >  headers - An array of header ids in the order they should be presented. This will be passed by the HeaderCell component
// >  name - name of the table
// >  selected - an object of ids that are currently selected in the table. The keys will be the ids and each key's value will always be true 
// >  sortColumn - The active header id that will be sorted by 
// >  sortedKys - The keys of the rows sorted and filtered according to the sortColumn 
// >  groupSize - The size of the batch to render when the end of the current table is reached. [50]
// >  sortDirection - "asc" / "desc" ["desc"]
// >  tableRef - the reference to the table container

// useEffect:
// The table container has a scroll event listener attached that will track whether the user has scroll to the end of what is rendered
// If at end, and if there is still more data to display, the next batch of data will be appended 
// A custom function may be passed whenever this event occurs 
// If the user scrolls to the top, the renderCount will be resized back to the groupSize
// ====================