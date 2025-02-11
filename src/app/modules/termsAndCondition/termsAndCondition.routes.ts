import { Router } from "express";
import { termsAndConditionController } from "./termsAndCondition.controller";

const router = Router()


router.post("/create", termsAndConditionController.createTermsAndCondition)

// update

router.put("/update/:id", termsAndConditionController.updateTermsAndCondition)


// delete

router.delete("/delete/:id", termsAndConditionController.deleteTermsAndCondition)


export const termsAndConditionRoutes = router;