import { Checkbox, TableCell, TableHead, TableRow, TableSortLabel } from "@mui/material"
import {  useCallback, useEffect } from "react"
import { useTableContext } from "."
import React from "react"
import { useSelectAllHook } from "./useHeaderHooks"

export default function CustomHeader({children, selectBox, selectColor="primary"}){

    return (
        <TableHead>
            <TableRow>
                {selectBox && <SelectBox color={selectColor}/>}
                {children}
            </TableRow>
        </TableHead>
    )
}

export const SelectBox = (props) => {
    const checkboxProps = useSelectAllHook(props)

    return (
        <TableCell padding="checkbox" align="center">
            <Checkbox {...checkboxProps}/>
        </TableCell>
    )
}

export function HeaderCell({sortable=true, children, id, align="left", padding="normal"}){
    const tableContext = useTableContext()
    
    const {sortColumn, sortedKeys, data, headers, sortDirection} = tableContext
    const direction = sortDirection.value 
    const active = id === sortColumn.value 

    const sortTableData = useCallback(()=>{
        return sortData(data.value, id, direction, sortedKeys.value)
    },[{...data.value}, id, direction])

    const onSortClick = async () => {
        sortColumn.setter(id)
        sortedKeys.setter(sortTableData())
        if(sortColumn.value === id) sortDirection.setter(previous => previous === "asc" ? "desc" : "asc")
        else sortDirection.setter("asc")
    }

    useEffect(()=>{
        headers.setter(previous => [...previous, id])
        return () => headers.setter(previous => {
            const index = previous.indexOf(id)
            previous.splice(index, 1)
            return [...previous]
        })
    }, [])


    const headerProps = {id, direction, padding, sortable, children, align, active, onClick: onSortClick}
    return <PureHeader {...headerProps}/>

}

const PureHeader = React.memo(({active, direction, onClick, id, align, padding, sortable, children}) => {
    const SortLabel = () =>  {
        const labelProps = {active, direction, onClick, hideSortIcon:true}
        return <TableSortLabel {...labelProps}>
            {children}
        </TableSortLabel>
    }
    return (
        <TableCell
            key={id}
            align={align}
            padding={padding}
            sortDirection={direction}
        >
            {sortable && <SortLabel/>} 
            {!sortable && {children}}    
        </TableCell>
    )
})

export const sortData = (data, id, direction, sortedKeys) => {
    const decorated = sortedKeys.map(key => ({key, [id]: data[key][id]}))
    const sorted = decorated.sort((a, b) => {
        const s = +(a[id] > b[id]) || +(a[id] === b[id]) - 1;
        if(direction === "asc") return s 
        return s * -1
    })
    const undecorated = sorted.map(obj => obj.key)
    return undecorated
}