const collegeData = require("./modules/collegeData");

collegeData.initialize().then(()=>{
    //console.log("success");

    collegeData.getAllStudents().then(data=>{
        console.log("Successfully retrieved " + data.length + " students");
    }).catch(err=>{
        console.log(err);
    })

    collegeData.getCourses().then(data=>{
        console.log("Successfully retrieved " + data.length + " courses");
    }).catch(err=>{
        console.log(err);
    })

    collegeData.getTAs().then(data=>{
        console.log("Successfully retrieved " + data.length + " TAs");
    }).catch(err=>{
        console.log(err);
    })

    collegeData.getStudentsByCourse(2).then(data=>{
        console.log("Successfully retrieved " + data.length + " results");
    }).catch(err=>{
        console.log(err);
    })

    collegeData.getStudentsByNum(2).then(data=>{
        console.log(data);
    }).catch(err=>{
        console.log(err);
    })

}).catch(err=>{
    console.log(err);
})