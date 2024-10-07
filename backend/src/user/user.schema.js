const userSchema = {
    type: 'object',
    properties: {
        email: { type: 'string', format: 'email'},
        password: { type: 'string' },
        surname: { type: 'string' },
        givenName: { type: 'string' },
        // YYYY-MM-DD
        birthday: { type: 'string', format: 'date' },
        gender: { type: 'string', enum: ['male', 'female'] }
    },
    required: ['email', 'password', 'surname', 'givenName', 'birthday', 'gender'],
    additionalProperties: false
};

module.exports = userSchema;