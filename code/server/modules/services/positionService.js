class PositionService {
    dao;

    constructor(dao) {
        this.dao = dao;
    }

    getPositions = async () => {
        const positions = await this.dao.getPositions();
        return positions;
    }

    createPosition = async (position) => {
        await this.dao.newTable();
        await this.dao.createPosition(position);
    }

    deletePosition = async (id) => {
        const deletedElements = await this.dao.deletePosition(id);
        return deletedElements;
    }
}

module.exports = PositionService;