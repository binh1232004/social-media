/**
 * @param {String} email 
 * @returns {Boolean} email must have structure of {*(.student).hcmue.edu.vn}
 */
export const isCorrectEmail = (email) => {
    return /^.+@(student\.)?hcmue\.edu\.vn$/.test(email);
};

/**
 * @param {String} password 
 * @param {String} repassword
 * @returns {Boolean} 
 */
export const isPasswordMatchRepassword = (password, repassword) => {
    return password === repassword;
};

/**
 * @param {Object} obj 
 * @returns {Boolean} check if at least one item's value is falsy
 */
export const isFalsyValue = (obj) => {
    // Check if any value is null, undefined, or empty string
    return Object.values(obj).some((value) => 
        value === null || value === undefined || value === '');
};