const axios = require('axios')

module.exports = {

    authenticateUser: async function(req, res) {
        if (req.body.userID != null && req.body.airtableToken != null && req.body.githubToken != null  && req.body.usernameGitHub != null && req.body.usernameTelegram != null && req.body.airtableBase != null) {   
            try {
                const userToCheck = (await axios.get(app_domain + "/database/users/" + req.body.userID)).data
                
                if(userToCheck.status == "success"){
                    return res.status(userToCheck.statusCode).send(userToCheck)
                }                  
                
                const member = (await axios.get(app_domain + '/airtable/members/' + req.body.usernameGitHub, {
                    data:{
                        "airtableToken": req.body.airtableToken,
                        "airtableBase": req.body.airtableBase
                    }
                })).data
                
                if(member.status == "fail"){
                    return res.status(member.statusCode).send(member)
                }                
                
                const user = (await axios.post(app_domain + '/database/users',{
                    userID: req.body.userID,
                    chatID: req.body.chatID,
                    usernameTelegram: req.body.usernameTelegram,
                    usernameGitHub: req.body.usernameGitHub,
                    groups: member.groups,
                    githubToken: req.body.githubToken,
                    airtableToken: req.body.airtableToken,
                    airtableBase: req.body.airtableBase
                })).data
                

                if(user.status == "fail"){
                    return res.status(202).send("")
                }         

                return res.status(201).send({
                    status: 'success',
                    statusCode: 201,
                    data: user.data
                  })
            } catch (error) {
                console.log(err)
                return res.status(500).send({
                    status: 'fail',
                    statusCode: 500,
                    errorMessage: 'User couldn\'t be created'
                  })
            }
        }else{
            return res.status(400).send({
                status: 'fail',
                statusCode: 400,
                errorMessage: 'Bad Request'
            })
        }
    },

    logout: async function(req, res) {
        if (req.params.userID != null) {
            try {
                const response = (await axios.delete(app_domain + "/database/users/" + req.params.userID)).data
                if(response.statusCode == 404){
                    return res.status(202).send({
                        status: 'fail',
                        statusCode: 202,
                        errorMessage: 'User is already logged out'
                    })
                }
                return res.status(200).send({
                    status: 'success',
                    statusCode: 200,
                    data: response.data
                })
            } catch (error) {
                console.log(error);
                return res.status(500).send({
                    status: 'fail',
                    statusCode: 500,
                    errorMessage: 'Internal Server Error'
                })
            }
        }else{
            return res.status(400).send({
                status: 'fail',
                statusCode: 400,
                errorMessage: 'Bad Request'
            })
        }
    },
 
        // GITHUB - GROUPS - AIRTABLE
        createIssueTask: async function(req, res) {
            if(req.body.userID != null && req.body.title != null && req.body.description != null && req.body.repository != null){
    
                try {
                    const user = await databaseGetUser(req.body.userID)
                    if(user.name == "Error"){
                        return res.status(401).send("401 - User not Authorized")
                    }

                    // una funzione sola
                    const githubIssue = await createGitHubIssue(req,user.githubToken)
                    const airtableTask = await createAirTableTask(req,user.airtableToken,user.airtableBase)
                    
                    // controllo errori
                    if(airtableTask.name == "Error"){
                        return res.status(500).send(airtableTask.message)
                    }
                    var response = {
                        "githubIssue": githubIssue.url,
                        "airtableTask": airtableTask.data.id
                    }


                    return res.status(200).send({
                        status: 'success',
                        statusCode: 200,
                        data: response
                    });
                } catch (error) {
                    console.log(error);
                    return res.status(500).send({
                        status: 'fail',
                        statusCode: 500,
                        errorMessage: 'Internal Server Error'
                    })
                }
            }else{
                return res.status(400).send({
                    status: 'fail',
                    statusCode: 400,
                    data: 'Bad Request'
                })
            }
        },


}