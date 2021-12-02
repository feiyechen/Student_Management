const Sequelize = require('sequelize');

var sequelize = new Sequelize('d4d5q7r37etb89', 'okbppuhussziox', '3942d89e62f44d0edbe0750cec3cca8b46e34bc817142fa938afa3b5ee163e52', {
    host: 'ec2-34-205-230-1.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: {rejectUnauthorized: false}
    },
    query: {raw: true}
});

var Student = sequelize.define('Student', {
    studentNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressProvince: Sequelize.STRING,
    TA: Sequelize.BOOLEAN,
    status: Sequelize.STRING
    //course: Sequelize.INTEGER
});

var Course = sequelize.define('Course', {
    courseId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    courseCode: Sequelize.STRING,
    courseDescription: Sequelize.STRING
});

Course.hasMany(Student, {foreignKey: 'course'});


module.exports.initialize = function(){
    return new Promise((resolve, reject)=>{
        sequelize.sync().then(()=>{
            resolve();
        }).catch(err=>{
            reject("unable to sync the database");
        });
    });
}

module.exports.getAllStudents = function(){
    return new Promise((resolve, reject)=>{
        Student.findAll().then(data=>{
            resolve(data);
        }).catch(err=>{
            reject("no results returned");
        });
    });
}

module.exports.getStudentsByCourse = function(course){
    return new Promise((resolve, reject)=>{
        Student.findAll({
            where: {course: course}
        }).then(data=>{
            resolve(data);
        }).catch(err=>{
            reject("no results returned");
        });
    });
}

module.exports.getTAs = function(){
    return new Promise((resolve, reject)=>{
        Student.findAll({
            where: {TA: true}
        }).then(data=>{
            resolve(data);
        }).catch(err=>{
            reject("no results returned");
        });
    });
}

module.exports.getStudentsByNum = function(num){
    return new Promise((resolve, reject)=>{
        Student.findAll({
            where: {studentNum: num}
        }).then(data=>{
            resolve(data[0]);
        }).catch(err=>{
            reject("no results returned");
        });
    });
}

module.exports.getCourses = function(){
    return new Promise((resolve, reject)=>{
        Course.findAll().then(data=>{
            resolve(data);
        }).catch(err=>{
            reject("no results returned");
        });
    });
}

module.exports.getCourseById = function(id){
    return new Promise((resolve, reject)=>{
        Course.findAll({
            where: {courseId: id}
        }).then(data=>{
            resolve(data[0]);
        }).catch(err=>{
            reject("no results returned");
        });
    });
}

module.exports.addStudents = function(studentData){
    return new Promise((resolve, reject)=>{
        if(studentData.firstName == "" || studentData.lastName == ""){
            reject("Must have valid name");
        }else{
            studentData.TA = (studentData.TA) ? true : false;
            for(var i in studentData){
                if(studentData[i] == ""){
                    studentData[i] = null;
                }
            }
            Student.create(studentData).then(()=>{
                resolve();
            }).catch(err=>{
                reject("unable to create student");
            });
        }
    });
}

module.exports.updateStudent = function(studentData){
    return new Promise((resolve, reject)=>{
        if(studentData.firstName == "" || studentData.lastName == ""){
            reject("Must have valid name");
        }else{
            studentData.TA = (studentData.TA) ? true : false;
            for(var i in studentData){
                if(studentData[i] == ""){
                    studentData[i] = null;
                }
            }
            Student.update(studentData, {
                where: {studentNum: studentData.studentNum}
            }).then(()=>{
                resolve();
            }).catch(err=>{
                reject("unable to update student");
            });
        }
    });
}

module.exports.addCourse = function(courseData){
    return new Promise((resolve, reject)=>{
        if(courseData.courseCode == ""){
            reject("Must have valid code");
        }else{
            for(var i in courseData){
                if(courseData[i] == ""){
                    courseData[i] = null;
                }
            }
            Course.create(courseData).then(()=>{
                resolve();
            }).catch(err=>{
                reject("unable to create course");
            });
        }
    });
}

module.exports.updateCourse = function(courseData){
    return new Promise((resolve, reject)=>{
        if(courseData.courseCode == ""){
            reject("Must have valid code");
        }else{
            for(var i in courseData){
                if(courseData[i] == ""){
                    courseData[i] = null;
                }
            }
            Course.update(courseData, {
                where: {courseId: courseData.courseId}
            }).then(()=>{
                resolve();
            }).catch(err=>{
                reject("unable to update course");
            });
        }
    });
}

module.exports.deleteCourseById = function(id){
    return new Promise((resolve, reject)=>{
        Course.destroy({
            where: {courseId: id}
        }).then(()=>{
            resolve();
        }).catch(err=>{
            reject("unable to delete course");
        });
    });
}

module.exports.deleteStudentByNum = function(num){
    return new Promise((resolve, reject)=>{
        Student.destroy({
            where: {studentNum: num}
        }).then(()=>{
            resolve();
        }).catch(err=>{
            reject("unable to delete student");
        });
    });
}