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
        await this.dao.newUserTable();
        const status = await this.dao.addUser(user);
        return status;
    }

    loginUser = async (username, password, type) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        const status = await this.dao.loginUser(username, password, type);
        return status;
    }

    modifyUserRights = async (username, oldType, newType) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        const updatedElements = await this.dao.modifyUserRights(username, oldType, newType);
        return updatedElements;
    }

    deleteUser = async (username, type) => {
        // 401 Unauthorized (not logged in or wrong permissions)
        const deletedUsers = await this.dao.deleteUser(username, type);
        return deletedUsers;
    }
}

module.exports = UserService;