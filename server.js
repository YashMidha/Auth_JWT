import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import 'dotenv/config'
import jwtAuth from './routes/jwtAuth.js';
import dashboard from './routes/dashboard.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/auth", jwtAuth);
app.use("/dashboard", dashboard);

app.get("/", (req, res)=>{
    res.json({message: "server running"})
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
