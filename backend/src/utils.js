class Utils{
    /**
     * 
     * @param {String} email 
     * @returns {Boolean} email must have structure of {*(.student).hcmue.edu.vn}
     */
    isCorrectEmail (email)  {
        return /^.+@(student\.)?hcmue\.edu\.vn$/.test(email);
    } 
}
module.exports = Utils;