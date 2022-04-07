import { Box, Table, TableContainer } from "@mui/material"
import { createContext, useContext, useEffect, useRef, useState } from "react"
import FlexBox from "../display-helpers/flex-box"
import CustomTableToolbar from "./toolbar"

const TableContext = createContext()
export default function CustomTable({children, groupSize, hasToolbar=true, onLoadMore, filterDecorate, ...props}){
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
        groupSize: {value: groupSize || 50},
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
                if(onLoadMore && typeof onLoadMore === "function") onLoadMore(data, value)
                addRows()
            }
            if(e.target.scrollTop === 0) resetRows()  
        })
    })

    return (
        <TableContext.Provider value={value} >
            <FlexBox direction="column" justifyContent="start" height="100%">
                {hasToolbar && <CustomTableToolbar filterDecorate={filterDecorate}/>}
                <TableContainer ref={tableRef} >
                    <Table stickyHeader height="100%" size="small">
                        {children}
                    </Table>
                </TableContainer>
            </FlexBox>
            
        </TableContext.Provider>
    )
    
}

export const useTableContext = () => {
    return useContext(TableContext)
}


