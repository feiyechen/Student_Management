/**
 * WEB700 – Assignment 5
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students.
 * 
 * Name: Feiye Chen, Student ID: fchen82, Date: Nov 17, 2021
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


// setup a 'route' to listen on the default url path
app.get("/students", (req, res) => {
    if(req.query.course){
        // console.log(req.query.course);
        collegeData.getStudentsByCourse(req.query.course).then(data=>{
            res.render("students", {
                data: data
            });
        }).catch(err=>{
            res.status(500).render("students", {message:"no results"});
        })
    }else{
        collegeData.getAllStudents().then(data=>{
            res.render("students", {
                data: data
            });
        }).catch(err=>{
            res.status(500).render("students", {message:"no results"});
        })
    }
});

app.get("/courses", (req, res) => {
    collegeData.getCourses().then(data=>{
        res.render("courses", {
            data: data
        });
    }).catch(err=>{
        res.status(500).render("courses", {message:"no results"});
    })
});

app.get("/student/:num", (req, res)=>{
    // console.log(req.params.num);
    collegeData.getStudentsByNum(req.params.num).then(data=>{
        res.render("student", { // there's a new route to render ie: student (student.hbs)
            student: data
        });
    }).catch(err=>{
        res.status(500).render("student", {message: err});
    })
});

app.get("/course/:id", (req, res)=>{
    collegeData.getCourseById(req.params.id).then(data=>{
        res.render("course", {course: data});
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
    res.status("200").render("addStudent");
});

app.post("/students/add", (req, res)=>{
    collegeData.addStudents(req.body).then(()=>{
        res.redirect("/students");
    }).catch(err=>{
        res.status(500).json({message:"adding students error"});
    })
});

app.post("/student/update", (req, res)=>{
    collegeData.updateStudent(req.body).then(()=>{
        res.redirect("/students");
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
