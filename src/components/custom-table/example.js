import { Checkbox, Tooltip } from "@mui/material";
import { useMemo } from "react";
import CustomTable from ".";
import CustomTableBody from "./body";
import CustomHeader, { HeaderCell } from "./header";

export default function ExampleTable(){
    const count = 2000
    const seedMembers = useMemo(()=>{
        return createSeedMembers(count)
    }, [count])
    const filterDecoration = (e) => [e.first, e.last, e.id, e.ward].join("").replaceAll(/\s+/g, "").toLowerCase()
    return (
        <CustomTable renderCount={50} rowsMax={count} name="example" filterDecorate={filterDecoration}>
            <CustomHeader selectBox={true} deco>
                <HeaderCell id={'last'}>Last</HeaderCell>
                <HeaderCell id={'first'}>First</HeaderCell>
                <HeaderCell id={'ward'}>Ward</HeaderCell>
                <HeaderCell id={'active'} align="center">Activity</HeaderCell>
                <HeaderCell id={'sacrament'}>Sacrament</HeaderCell>
            </CustomHeader>
            <CustomTableBody data={seedMembers} cb={updateActivityAsCheck}/>
        </CustomTable>
    )
}

const createSeedMembers = (count) => {
    const rnd = () => Math.floor(Math.random() * count)
    const ward = (i) => {
        const id = Math.floor(i / 200) +1
        return `Ward - ${id}`
    }
    const rndBool = () => !!Math.floor(Math.random()*2)
    let obj = {}
    for(let i=0; i<count;i++){
        obj[i] = {
            first: `First-${rnd()}`,
            last: `Last-${rnd()}`,
            ward: ward(i), 
            active: rndBool(),
            sacrament: rndBool(),
            id: i
        }
    }
    return obj 
}

const updateColumn = (header, cb) => (obj, data) => {
    const updatedObj = {...obj.data, [header]: cb(obj.data[header], obj.data, data)}
    return ({...obj, data: updatedObj})
}

const updateRow = cb => (obj, data) => {
    return {...obj, data: cb(obj, data)}
}

const updateActivityAsCheck = updateColumn("active", (data) => {
    return {...data, align:'center', padding:'checkbox', element: <TableCheckbox checked={!!data.value} titleTrue="Active" titleFalse="Unknown / Inactive"/>
    }
})

function TableCheckbox({checked, titleTrue, titleFalse, titleIndeterminate}){
    return (
        <Tooltip title={checked === true ? titleTrue : checked === false ? titleFalse : titleIndeterminate}>
            <Checkbox size={"small"} sx={{cursor: "default"}} disableRipple checked={checked}/>
        </Tooltip>
    )
}