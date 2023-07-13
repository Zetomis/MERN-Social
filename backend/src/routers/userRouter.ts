import { Router } from "express";
import {
    userFollow,
    userLogin,
    userRegister,
} from "../controllers/userController";
import upload from "../utils/multerUtils";
import isAuthenticated from "../middlewares/isAuthenticated";

const router: Router = Router();

router.post("/login", upload.none(), userLogin);
router.post("/register", upload.single("userAvatar"), userRegister);
router.post("/follow/:userId", isAuthenticated, userFollow);

export default router;
