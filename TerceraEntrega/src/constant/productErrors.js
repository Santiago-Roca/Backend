//INCOMPLETE VALUES
export const productErrorIncompleteValues = () => {
    return 'You must complete all required fields'
}

//REPITED CODE
export const productErrorRepitedCode = (product) => {
    return `Your code must be unique, there is already a product with the code ${product.code}`
}
