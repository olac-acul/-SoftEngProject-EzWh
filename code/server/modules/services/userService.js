const validator = require('validator');
const availableUsersList = ["customer", "qualityEmployee", "clerk", "deliveryEmployee", "supplier"];
class UserService {
    dao;

    constructor(dao) {
        this.dao = dao;
    }

    getSuppliers = async () => {
        // 401 Unauthorized (not logged in or wrong permissions)
        const suppliers = await this.dao.getSuppliers();
        return suppliers;
    }

    getUsersExceptManager = async () => {
        // 401 Unauthorized (not logged in or wrong permissions)
        const users = await this.dao.getUsersExceptManager();
        return users;
    }

    addUser = async (user) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        if (Object.keys(user).length !== 5)
            return '422';
        if (user.username === undefined || user.name === undefined || user.surname === undefined || user.password === undefined || user.type === undefined)
            return '422';
        if (!availableUsersList.includes(user.type))
            return '422';
        if (!validator.isEmail(user.username))
            return '422';
        if (user.password.length < 8)
            return '422';
        const validatedUser = {
            username: user.username,
            name: user.name,
            surname: user.surname,
            password: user.password,
            type: user.type
        };
        const users = await this.dao.getUsersExceptManager();
        for (let i of users) {
            if (i.email === validatedUser.username && i.type === validatedUser.type)
                return '409';
        }
        // END OF VALIDATION
        await this.dao.newUserTable();
        await this.dao.addUser(validatedUser);
        return '201';
    }

    loginUser = async (username, password, type) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        if (!validator.isEmail(username))
            return '422';
        const validatedUsername = username;
        const validatedPassword = password;
        const user = await this.dao.loginUser(validatedUsername, validatedPassword, type);
        if (user === 'Not found')
            return '404';
        // END OF VALIDATION
        else
            return user;
    }

    modifyUserRights = async (username, type) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        if (!validator.isEmail(username))
            return '422';
        if (Object.keys(type).length !== 2)
            return '422';
        if (type.oldType === undefined || type.newType === undefined)
            return '422';
        if (!availableUsersList.includes(type.oldType))
            return '422';
        if (!availableUsersList.includes(type.newType))
            return '422';
        const validatedUsername = username;
        const validatedOldType = type.oldType;
        const validatedNewType = type.newType;
        const updatedElements = await this.dao.modifyUserRights(validatedUsername, validatedOldType, validatedNewType);
        if (updatedElements === 0)
            return '404';
        // END OF VALIDATION
        else
            return '200';
    }

    deleteUser = async (username, type) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        if (!validator.isEmail(username))
            return '422';
        if (!availableUsersList.includes(type))
            return '422';
        const validatedUsername = username;
        const validatedType = type;
        await this.dao.deleteUser(validatedUsername, validatedType);
        return '204';
    }

    deleteUsers = async () => {
        await this.dao.deleteUsers();
        }
}

module.exports = UserService;