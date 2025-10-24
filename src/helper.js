export const CheckHeading = (str) => {
    return /^(\*)(\*)(.*)\*$/.test(str)
}


export const ReplaceHeading = (str) => {
    return str.replace(/^(\*)(\*)|(\*)$/g,'')
}