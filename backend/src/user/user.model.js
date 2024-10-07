const TABLENAME  = 'user';
const createConnection = require('./user.db');
const userSchema = require('./user.schema');
const addFormats = require('ajv-formats');
const Ajv = require('ajv');
const ajv = new Ajv();
addFormats(ajv);
/**
 * @description if not fill in, it will get all user
 * @param {(null|string)} username 
 * @returns {Promise<(null|user[])>} 
 */
exports.getUserByEmail = async (email = null) => {
    try {
        const connection = await createConnection();
        let params = [];
        let querry;
        if(email){
            querry = `SELECT * FROM ${TABLENAME} WHERE email = ?`;
            params = [email];
        }
        else{
            querry = `SELECT * FROM ${TABLENAME}`;
        }
        const [results, fields] = await connection.query(querry, params);
        connection.end();
        return results;
    } catch (e) {
        console.error(e);
        return null;
    }
};

/**
 * 
 * @param {user} user {email, password, surname, givenName, birthday, gender}
 * @returns {Promise<boolean>} 
 */
exports.createUser = async (user) => {

    const userSchemaValidation = ajv.validate(userSchema, user);
    if(!userSchemaValidation){
        console.error('createUser: Wrong input data');
        return false;
    }
    try {
        const connection = await createConnection();
        const ROLE = "member";
        const QUERRY = `INSERT INTO ${TABLENAME} (email, password, surname, given_name, birthday, gender, role)
                        VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const params = [user.email, user.password, user.surname, user.givenName, user.birthday, user.gender, ROLE];
        const [results, fields] = await connection.execute(QUERRY, params);
        connection.end();
        return true;
        
    } catch (e) {
        console.error(e);
        return false;
    }
}