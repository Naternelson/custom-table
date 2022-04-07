import { useEffect } from "react"
import { useTableContext } from "."
import React from "react"

export function useSelectAllHook(props){
    const context = useTableContext()
    const {selected, name, headers, sortedKeys} = context 
    const numberOfRows = sortedKeys.value.length 
    const selectedKeys = Object.keys(selected.value)
    const hasSelected = selectedKeys.length > 0
    const checked = hasSelected && numberOfRows === selectedKeys.length
    const indeterminate = hasSelected && !checked
    const ariaLabel = `select all for ${name.value || "table"}`
    const color = props.color || "primary"

    const allSelectedObj = () => sortedKeys.value.reduce((obj, key) => ({...obj, [key]:true}),{}) 
    const onChange = () => {
        if(checked || indeterminate) selected.setter({})
        else selected.setter(allSelectedObj())
        
    }  
    const checkboxProps = {color, checked, onChange, indeterminate, inputProps: {'aria-label': ariaLabel}}
    
    useEffect(()=>{
        const id = "select-all"
        headers.setter(previous => [...previous, id])
        return () => headers.setter(previous => {
            const index = previous.indexOf(id)
            previous.splice(index, 1)
            return [...previous]
        })
    }, [])
    return checkboxProps
}