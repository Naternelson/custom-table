export function useTableBodyHooks({data={}, updateRow}){    
    const tableContext = useTableContext()
    const {data:tData, renderCount, rowsMax, headers, selected, sortColumn, sortedKeys} = tableContext

    const valuesOf = (...arr) => arr.map(el => el.value)
    const jData = JSON.stringify(tData.value) 

    const displayData = useMemo(()=>{
        const keys = sortedKeys.value.slice(0, renderCount.value < rowsMax.value ? renderCount.value : rowsMax.value)
        const data = tData.value 
        const dData = keys.map(key => {
            let obj = {key, id:key, hover: true, selected: selected.value[key], data: {}}
            headers.value.forEach(h => obj.data[h] = ({
                align: 'left',
                value: data[key][h] === undefined ? null : data[key][h],
                element: null, 
                padding: 'normal'
                
            }))
            
            if(updateRow && typeof updateRow === "function") obj = updateRow(obj, data)
            return obj 
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