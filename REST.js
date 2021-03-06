var mysql = require('mysql');
function REST_ROUTER(router,connection,md5) {
    var self = this;
    self.handleRoutes(router,connection,md5);
}

REST_ROUTER.prototype.handleRoutes= function(router,connection,md5) {
    router.get("/",function(req,res){
        res.json({"Message" : "Hello World !",
                  "Connard": "Remi"});
    });
    router.post("/users",function(req,res){
      var query = "INSERT INTO ??(??,??,??,??,??) VALUES (?,?,?,?,?)";
      var table = ["user","lastname","firstname","email","password","role",req.body.lastname,req.body.firstname,req.body.email,md5(req.body.password),req.body.role];
      query = mysql.format(query,table);
      connection.query(query,function(err,rows){
          if(err) {
              res.json({"Error" : 400, "Message" : "Error executing MySQL query"});
          } else {
              res.json({"Error" : 201, "User" : {
                  "lastname": req.body.lastname,
                  "firstname": req.body.firstname,
                  "email": req.body.email,
                  "password": req.body.password,
                  "role": req.body.role
              }});
          }
      });
  });

  router.get("/user/:id",function(req,res){
      var query = "SELECT * FROM ?? WHERE ??=?";
      var table = ["user","id",req.params.id];
      query = mysql.format(query,table);
      connection.query(query,function(err,rows){
          if(err) {
              res.json({"Error" : true, "Message" : "Error executing MySQL query"});
          } else {
              res.json({"Error" : 200, "Users" : rows});
          }
      });
  });

  router.get("/users",function(req,res){
    var query = "SELECT * FROM ??";
        var table = ["user"];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : 401, "Message" : "Must Be connected"});
            } else {
                res.json({"Error" : 200, "Users" : rows});
            }
        });
  });
  router.put("/user/:id",function(req,res){
    var tab = [];
    var result = {};
      for (var key in req.body) {
        if (req.body.hasOwnProperty(key)) {
          var query = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
           var table = ["user",key,req.body[key],"id",req.params.id];
           query = mysql.format(query,table);
           console.log("Before");
           console.log(result);
           connection.query(query,function(err,rows){
               if(err) {
                   result = {'Error':true, "Message":"Error executing MySQL query"};
                   tab.push(result);
               } else {
                   result = {'Error':false, 'Message': "Updated "+ key};
                   tab.push(result)
               }
           });
        }
      }
      res.json({});
  });
  router.delete("/users/:id",function(req,res){
        var query = "DELETE from ?? WHERE ??=?";
        var table = ["user","id",req.params.id];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : 204, "Message" : "No datas"});
            }
        });
    });
}

module.exports = REST_ROUTER;
