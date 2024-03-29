const { PaperType } = require('../models');
const logger = require('../utils/logger');

const getPaperTypesWithPagination = async ({ sortOrder, filters, searchRegex, skip, limit }) => {
  try {
    const whereClause = {};

    if (filters) {
      for (const key in filters) {
        switch (key) {
          case 'customFilter':
            break;
          default:
            console.warn(`Unknown filter key: ${key}`);
            break;
        }
      }
    }

    if (searchRegex) {
      whereClause.papertypename = searchRegex;
    }

    const [totalCount, papertypes] = await Promise.all([
        PaperType.count({
          where: whereClause
        }),
        PaperType.findAll({
          attributes: ['paper_type_id', 'papertypename', 'papertypedescription', 'priceperpage'],
          where: whereClause,
          order: [['papertypename', sortOrder]],
          limit: limit,
          offset: skip,
          distinct: true,
        }),
    ]);

    return {
      totalCount: totalCount,
      count: papertypes.length,
      papertypes: papertypes.map(type => ({
        id: type.paper_type_id,
        title: type.papertypename,
        price: type.priceperpage,
      })),
    };
  } catch (err) {
    logger.log('error', `${err.message}`, { stack: err.stack });
    throw err;
  }
};

const getPaperType = async ({ paperTypeId = null }) => {
  try {
    if (paperTypeId === null || isNaN(paperTypeId)) {
      throw new Error('Paper type ID must be a valid number');
    }

    const [papertype] = await Promise.all([
        PaperType.findOne({
          attributes: ['paper_type_id', 'papertypename', 'papertypedescription', 'priceperpage', 'paper_id'],
          where: {
            paper_type_id: paperTypeId
          }
        }),
    ]);

    if (!papertype) {
      return next(new ErrorResponse(`Paper type not found with ID ${paperTypeId}`, 404));
    }

    return papertype;
  } catch (err) {
    logger.log('error', `${err.message}`, { stack: err.stack });
    throw err;
  }
};

module.exports = {
    getPaperTypesWithPagination,
    getPaperType,
};