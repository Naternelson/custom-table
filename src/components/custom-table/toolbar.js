import { Divider, IconButton, Paper, TextField, Toolbar, Tooltip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { debounce } from "lodash";
import React, { useState } from "react";
import { useTableContext } from ".";
import FlexBox from "../display-helpers/flex-box";
import { objectFilter } from "../function-helpers/object-filter";
import { sortData } from "./header";
import { FilterList } from '@mui/icons-material'

const filter = debounce((filterBy="", context, filterDecorate)=>{ 
    const filterer = objectFilter(context.data.value, filterDecorate)
    const filteredData = filterer(filterBy)
    const sortedKeys = sortData(filteredData, context.sortColumn.value, context.sortDirection.value, Object.keys(filteredData))
    context.sortedKeys.setter(sortedKeys)
    context.renderCount.setter(context.groupSize.value)
    context.tableRef.value.scrollTop = 0
},350)

export default function CustomTableToolbar({filterDecorate}){
    const context = useTableContext()
    const {sortedKeys, selected} = context
    const numSelected = Object.keys(selected.value).length
    const numAvailable = sortedKeys.value.length
    const [value, setValue ] = useState("")
    const onChange = (e) => {
        setValue(e.target.value)
        filter(e.target.value, context, filterDecorate)
    }

    return (
        <Paper sx={{py:1, px:3}}>
            <FlexBox alignItems="center" gap={2}>
                <Box variant="dense" sx={{flex:1}}>
                    <TextField value={value} onChange={onChange} fullWidth placeholder="search..." margin="dense" size="small"/>
                </Box>
                <Paper sx={{px:2, minWidth: "10%"}}>
                    <FlexBox direction="row" gap={2} justifyContent="center" height="100%" alignItems={"center"}>
                        <TableStat num={numSelected} title={"Selected"} condition={numSelected > 0}/>
                        <TableStat num={numAvailable} title={"Total"}/>
                        
                        {/* {numSelected > 0 && <Typography>{`${numSelected.toLocaleString()} Selected`}</Typography>} */}
                    </FlexBox>
                    
                    
                </Paper>
            </FlexBox>
        </Paper>
        
    )
}

const TableStat = React.memo(({num, title, condition=true}) => {
    if(!condition) return null 
    return (
        <FlexBox direction="column" justifyContent="center" alignItems="center" width="100%" minWidth={"50px"}>
            <Typography variant="body2">
                {Number(num).toLocaleString() || "-"}
            </Typography>
            <Divider width="100%"/>
            <Typography variant="overline">
                {title}
            </Typography>
        </FlexBox>
    )
})