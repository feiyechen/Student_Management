/**
 * WEB700 – Assignment 4
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students.
 * 
 * Name: Feiye Chen, Student ID: fchen82, Date: Nov 05, 2021
 * 
 */

const express = require("express");
const app = express();
const collegeData = require("./modules/collegeData");
const path = require("path");

const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static("public"));

app.use(express.urlencoded({extended: true}));

// setup a 'route' to listen on the default url path
app.get("/students", (req, res) => {
    if(req.query.course){
        // console.log(req.query.course);
        collegeData.getStudentsByCourse(req.query.course).then(data=>{
            res.json(data);
        }).catch(err=>{
            res.status(500).json({message:"no results"});
        })
    }else{
        collegeData.getAllStudents().then(data=>{
            res.json(data);
        }).catch(err=>{
            res.status(500).json({message:"no results"});
        })
    }
});

app.get("/tas", (req, res) => {
    collegeData.getTAs().then(data=>{
        res.json(data);
    }).catch(err=>{
        res.status(500).json({message:"no results"});
    })
});

app.get("/courses", (req, res) => {
    collegeData.getCourses().then(data=>{
        res.json(data);
    }).catch(err=>{
        res.status(500).json({message:"no results"});
    })
});

app.get("/student/:num", (req, res)=>{
    // console.log(req.params.num);
    collegeData.getStudentsByNum(req.params.num).then(data=>{
        res.json(data);
    }).catch(err=>{
        res.status(500).json({message:"no results"});
    })
});

app.get("/", (req, res)=>{
    res.status("200").sendFile(path.join(__dirname, "views/home.html"));
});

app.get("/about", (req, res)=>{
    res.status("200").sendFile(path.join(__dirname, "views/about.html"));
});

app.get("/htmlDemo", (req, res)=>{
    res.status("200").sendFile(path.join(__dirname, "views/htmlDemo.html"));
});

app.get("/students/add", (req, res)=>{
    res.status("200").sendFile(path.join(__dirname, "views/addStudent.html"));
});

app.post("/students/add", (req, res)=>{
    collegeData.addStudents(req.body).then(()=>{
        res.redirect("/students");
    }).catch(err=>{
        res.status(500).json({message:"adding students error"});
    })
});

app.use((req,res,next)=>{
    res.status(404).send("404: Page Not Found!");
});

// setup http server to listen on HTTP_PORT
collegeData.initialize().then(()=>{
    // console.log("Server start listening...");
    app.listen(HTTP_PORT);
}).catch(err=>{
    console.log(err);
})
