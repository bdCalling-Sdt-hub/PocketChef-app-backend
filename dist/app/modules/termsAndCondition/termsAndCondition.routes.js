"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.termsAndConditionRoutes = void 0;
const express_1 = require("express");
const termsAndCondition_controller_1 = require("./termsAndCondition.controller");
const router = (0, express_1.Router)();
router.post("/create", termsAndCondition_controller_1.termsAndConditionController.createTermsAndCondition);
// update
router.put("/update/:id", termsAndCondition_controller_1.termsAndConditionController.updateTermsAndCondition);
// delete
router.delete("/delete/:id", termsAndCondition_controller_1.termsAndConditionController.deleteTermsAndCondition);
exports.termsAndConditionRoutes = router;
