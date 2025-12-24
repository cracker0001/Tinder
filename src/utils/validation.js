import validator from 'validator';

export const validateSignUpData = (req)=>{
    const {firstName, lastName, email, password} = req.body;

    if(!firstName || !lastName){
        throw new Error("invalid user credentials")
    }
    else if( ! validator.isEmail(email)){
        throw new Error("invalid email")
    }
    else if(! validator.isStrongPassword(password)){
        throw new Error("invalid password")
    }
}

export const validateEditProfileData = (req) =>{
    const allowedEditFields = [
        "firstName",
        "lastName",
    ];
    const isEditAllowed = Object.keys(req.body).every((field)=> allowedEditFields.includes(field));
   
    return isEditAllowed;
}

