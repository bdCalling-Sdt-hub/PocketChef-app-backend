import { Router } from "express";
import { termsAndConditionController } from "./termsAndCondition.controller";

const router = Router()


router.post("/create", termsAndConditionController.createTermsAndCondition)

// update

router.put("/update/:id", termsAndConditionController.updateTermsAndCondition)


// delete

router.delete("/delete/:id", termsAndConditionController.deleteTermsAndCondition)


// get all terms and conditions
router.get("/", termsAndConditionController.getTermsAndCondition)

export const termsAndConditionRoutes = router;