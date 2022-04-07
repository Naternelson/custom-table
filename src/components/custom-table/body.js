import { Checkbox, TableBody, TableCell, TableRow, Typography } from "@mui/material";
import React from "react";
import CircularProgress from '@mui/material/CircularProgress';
import { useTableContext } from ".";
import FlexBox from "../display-helpers/flex-box"
import { useTableBodyHooks, useTableRowHooks } from "./useBodyHooks";

export default function CustomTableBody({data, updateRow}){
    const {displayData, hasMore} = useTableBodyHooks({data, updateRow})

    return (
        <TableBody sx={{height: "100%", overflow:'auto'}}>
            {displayData.map(obj => <CustomTableRow {...obj}/>)}
            {hasMore && <LoadingMoreRow/>}
        </TableBody>
    )
}

export function CustomTableRow(props){
    const {inView, cellProps, headers, rowProps} = useTableRowHooks(props)

    return (
        <TableRow {...rowProps}>
            { inView && headers.map(h => (<CustomTableCell {...cellProps(h)}/>))} 
            {!inView && <TableCell padding="normal" colSpan= '100%' align="center" >{`Retrieving...`}</TableCell>}
        </TableRow>
    )
}



export const CustomTableCell = React.memo((props) =>{
    let {align, padding, element, value, header, rowId} = props
    
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