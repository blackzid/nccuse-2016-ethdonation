var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	
  res.render('member',{
  	u_error:"",
  	p_error:""
  });
});
router.post('/', function(req, res) {
    if (req.body['username'] == "") {
        res.render("member",{
        	u_error:"帳號空白或錯誤",
        	p_error:""
        });
    } else if (req.body['password'] == "") {
        res.render("member",{
        	p_error:"密碼空白或錯誤",
        	u_error:""
        });
    } else {
    	res.cookie('admin', req.body['username'], { path: '/projects', signed: true});		
    	res.cookie('password', req.body['password'], { path: '/projects', signed: true});		

        res.redirect("/projects")
    }
})
module.exports = router;
