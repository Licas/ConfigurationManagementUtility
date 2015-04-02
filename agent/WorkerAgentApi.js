var auto = require('automato').init();
var defaultHost = "romva9050113";
var user = "tibcobpm";
var processName = "SOANode-Test";

var templatePath = "./templates";
var scriptsRemotePath = "/home/tibcobpm/scripts/cc";
	
module.exports = {

   
    getAgentStatus: function() {
    },
    getAgentConfig: function() {
    },
    getPIDByName: function(processName, callback) {
        //var cmd = "ps -eo pid,command | grep -v grep | grep " + processName + " | head -1|awk '{print$2}'";
        var cmd = "ps -eo pid,command | grep -v grep | grep " + processName + " | awk '{print$1}'";
    
        return auto.run(host, user, cmd, callback);
    },
    getProcessByPID: function(pid, callback) {
        var cmd = "ps -eo pid,command | grep -v grep | grep " + pid + " | awk '{$1=""; print$0}'"
        
        return auto.run(host, user, cmd, callback);
    },
    
    killPID: function(pid, callback) {
        var killBillCmd = "kill -9 " + pid;
        
        return auto.run(host, user, killBillCmd, callback);
    },
    
    killProcessByName: function(processName, callback) {
        var killBillCmd = "ps  -eo pid,command | grep -v grep | grep " + processName + " | awk '{print$1}' | xargs kill -9"
        
        return auto.run(host, user, killBillCmd, callback);
    },
    executeLocalCommand: function(host, user, command, callback) {
         console.log("Eseguo script remoto:"+scriptsRemotePath+"/"+scriptName);
		
        var executeCmd  = 'sh ' + scriptsRemotePath + '/' + scriptName;
		
        return auto.runWithPromise(host,user, executeCmd)
       
    },
    executeRemoteCommand: function(command, callback) {
    },
    executeLocalScript: function(scriptName, callback) {
     
        console.log("Eseguo script remoto:"+scriptsRemotePath+"/"+scriptName);
		
        var executeCmd  = 'sh ' + scriptsRemotePath + '/' + scriptName;
		
        return auto.runWithPromise(host,user, executeCmd).then(callback)
       
    },
    executeRemoteScript: function(host, user, nodeName, hostName, templateName, callback) {
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
    },
	shutdownAgent: function() {
       
    } 
};