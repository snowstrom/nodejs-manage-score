var mongoose=require("mongoose");
//连接数据库
var mongoose=require("mongoose");
var db=mongoose.connect("mongodb://127.0.0.1:27017/student");
db.connection.on("error",function(error){
	console.log("数据库连接失败："+error);
});
db.connection.on("open",function(){
	console.log("数据库连接成功");
});
var Schema =mongoose.Schema;
//存放注册好的用户的账号和密码的模具
var userSchema = new Schema({
	name:String,
	password:String
});
//存放一个学生的成绩信息
var studentSchema = new Schema({
	ID:String,
	Name:String,
	Chinese:Number,
	Math:Number,
	English:Number
});

var users = mongoose.model("users",userSchema);
var students = mongoose.model("students",studentSchema);

function login(username,userpassword,callback){
	var data={};
	data.name=false;
	data.password=false;
	users.findOne({name:username},function(err,user){
		if(err)console.log("登录出现异常");
		if(user){
			data.name=true;
			if(user.password == userpassword){
				data.password=true;
			}
			callback(data);
		}else{
			callback(data);
		}
	})	
}
function register(username,userpassword,callback){
	users.findOne({name:username},function(err,user){
		if(err)console.log("注册新用户是出现异常");
		if(user){
			callback(false);
		}else{
			var user = new users({
				name:username,
				password:userpassword
			});
			user.save(function(err,user){
				if(err){
					console.log("保存新注册用户信息出现异常")
				}	
			});
			callback(true);
		}
	})
}
function addScore(newStudent,callback){
	var saveFlag = true;
	newStudent.forEach(function(stu_item){
		var student = new students({
			ID:stu_item.ID,
			Name:stu_item.Name,
			Chinese:stu_item.Chinese,
			Math:stu_item.Math,
			English:stu_item.English
		});
		student.save(function(err,student){
			if(err){
				saveFlag=false;
			}else{
				console.log("保存新成绩成功"+student.Name); 
			}
		});
	});
	callback(saveFlag);
}
function getScore(callback){
	students.find({},null,{sort:["ID"]},function(err,students){
		if(err){
			console.log("获取所有成绩时出现异常");
		}
		if(students){
			callback(students);
		}
	})
}
function modifyScore(item,callback){
	students.findOne({ID:item.ID},function(err,student){
		if(err){
			console.log("修改成绩时，查询异常");
		}
		if(student){
			student.ID=item.newID;
			student.Name=item.newName;
			student.Chinese=item.newChinese;
			student.Math=item.newMath;
			student.English=item.newEnglish;
			
			student.save(function(err,student){
				if(err){
					console.log("保存修改时出现异常");
					callback(false);
				}else{
					callback(true);
				}
			})
		}
	})
}
function deleteScore(item,callback){
	var flag = true;
	item.forEach(function(stu_item){
		students.remove({ID:stu_item},function(err){
			if(err){
				flag=false;	
			}
			console.log("删除成功"+stu_item);
		})
	});
	callback(flag);
}

exports.db = db;
exports.login = login;
exports.register = register;
exports.addScore = addScore;
exports.getScore = getScore;
exports.modifyScore = modifyScore;
exports.deleteScore = deleteScore;
	
	
	
	