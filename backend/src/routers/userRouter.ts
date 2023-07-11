import { Router } from "express";
import { userLogin, userRegister } from "../controllers/userController";
import upload from "../utils/multerUtils";

const router: Router = Router();

router.post("/login", upload.none(), userLogin);
router.post("/register", upload.single("userAvatar"), userRegister);

export default router;
