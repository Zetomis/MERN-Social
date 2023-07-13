import { Router } from "express";
import upload from "../utils/multerUtils";
import isAuthenticated from "./../middlewares/isAuthenticated";
import {
    postCommentDelete,
    postCommentGet,
    postCommentUpdate,
    postCommentUpload,
    postDelete,
    postGetAll,
    postGetSingle,
    postLike,
    postUpdate,
    postUpload,
} from "../controllers/postController";

const router: Router = Router();

router.post("/", isAuthenticated, upload.single("postImage"), postUpload);
router.patch("/:postId", isAuthenticated, upload.none(), postUpdate);
router.delete("/:postId", isAuthenticated, postDelete);

// Get all/single post
router.get("/", postGetAll);
router.get("/:postId", postGetSingle);

// Like
router.post("/like/:postId", isAuthenticated, postLike);

// Comment
router.get("/comment/:postId", postCommentGet); // This mean get all comment
router.post(
    "/comment/:postId",
    isAuthenticated,
    upload.none(),
    postCommentUpload
);
router.patch(
    "/comment/:postId/:commentId",
    isAuthenticated,
    upload.none(),
    postCommentUpdate
);
router.delete(
    "/comment/:postId/:commentId",
    isAuthenticated,
    postCommentDelete
);

export default router;
