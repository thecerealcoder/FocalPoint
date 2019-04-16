//Prompt user for administrator privileges
/*var sudo = require('sudo-prompt');
var options = {
  name: 'sudo',
};

sudo.exec('', options,
  function(error, stdout, stderr) {
    if (error) throw error;
  }
);
*/

//Setup winreg
var Registry = require('winreg');

//Setup readline 
const readline = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout
})

main();

function main() {

var regKey  = 

{
	explorerKey: "\\Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\Explorer",
	disallowKey: "\\Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\Explorer\\DisallowRun",
};

	createReg(regKey.explorerKey);
	createReg(regKey.disallowKey);
}

//Function to create different registries
function createReg(path) {
		var reg = new Registry ({
		hive: Registry.HKCU,
		key: path
	});

	reg.create(function (err){
	if (err) console.log('ERROR: '+err);
});

	if(path == "\\Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\Explorer") {
		setKeyVal(reg);
	} else if(path == "\\Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\Explorer\\DisallowRun"){
		recursiveRead(reg);
	}
}

//Create DisallowRun Value in Explorer Key
function setKeyVal(reg) {
	reg.set("DisallowRun","REG_DWORD","1", function (err){
	if (err) console.log(err);
});
}

//Prompt user input for programs to block and then create them as Disallow Key Values
function recursiveRead(reg) {
	var count = 0;
		reg.values(function (err, items) {
			if (err) console.log(err);
			if(items == undefined) { 
				count = 0;
			} else {
				count = items.length;
				count++;
			}
		});

	readline.question("Enter 1 to block a program or 2 to unblock a program. Enter 0 to exit.\n", (option) => {
		if(option == "0") {
			return readline.close();
		} else if (option == "1" || option == "2") {
			appPermissions(reg, count, option);
		} else {
			console.log("Please enter a valid input.");
			recursiveRead(reg);
		}
	});
};

//Lets user choose whether to block or unblock program
function appPermissions (reg, count, option) {
	if(option == "1"){
		readline.question("Please enter the name of a program you want to block, including the .exe extension. Enter 0 to return to main menu.\n", (name) => {
			if(name == "0") recursiveRead(reg);
			blockApp(reg, count, name);
			recursiveRead(reg);
		});
	} else if (option =="2") {
		readline.question("Please enter the name of a program you want to unblock, including the .exe extension. Enter 0 to return to main menu.\n", (name) => {
			if(name == "0") recursiveRead(reg);
			unblockApp(reg,name);
			recursiveRead(reg);
		});
	}
}

function blockApp (reg, count, name) {
	reg.set(count,"REG_SZ",name, function (err){
		if (err) console.log('ERROR: '+err);
	});
}

//Iterates through blocked program list to unblock desired application
function unblockApp (reg, name) {
	reg.values(function (err, items) {
		if (err) console.log(err);
		items.forEach(element => {
			if(element.value == name) {
				reg.remove(element.name, function(err) {
					if(err) console.log(err);
				});
			}
		});
	});
}

