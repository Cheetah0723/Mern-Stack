const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")

const dbConfig = require("./app/config/db.config")
const authRoutes = require("./app/routes/auth.routes")
const userRoutes = require("./app/routes/user.routes")

const app = express()

const db = require("./app/models")
const Role = db.role

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.")
    initial()
  })
  .catch((err) => {
    console.error("Connection error", err)
    process.exit()
  })

var corsOptions = {
  origin: "http://localhost:3000",
}

app.use(cors(corsOptions))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use("/api/auth", authRoutes)
// require("./app/routes/auth.routes")(app)
app.use("/api/test", userRoutes)
// require("./app/routes/user.routes")(app)

app.get("/", (req, res) => {
  res.json({ message: "Welcome to my application." })
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user",
      }).save((err) => {
        if (err) {
          console.log("error", err)
        }

        console.log("added 'user' to roles collection")
      })

      new Role({
        name: "moderator",
      }).save((er) => {
        if (err) {
          console.log("error", err)
        }

        console.log("added 'moderator' to roles collection")
      })

      new Role({
        name: "admin",
      }).save((err) => {
        if (err) {
          console.log("error", err)
        }

        console.log("added 'admin' to roles collection")
      })
    }
  })
}
