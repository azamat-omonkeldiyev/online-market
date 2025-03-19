const Region = require("./../model/region.model");

//  Yangi region qo'shish
const createRegion = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: "Region name is required" });

        const region = await Region.create({ name });
        res.status(201).json({ message: "Region created", region });
    } catch (error) {
        res.status(500).json({ message: "Server xatosi", error: error.message });
    }
};

//  Barcha regionlarni olish (ID bo'yicha qidirish va pagination qo'shildi)
const getAllRegions = async (req, res) => {
    try {
        const { id, page = 1, limit = 10 } = req.query;
        const whereCondition = id ? { id } : {};

        const regions = await Region.findAndCountAll({
            where: whereCondition,
            limit: parseInt(limit),
            offset: (parseInt(page) - 1) * parseInt(limit)
        });

        res.status(200).json({
            total: regions.count,
            page: parseInt(page),
            totalPages: Math.ceil(regions.count / parseInt(limit)),
            data: regions.rows
        });
    } catch (error) {
        res.status(500).json({ message: "Server xatosi", error: error.message });
    }
};

// Regionni yangilash
const updateRegion = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const region = await Region.findByPk(id);
        if (!region) return res.status(404).json({ message: "Region not found" });

        region.name = name || region.name;
        await region.save();

        res.status(200).json({ message: "Region updated", region });
    } catch (error) {
        res.status(500).json({ message: "Server xatosi", error: error.message });
    }
};

// Regionni o'chirish
const deleteRegion = async (req, res) => {
    try {
        const { id } = req.params;
        const region = await Region.findByPk(id);
        if (!region) return res.status(404).json({ message: "Region not found" });

        await region.destroy();
        res.status(200).json({ message: "Region deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server xatosi", error: error.message });
    }
};

module.exports = {
    createRegion,
    getAllRegions,
    updateRegion,
    deleteRegion,
};
