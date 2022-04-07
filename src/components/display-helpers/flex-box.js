import { Box } from "@mui/material"

export default function FlexBox(p){
    const props = {...p}
    if(props.direction && !props.flexDirection) props.flexDirection = props.direction
    let sx = {display:'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'stretch', alignContent: 'center'}
    Object.keys(sx).forEach(k => sx[k] = props[k] ? props[k] : sx[k])
    if(props.rowGap) sx.rowGap = props.rowGap
    if(props.colummGap) sx.rowGap = props.colummGap
    if(props.sx) sx = {...sx, ...props.sx}
    return (
        <Box {...props} sx={sx}>
            {props.children || null}
        </Box>
    )
}