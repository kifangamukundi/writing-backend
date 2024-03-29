const express = require("express");
const router = express.Router();
const { paginationMiddleware, sortOrderMiddleware, filterMiddleware, searchMiddleware } = require("../middleware/dataManipulation");
const { onlyLoggedIn, onlyAdmin } = require("../middleware/accessControl");

const {
  create, getAllPaginate, updateById, getById, pay, getAllAdminPaginate, assign,
} = require("../controllers/order");

const validSortOrders = ['asc', 'desc'];
const defaultPage = 1;
const defaultLimit = 4;

router.route("/").post(onlyLoggedIn, create);
router.route("/user/paginate").get(
    onlyLoggedIn,
    (req, res, next) => sortOrderMiddleware(validSortOrders, req, res, next),
    paginationMiddleware(defaultPage, defaultLimit),
    searchMiddleware,
    filterMiddleware,
    getAllPaginate
);
router.route("/admin/paginate").get(
    onlyAdmin,
    (req, res, next) => sortOrderMiddleware(validSortOrders, req, res, next),
    paginationMiddleware(defaultPage, defaultLimit),
    searchMiddleware,
    filterMiddleware,
    getAllAdminPaginate
);
router.route("/payment").patch(onlyLoggedIn, pay);
router.route("/assign").patch(onlyAdmin, assign);
router.route("/:orderId").get(onlyLoggedIn, getById);
router.route("/:orderId").patch(onlyLoggedIn, updateById);

module.exports = router;