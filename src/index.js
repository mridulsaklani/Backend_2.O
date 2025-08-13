import dotenv from "dotenv"
dotenv.config({})
import express from "express"
import morgan from "morgan"
const PORT = process.env.PORT || 4000
const app = express()

app.use(morgan("dev"))

app.get('/',(req,res)=>{
    res.send("Jai sri ram")
})


app.listen(PORT, ()=>console.log(`Server is starting on http://localhost:${PORT}`))