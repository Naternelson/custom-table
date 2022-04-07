import { Checkbox, TableBody, TableCell, TableRow, Typography } from "@mui/material";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import { useTableContext } from ".";
import FlexBox from "../display-helpers/flex-box"
import { useInView } from 'react-intersection-observer';

export default function CustomTableBody({data={}, cb}){
    const tableContext = useTableContext()
    const tbodyRef = useRef(null)
    const {data:tData, renderCount, rowsMax, headers, selected, sortColumn, sortedKeys} = tableContext
    const jData = JSON.stringify(tData.value) 

    const hasMore = renderCount.value < sortedKeys.value.length

    useEffect(()=>{
        tableContext.data.setter(data)
        tableContext.sortedKeys.setter(Object.keys(data))
    },[])

    const displayData = useMemo(()=>{
        let keys = sortedKeys.value.slice(0, renderCount.value < rowsMax.value ? renderCount.value : rowsMax.value)
        let data = tData.value 
        let dData = keys.map(key => {
            let obj = {key, id:key, hover: true, selected: selected.value[key], data: {}}
            headers.value.forEach(h => obj.data[h] = ({
                align: 'left',
                value: data[key][h] === undefined ? null : data[key][h],
                element: null, 
                padding: 'normal'
                
            }))
            
            if(cb && typeof cb === "function") obj = cb(obj, data)
            return obj 
        })
        return dData 
    }, [sortedKeys.value, renderCount.value, rowsMax.value, jData, headers.value, selected.value, sortColumn.value])

    return (
        <TableBody sx={{height: "100%", overflow:'auto'}} ref={tbodyRef}>
            {displayData.map(obj => <CustomTableRow {...obj}/>)}
            {hasMore && <LoadingMoreRow/>}
        </TableBody>
    )
}

export function CustomTableRow(props){
    const {ref, inView} = useInView({initialInView:true})
    const context = useTableContext()
    const rowProps = {
        hover: !!props.hover,
        selected: !!props.selected,
        id: `row-${props.id}` 
    }
    const cellProps = (header) => ({...props.data[header], key: `${header}-${rowProps.id}`, rowId: props.id, header})

    return (
        <TableRow {...rowProps}>
            { inView && context.headers.value.map(h => (<CustomTableCell {...cellProps(h)}/>))} 
            {!inView && <TableCell padding="normal" colSpan= '100%' align="center" >{`Retrieving...`}</TableCell>}
        </TableRow>
    )
}



export const CustomTableCell = React.memo((props) =>{
    let {align, padding, element, type, value, header, rowId} = props
    
    if(header === "select-all") {
        
        element = <SelectBox id={rowId}/>
        align="center"
        padding="checkbox"
    }
    
    return (
        <TableCell {...{align, padding}}>
            {!!element && element}
            {!element && String(value)}
        </TableCell>
    )
})


export function SelectBox({id}){
    const context = useTableContext()
    const isSelected = context.selected.value[id] || false
    const onChange = () => {
        context.selected.setter(previous => {
            if(!isSelected) return ({...previous, [id]: true})
            delete previous[id]
            return {...previous}
        })
    }
    console.log(id, context.selected.value, isSelected)
    return (
        <Checkbox 
            checked={isSelected}
            onChange={onChange}
            size="small"
        />
    )
}

export function LoadingMoreRow(){
    return (
        <TableRow>
            <TableCell colSpan="100%">
                <FlexBox justifyContent="center" sx={{bgcolor: 'grey.200'}} gap={3}>
                    <Typography sx={{color: 'grey.600'}} variant="overline">
                        Loading...
                    </Typography>
                    <CircularProgress size="1.2rem" sx={{color: 'grey.600'}}/>
                </FlexBox >
            </TableCell>
        </TableRow>
    )
}