import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { updateProfile, updatePassword} from "../controllers/user/profile.controllers.js";
// import { getActiveBanners } from "../../controllers/admin/banners.controller.js";

const router = Router();

// profile
router.route("/profile").patch(authMiddleware, updateProfile);
router.route("/change-password").patch(authMiddleware, updatePassword);

// banner
// router.route("/banners").get(getActiveBanners);

export default router;