/**
 * WEB700 – Assignment 6
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students.
 * 
 * Name: Feiye Chen, Student ID: fchen82, Date: Dec 1, 2021
 * 
 * Online(Heroku) Link: https://tranquil-bastion-95939.herokuapp.com/
 */

const express = require("express");
const app = express();
const collegeData = require("./modules/collegeData");
const path = require("path");
const exphbs = require("express-handlebars");

const HTTP_PORT = process.env.PORT || 8080;

//configuration for Handlebars
app.engine(".hbs", exphbs.engine({
    extname: ".hbs",
    layout: "main",
    helpers: {

        //QUESTION: what is options??

        navLink: function(url, options){
            return '<li' + 
                ((url == app.locals.activeRoute) ? ' class="nav-item active"' : ' class="nav-item"') + 
                '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    }
}));

app.set("view engine", ".hbs");
///////////////////////////////

app.use(express.static("public"));

app.use(express.urlencoded({extended: true}));

app.use(function(req, res, next){
    let route = req.baseUrl + req.path;
    // console.log(route);

    //QUESTION: what is the replace doing??

    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});

app.get("/students", (req, res) => {
    if(req.query.course){
        collegeData.getStudentsByCourse(req.query.course).then(data=>{
            if(data.length > 0){
                res.render("students", {
                    data: data
                });
            }else{
                res.render("students", {message: "no results"});
            }
        }).catch(err=>{
            res.status(500).render("students", {message:"no results"});
        })
    }else{
        collegeData.getAllStudents().then(data=>{
            if(data.length > 0){
                res.render("students", {
                    data: data
                });
            }else{
                res.render("students", {message: "no results"});
            }
        }).catch(err=>{
            res.status(500).render("students", {message:"no results"});
        })
    }
});

app.get("/courses", (req, res) => {
    collegeData.getCourses().then(data=>{
        if(data.length > 0){
            res.render("courses", {
                data: data
            });
        }else{
            res.render("courses", {message: "no results"});
        }
    }).catch(err=>{
        res.status(500).render("courses", {message:"no results"});
    })
});

app.get("/student/:num", (req, res)=>{
    //initialize an empty object to store the values
    let viewData = {};

    collegeData.getStudentsByNum(req.params.num).then(data=>{
        if(data){
            viewData.student = data; //store student data in the "viewData" object as "student"
        }else{
            viewData.student = null; //set student to null if none were returned
        }
    }).catch(()=>{
        viewData.student = null; //set student to null if there was an error
    }).then(collegeData.getCourses).then(data=>{
        viewData.courses = data; //store course data in the "viewData" object as "courses"

        //loop through viewData.course and once we have found the courseId that matches
        //the student's "course" value, add a "selected" property to the matching
        //viewData.courses object

        for(let i=0;i<viewData.courses.length;i++){
            if(viewData.courses[i].courseId == viewData.student.course){
                viewData.courses[i].selected = true;
            }
        }
    }).catch(()=>{
        viewData.courses = []; //set courses to empty if there was an error
    }).then(()=>{
        if(viewData.student == null){// if no student then return an error
            res.status(404).send("Student Not Found");
        }else{ //render the "student" view
            res.render("student", {viewData: viewData});
        }
    })
});

app.get("/course/:id", (req, res)=>{
    collegeData.getCourseById(req.params.id).then(data=>{
        if(data){
            res.render("course", {course: data});
        }else{
            res.status(404).send("Course Not Found");
        }
    }).catch(err=>{
        res.status(500).render("courses", {message: err});
    })
});

app.get("/", (req, res)=>{
    res.status("200").render("home");
});

app.get("/about", (req, res)=>{
    res.status("200").render("about");
});

app.get("/htmlDemo", (req, res)=>{
    res.status("200").render("htmlDemo");
});

app.get("/students/add", (req, res)=>{
    collegeData.getCourses().then(data=>{
        res.status("200").render("addStudent", {courses: data});
    }).catch(()=>{
        res.status(500).render("addStudent", {course: []});
    })
});

app.get("/student/delete/:num", (req, res)=>{
    collegeData.deleteStudentByNum(req.params.num).then(()=>{
        res.redirect("/students");
    }).catch(err=>{
        res.status(500).send("Unable to Remove Student / Student not found");
    })
});

app.get("/courses/add", (req, res)=>{
    res.status("200").render("addCourse");
});

app.get("/course/delete/:id", (req, res)=>{
    collegeData.deleteCourseById(req.params.id).then(()=>{
        res.redirect("/courses");
    }).catch(err=>{
        res.status(500).send("Unable to Remove Course / Course not found");
    })
});

app.post("/students/add", (req, res)=>{
    collegeData.addStudents(req.body).then(()=>{
        res.redirect("/students");
    }).catch(err=>{
        res.status(500).json({message: err});
    })
});

app.post("/courses/add", (req, res)=>{
    collegeData.addCourse(req.body).then(()=>{
        res.redirect("/courses");
    }).catch(err=>{
        res.status(500).json({message: err});
    })
});

app.post("/student/update", (req, res)=>{
    collegeData.updateStudent(req.body).then(()=>{
        res.redirect("/students");
    }).catch(err=>{
        res.status(500).json({message: err});
    })
});

app.post("/course/update", (req, res)=>{
    collegeData.updateCourse(req.body).then(()=>{
        res.redirect("/courses");
    }).catch(err=>{
        res.status(500).json({message: err});
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
