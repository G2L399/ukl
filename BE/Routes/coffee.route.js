/** load library express */
const express = require(`express`)

/** initiate object that instance of express */
const app = express()

/** allow to read 'request' with json type */
app.use(express.json())

/** load function authentcation from auth's controller */
const authController= require(`../Controllers/coffee.controller.js`)
const auth= require(`../Controllers/auth.controller.js`)
const multer = require(`multer`);
const storage = multer.memoryStorage(); // Store files in memory (you can configure it to store in disk)
const upload = multer({ storage: storage });

/** create route for authentication */
app.get("/", authController.GetFlags)
app.get("/:id", authController.GetOneFlags)
app.post("/",auth.authorize,upload.single("image") ,authController.insert)
app.put("/:id",auth.authorize,upload.single("image") ,authController.update)
app.delete("/:id",auth.authorize,authController.delete)
/** export app in order to load in another file */
module.exports = app