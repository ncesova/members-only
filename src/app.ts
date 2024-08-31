import express from "express";
import dotenv from "dotenv";
import indexRouter from "./routes/indexRouter";
require("dotenv").config();
const session = require("express-session");
import passport from "passport";
import {Strategy} from "passport-local";
import {getUserById, getUserByUsername} from "./db/queries/select";
import {createUser} from "./db/queries/insert";
import {InsertUser} from "./db/schema";
import path from "path";
const bcrypt = require("bcryptjs");

dotenv.config();

const app = express();
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: false}));
app.use(session({secret: "cats", resave: false, saveUninitialized: false}));
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

passport.use(
  new Strategy(async (username: string, password: string, done) => {
    try {
      const rows = await getUserByUsername(username);
      const user = rows[0];

      if (!user) {
        return done(null, false, {message: "Incorrect username"});
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, {message: "Incorrect password"});
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

type User = {
  id?: number;
};

passport.serializeUser((user: User, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const rows = await getUserById(id);
    const user = rows[0];

    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.post("/signup", async (req, res, next) => {
  bcrypt.hash(
    req.body.password,
    10,
    async (err: Error, hashedPassword: string) => {
      if (err) {
        return next(err);
      } else {
        try {
          const user: InsertUser = {
            username: req.body.username,
            password: hashedPassword,
          };
          await createUser(user);
          res.redirect("/");
        } catch (err) {
          return next(err);
        }
      }
    }
  );
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  })
);

app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.use("/", indexRouter);

app.listen(3000, () => {
  console.log("app listening on port 3000!");
});
