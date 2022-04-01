import { Router } from "express";

import { ResetPasswordController } from "@modules/accounts/useCases/resetPasswordUser/ResetPasswordController";
import { SendForgotPasswordMailController } from "@modules/accounts/useCases/sendForgotPasswordMail/SendForgotPasswordMailController";

const passwordsRoutes = Router();

const sendForgotPasswordMailController = new SendForgotPasswordMailController();
const resetPasswordController = new ResetPasswordController();

passwordsRoutes.post("/forgot", sendForgotPasswordMailController.handle);
passwordsRoutes.post("/reset", resetPasswordController.handle);

export { passwordsRoutes };
