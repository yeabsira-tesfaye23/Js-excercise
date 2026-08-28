const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/students", (req, res) => {
    const students =[
        {
            name
        }
    ]
});
res.status(200).json(students);
app.listen(3000, () => {
    console.log(" The Server running");
});




const getStudents = async () => {
    const response = await fetch(
        "http://localhost:3000/students"
    );

    const data = await response.json();

    console.log(data);
};