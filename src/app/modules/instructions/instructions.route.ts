import express, { NextFunction, Request, Response } from 'express';
import { InstructionsController } from './instructions.controller';
import fileUploadHandler from '../../middlewares/fileUploaderHandler';
import { InstructionsValidations } from './instructions.validation';
import validationRequest from '../../middlewares/validateRequest';
import { getSingleFilePath } from '../../../shared/getFilePath';
const router = express.Router();

// create instruction
router.post(
    "/instructions",
    fileUploadHandler() as any,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log("Uploaded files:", req.files);  // Log the files to debug

            if (req.files) {
                const instructions = getSingleFilePath(req.files, "instructions" as any);
                console.log("Instructions image path:", instructions);  // Log the image path

                req.body = {
                    ...req.body,
                    instructions,
                };
            }
            next();
        } catch (error) {
            console.error("Error during file upload:", error); // Log any errors
            return res.status(400).json({ error: error });
        }
    },
    validationRequest(InstructionsValidations.createInstructionZodSchema),
    InstructionsController.createInstruction
);




// get all instruction
router.get('/instructions', InstructionsController.getAllInstruction);

// get instruction by id
router.post('/instructions/:id', InstructionsController.getInstructionById);

export const InstructionsRoutes = router;
