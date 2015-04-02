var auto = require('automato').init();

var config = require(__dirname + '/../conf/workeragent.js');

var defaultHost = "localhost";
var user = "user";
var processName = "nodemon";

var templatePath = "./templates";
var scriptsRemotePath = "/home/scripts/";
var scriptsLocalPath = config.localscriptpath;
	
module.exports = {
    getAgentStatus:getAgentStatus,
    getAgentConfig:getAgentConfig,
    getPIDByName:getPIDByName,
    getProcessByPID:getProcessByPID,
    getProcessByPID:getProcessByPID,
    killPID:killPID,
    killProcessByName:killProcessByName,
    executeLocalCommand:executeLocalCommand,
    executeRemoteCommand:executeRemoteCommand,
    executeLocalScript:executeLocalScript,
    executeRemoteScript:executeRemoteScript,
    shutdownAgent:shutdownAgent
};

function getAgentStatus() {
}
    
function getAgentConfig() {
}

function getPIDByName(processName, callback) {
        //var cmd = "ps -eo pid,command | grep -v grep | grep " + processName + " | head -1|awk '{print$2}'";
        var cmd = "ps -eo pid,command | grep -v grep | grep " + processName + " | awk '{print$1}'";
    
        return auto.run(host, user, cmd, callback);
}
  
function getProcessByPID(pid, callback) {
        var cmd = "ps -eo pid,command | grep -v grep | grep " + pid + " | awk '{$1=\"\"; print$0}'"
        
        return auto.run(host, user, cmd, callback);
}

function killPID(pid, callback) {
        var killBillCmd = "kill -9 " + pid;
        console.log("Gonna kill " + killBillCmd);
        return auto.local(killBillCmd, callback);
}

function killProcessByName(processName, callback) {

    var killBillCmd = "ps  -eo pid,command | grep -v grep | grep " + processName + " | awk '{print$1}' | xargs kill -9"
        
    return auto.run(host, user, killBillCmd, callback);
}
    
function executeLocalCommand(command, callback) {
        console.log("Eseguo comando locale: "+command);
		
        var opts = {};
        
        return auto.local(command, opts, callback);
}

function executeRemoteCommand(host, user, command, callback) {
        console.log("Eseguo comando remoto:" + command);
		
		
        return auto.runWithPromise(host,user, command).then(callback);
}

function executeLocalScript(scriptName, callback) {
     
        console.log("Eseguo script remoto:"+scriptsRemotePath+"/"+scriptName);
		
        var executeCmd  = 'sh ' + scriptsRemotePath + '/' + scriptName;
		
        return auto.runWithPromise(host,user, executeCmd).then(callback)
       
 }

function executeRemoteScript(host, user, nodeName, hostName, templateName, callback) {
        var fileName = auto.renderToTmp(templatePath+"/"+templateName, {nodeName:nodeName,hostName:hostName});
		var fullPathTemplate = scriptsRemotePath + '/' + templateName + '.tmp';
        
        //2.Eseguo l'upload dello script
        return auto.uploadWithPromise(host, user, fileName, fullPathTemplate)
         .then(
            function(){
                console.log("Eseguito upload");
                var cleanCR = "tr -d '\r' < " + fullPathTemplate + " > "+ scriptsRemotePath + '/' + templateName;
                return auto.runWithPromise(host,user, cleanCR);
            })
         .then(
            function(){
                console.log("Rimuovo file temporaneo:"+fullPathTemplate);
                var deleteRemoteTmp = "rm " + fullPathTemplate;
                return auto.runWithPromise(host,user, deleteRemoteTmp)
            })
         .then(
			function() { 
				//3.Eseguo lo script remoto
				console.log("Eseguo script remoto:"+scriptsRemotePath+"/"+templateName);
				var executeCmd  = 'sh ' + scriptsRemotePath + '/' + templateName;
				return auto.runWithPromise(host,user, executeCmd)
			})
         .then(
			function (result) {
				console.log("Eseguito script " + templateName +" :" + result.stdout);
				callback(result);
				//4.Pulisco la tmp locale
			    // return auto.deleteTmp(fileName);
			}
		);
}

function shutdownAgent() {
       killPID(config.pid, function(out){ console.log("Killing in thy name"); console.log(out);});
} 