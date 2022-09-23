app.get('/dashboard/friendname',function(req,res) {
	if(req.session&&req.session.user)
	{
         req.session.user.friend=req.query.frndname;
         var Friendname=req.query.frndname;
         var pname=req.session.user.pname;
         console.log("FrName",Friendname);
         connection.query("SELECT * FROM chats WHERE (username = ? AND friendname = ?) OR (username = ? AND friendname = ?) ",[pname,Friendname,Friendname,pname],
         	                       function(err,results,fields){
         	            if(err)
			 	        {
				           	console.log("error at query");
								res.send({
								"code":400,
								"failed":"Error ocurred"
								});
				        }
				        else
				        {
				   
							var shortList;
							var likeList;
							connection.query('SELECT liked from likes where user = ?',[pname],function(err,liked,fields)
							{
								if(err)
								{
									console.log("error at query");
										res.send({
											"code":400,
											"failed":"Error ocurred"
										});
										res.end();
								}
								if(liked.length > 0)
								{	
									liked=liked[0].liked;
									liked=JSON.stringify(liked);
									console.log(" shortlist string is : "+liked);
									var likeList=split(liked);
									console.log("inside "+likeList);
								}
								else{
									likeList=' ';
								}
								var sql1='SELECT * from users where pname in (?)';
								connection.query(sql1,[likeList],function(err,Results,fields)
								{
									if(err)
									{
										console.log("error at query");
										res.send({
											"code":400,
											"failed":"Error ocurred"
										});
										res.end();
									}
									else
									{
										/*console.log(Results);
										console.log(results);*/
										res.render('likes',{
											user:req.session.user,
											members:Results,
											flag:1,
											friendFlag:1,
											friendname:Friendname,
                                            chats:results,
                                            moment:moment
                                         
										});

										res.end();
									}

								});
							});

				        }

         });
	}
});
app.post('/dashboard/chatlog',urlencodedParser,function(req,res){
	if(req.session&&req.session.user)
	{
		var pname=req.session.user.pname;
		var frndname=req.body.frndname;
		var msg=req.body.message;
		connection.query("INSERT INTO chats (username,friendname,userchat) VALUES ('"+pname+"','"+frndname+"','"+msg+"')",function(err,results,fiedls){
                           if(err)
			 	            {
				            	console.log("error at query");
								res.send({
								"code":400,
								"failed":"Error ocurred"
								});
				            }
				            else
				            {
				            	res.redirect('/dashboard/friendname?frndname='+frndname);
				            }
		});
	}
    
});