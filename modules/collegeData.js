let fs = require("fs");

class Data{
    constructor(students, courses){
        this.students = students;
        this.courses = courses;
    }
}

var dataCollection = null;

module.exports.initialize = function(){
    return new Promise((resolve, reject)=>{
        fs.readFile("./data/students.json", "utf-8", (err, data)=>{
            if(err){
                reject(err);
            }else{
                let students = JSON.parse(data);
                fs.readFile("./data/courses.json", "utf-8", (err, data)=>{
                    if(err){
                        reject(err);
                    }else{
                        let courses = JSON.parse(data);
                        dataCollection = new Data(students, courses);
                        resolve();
                    }
                });
            }
        });
    });
}

module.exports.getAllStudents = function(){
    return new Promise((resolve, reject)=>{
        if(dataCollection.students.length == 0){
            reject("no results returned")
        }else{
            resolve(dataCollection.students);
        }
    });
}

module.exports.getTAs = function(){
    return new Promise((resolve, reject)=>{
        let studentIsTA = [];
        let index = 0;
        for(var i=0;i<dataCollection.students.length;i++){
            if(dataCollection.students[i].TA == true){
                studentIsTA[index] = dataCollection.students[i];
                index += 1;
            }
        }
        if(studentIsTA.length == 0){
            reject("no results returned")
        }else{
            resolve(studentIsTA);
        }
    });
}

module.exports.getCourses = function(){
    return new Promise((resolve, reject)=>{
        if(dataCollection.courses.length == 0){
            reject("no results returned")
        }else{
            resolve(dataCollection.courses);
        }
    });
}

module.exports.getStudentsByCourse = function(course){
    return new Promise((resolve, reject)=>{
        let studentWithCourse = [];
        let index = 0;
        for(var i=0;i<dataCollection.students.length;i++){
            if(dataCollection.students[i].course == course){
                studentWithCourse[index] = dataCollection.students[i];
                index += 1;
            }
        }
        if(studentWithCourse.length == 0){
            reject("no results returned")
        }else{
            resolve(studentWithCourse);
        }
    });
}

module.exports.getStudentsByNum = function(num){
    return new Promise((resolve, reject)=>{
        let studentWithNum = null;
        for(var i=0;i<dataCollection.students.length;i++){
            if(dataCollection.students[i].studentNum == num){
                studentWithNum = dataCollection.students[i];
            }
        }
        if(studentWithNum == null){
            reject("no results returned")
        }else{
            resolve(studentWithNum);
        }
    });
}

module.exports.addStudents = function(studentData){
    return new Promise((resolve, reject)=>{
        if(studentData.firstName == "" || studentData.lastName == ""){
            reject("Must have valid name");
        }else{
            studentData.TA = (studentData.TA) ? true : false;
            studentData.studentNum = dataCollection.students.length + 1;
            dataCollection.students.push(studentData);
            resolve();
        }
    });
}
