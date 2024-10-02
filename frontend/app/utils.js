export default class Utils{
    /**
     * 
     * @param {String} email 
     * @returns {Boolean} email must have structure of {*(.student).hcmue.edu.vn}
     */
    isCorrectEmail (email)  {
        return /^.+@(student\.)?hcmue\.edu\.vn$/.test(email);
    }
    isPasswordMatchRepasword  (password, repassword)  {
        return password === repassword;
    }

    /**
     * 
     * @param {Object} obj 
     * @returns {Boolean} check if at least one item's value is falsy
     */
    isFalsyValue(obj){
        return Object.values(obj).some(( value ) => !value);
    }
}