import bcrypt from 'bcrypt';


const hashPassword = async (passwordInput: string) =>{
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(passwordInput, salt)
}

const validatePassword = async (passwordInput: string, passwordDb:string ) =>{
    return await bcrypt.compare(passwordInput, passwordDb)
}

export {
    hashPassword, validatePassword
}