const validateSignUp = ({ name, email, password, passwordC }) => {
    const errors = {};

    if (!name) errors.name = "name is required";
    if (!email) errors.email = "email is required";
    if (!password) errors.password = "password is required";
    if (password !== passwordC) errors.passwordC = "passwords do not match";

    return errors;
};

const validateLogin = ({ email, password }) => {
    const errors = {};

    if (!email) errors.email = "email is required";
    if (!password) errors.password = "password is required";

    return errors;
};

const validateAddProduct = ({name,description,price,category,colors,sizes,stock,brand,typeOfProduct,material,dimensionsWidth,dimensionsHeight,releaseDate}) => {
        const errors = {};

        if (!name) errors.name = "Name is required";
        if (!description) errors.description = "Description is required";
        if (!price) errors.price = "Price is required";
        // if (!mainImage) errors.mainImage = "Main image is required";
        if (!category) errors.category = "Category is required";
        if (!colors || colors.length === 0)
            errors.colors = "You should specify at least one color";
        if (!sizes || sizes.length === 0)
            errors.sizes = "You should specify at least one size";
        if (!stock) errors.stock = "Stock is required";
        if (!brand) errors.brand = "Brand is required";
        if (!material) errors.material = "Material is required";
        if (!dimensionsWidth) errors.dimensionsWidth = "field is required"; 
        if (!dimensionsHeight) errors.dimensionsHeight = "field is required";
        if (!releaseDate) errors.releaseDate = "Release date is required"; 
        if (!typeOfProduct) errors.typeOfProuct = "type is required";


        
    return errors;
}
module.exports = {
    validateSignUp,
    validateLogin,
    validateAddProduct
};
