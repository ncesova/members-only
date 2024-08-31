import {Router} from "express";
import {getAllPosts} from "../db/queries/select";

const indexRouter = Router();

indexRouter.get("/", async (req, res) => {
  const messages = await getAllPosts();
  res.render("index", {posts: messages});
});
indexRouter.post("/login");
indexRouter.get("/logout");
indexRouter.get("/signup");
indexRouter.post("/signup");

export default indexRouter;
