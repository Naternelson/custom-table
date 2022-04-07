import { useEffect, useMemo } from "react";
import { useTableContext } from ".";
import { useInView } from 'react-intersection-observer';

export function useTableBodyHooks({data={}, updateRow=((obj) => obj), updateColumn={}}){    
    const tableContext = useTableContext()
    const {data:tData, renderCount, rowsMax, headers, selected, sortColumn, sortedKeys} = tableContext

    const valuesOf = (...arr) => arr.map(el => el.value)
    const jData = JSON.stringify(tData.value) 

    const displayData = useMemo(()=>{
        const keys = sortedKeys.value.slice(0, renderCount.value < rowsMax.value ? renderCount.value : rowsMax.value)
        const data = tData.value 
        const dData = keys.map(key => {
            let row = {key, id:key, hover: true, selected: selected.value[key], data: {}}
            row = headers.value.reduce((obj, h) => {
                const colParams = {
                    align: 'left',
                    value: data[key][h] === undefined ? null : data[key][h],
                    element: null, 
                    padding: 'normal'
                }
                obj.data[h] = colParams 
                if(updateColumn[h]) obj.data[h] = updateColumn(obj.data[h], obj)
                return obj 
            },row)
            
            row = updateRow(row, data)
            return row 
        })
        return dData 
    }, [...valuesOf(sortedKeys, renderCount, rowsMax, jData, headers, selected, sortColumn)])
    
    const hasMore = renderCount.value < sortedKeys.value.length

    useEffect(()=>{
        tableContext.data.setter(data)
        tableContext.sortedKeys.setter(Object.keys(data))
    },[])

    return {hasMore, displayData}
}

// ====================
// useTableBodyHooks
// The job of this hook is to provide an array of formatted objects for display && if the rowsRendered represent all rows avaialble

// The display data is memoized to increase performace

// A Custom update function can be passed to update the row data, including padding, elements, id, etc for the row and its column data

// useEffect
// On initialization this hook should set the table context data to the data provided 

// ====================

export function useTableRowHooks(props){
    const {ref, inView, entry} = useInView({initialInView:true})
    const context = useTableContext()
    const rowProps = {
        hover: !!props.hover,
        selected: !!props.selected,
        id: `row-${props.id}`,
        ref 
    }
    console.log({entry})
    const cellProps = (header) => ({...props.data[header], key: `${header}-${rowProps.id}`, rowId: props.id, header})
    return {headers: context.headers.value, cellProps, rowProps, inView}
}

// ====================
// useTableRowHooks
// Hooks for each row of data in the table

// The row is monitored to be in view or out of view, relative to the viewport 
//
// ====================