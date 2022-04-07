import { Box } from "@mui/material"

export default function FlexBox(p){
    const props = {...p}
    if(props.direction && !props.flexDirection) props.flexDirection = props.direction
    if(props.justify && !props.justifyContent) props.justifyContent = props.justify
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

// ====================
// FlexBox
// A Styled Box Component that is of display 'flex' by default
// Flex attributes can be applied directly to the props of FlexBox or in the sx prop
// Alias for flexDirection - direction && justifyContent - justify 
// ====================