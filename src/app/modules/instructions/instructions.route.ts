import express, { NextFunction, Request, Response } from 'express';
import { InstructionsController } from './instructions.controller';
import fileUploadHandler from '../../middlewares/fileUploaderHandler';
import { InstructionsValidations } from './instructions.validation';
import validationRequest from '../../middlewares/validateRequest';
import { getSingleFilePath } from '../../../shared/getFilePath';
import ApiError from '../../../errors/ApiErrors';
import { StatusCodes } from 'http-status-codes';
const router = express.Router();

// create instruction
router.post(
    "/instructions",
    fileUploadHandler() as any,
    async (req: Request, res: Response, next: NextFunction) => {
        try {

            if (req.files) {
                const instructions = getSingleFilePath(req.files, "instructions" as any);
                if (!instructions) {
                    throw new ApiError(StatusCodes.BAD_REQUEST, "Instructions file is required");
                }
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
