import { Table, TableContainer } from "@mui/material"
import { createContext, useContext} from "react"
import FlexBox from "../display-helpers/flex-box"
import CustomTableToolbar from "./toolbar"
import { useTableHooks } from "./useTableHooks"

const TableContext = createContext()
export default function CustomTable({children, hasToolbar=true, filterDecorate, ...props}){
    const {value, ref} = useTableHooks(props)
    return (
        <TableContext.Provider value={value} >
            <FlexBox direction="column" justifyContent="start" height="100%">
                {hasToolbar && <CustomTableToolbar filterDecorate={filterDecorate}/>}
                <TableContainer ref={ref} >
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

// ====================
// Custom Table
// A Custom Table with a Provider Wrapper 
// Includes:
// >  CustomTableToolbar (optionial)
// >  Table Container
// >  Table
// >  Custom Table Header
// >  Custom Table Body

// The Table only renders the given group size of records at a time
// Records rendered but not visible are given a temp display to save processing
// When the end of the display is scrolled to, the next batch of records are displayed in an infinite table format
// ====================
