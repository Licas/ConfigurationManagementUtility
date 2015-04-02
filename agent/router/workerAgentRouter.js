// ROUTES FOR OUR API
// =============================================================================
   
module.exports = function(app) {
    
   
    var exitStatus = {
        ok:0,
        nok:1
    };
    
    var express = require('express');
    var shortid = require('shortid');
    var router = express.Router();// get an instance of the express Router
    
   // var automato = require('../api/automatoIntegration');
    
    router.get('/discovery/discover/all', function(req, res,next) 
    {
       return res.json({
                    status: exitStatus.ok,
                    message:'Agents found',
                    "agent":agentList
                });
      
    });

    router.get('/discovery/discover/:agentid', function(req, res,next) 
    {

        for(agent in agentList)
        {
           // console.log(agentList[agent].agentID + " == " + req.params.agentid);
            if( agentList[agent].agentID == req.params.agentid )
            {
                //console.log("Found agent:" + JSON.stringify(agentList[agent]));
                
                return res.json({
                    status: exitStatus.ok,
                    message:'Agent found',
                    "agent":agentList[agent]
                });
                
            }
        }
        
        return res.json({
            status: exitStatus.nok,
            message:'Agent not found'
        });
    });
               
    router.post('/discovery/register', function(req, res,next) 
    {
        var domain = req.body.domain;
        var name = req.body.agentName;
        var ip = req.body.agentIp;
        var id = shortid.generate();
        
        console.log("id for " + name + ": " + id);
        
        agentList.push({
            agentID:id,
            domain:domain,
            agentName:name,
            agentIp:ip
        });
        
        console.log(JSON.stringify(agentList));
        
        res.json({
                    status: exitStatus.ok,
                    message:'Agent Registered'
        });
    });    
   
    
    app.use('/', router);
}