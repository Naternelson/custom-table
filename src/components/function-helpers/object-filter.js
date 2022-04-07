export const objectFilter = (obj, decorateFn) => {
    const keys = Object.keys(obj) 
    const decorated = keys.map((key) => ({value: decorateFn(obj[key], key), id: key})) 
    return (filterBy='') => {
        if(typeof filterBy !== "string") throw "filter must be type 'string'"
        const filteredArray = decorated.filter(o => o.value.includes(filterBy.toLocaleLowerCase())) 
        return filteredArray.reduce((newObj, el) => ({...newObj, [el.id]: obj[el.id]}), {})
    }
}

// ====================
// objectFilter Function 
// A Function to speed up the process of filtering an object by segmenting out the process
// 1. Pass Object to filter in, with decorate Function
// 2. The decorate Function will be applied to each object value and should return a value that the filter function will look in
// 3. A function is then returned
// 4. The function returned can accept a filterBy string
// 5. The function iterated the decorated array of {id, value} objects
// 6. It compares the string to the value to see if it is a substring 
// 7. The return object is constructed by the filtered array with its corresponding ids
// ====================