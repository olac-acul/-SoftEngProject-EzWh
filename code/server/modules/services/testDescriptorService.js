class TestDescriptorService {
    dao;

    constructor(dao) {
        this.dao = dao;
    }

    getTestDescriptors = async () => {
        const testDescriptors = await this.dao.getTestDescriptors();
        return testDescriptors;
    }

    getTestDescriptorById = async (id) => {
        const testDescriptor = await this.dao.getTestDescriptorById(id);
        return testDescriptor;
    }

    createTestDescriptor = async (testDescriptor) => {
        await this.dao.newTable();
        await this.dao.createTestDescriptor(testDescriptor);
    }

    deleteTestDescriptor = async (id) => {
        const deletedElelements = await this.dao.deleteTestDescriptor(id);
        return deletedElelements;
    }

}

module.exports = TestDescriptorService;