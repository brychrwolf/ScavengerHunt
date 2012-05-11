accountDetails = {'id': 1, 'email': 'anon', 'password': 'anon'}
objectives = {}
current_objective = ""

NEW_HUNT_HOUR = (12 + 6)
PREVIEW_SIZE = 0
DEFAULT_LIST = 'thing'
TYPE_COLOR = {
	'thing': 'red',
	'action': 'green',
	'describe': 'blue'
}

$(function(){
	$('#signin_submit').click(function(){ processLogin() })
	$('#library_submit').click(function(){ processUpload() })
	$('a[href *= #home]').click(function(){ updateObjectives() })
	$('img.objective').click(function(){
		switch($(this).attr('id')){
			case 'thing_image': populateObjectiveList('thing'); break;
			case 'action_image': populateObjectiveList('action'); break;
			case 'describe_image': populateObjectiveList('describe'); break;
		}
	})
	updateTimer('.new_hunt_timer', NEW_HUNT_HOUR)
	// Move the camera button down until hunt view redesign is possible
	$('a[href *= #camera]').addClass('moveDownAndGray')
})

function processLogin(){
	$.post('scripts/process_login.php', {email: $('#signin_email').val(), password: $('#signin_password').val()}, function(xml){
		if($('email', xml).text() != 'unconfirmed'){
			accountDetails.email = $('email', xml).text()
			accountDetails.password = $('password', xml).text()
			updateAppWithAccountDetails()
		}
	})
}

/* Slightly altered AJAX code borrowed from http://wabism.com/html5-file-api-how-to-upload-files-dynamically-using-ajax/ */
function processUpload() {
    console.log("entered processUpload()")
	//*
	uploaded_image.src = "images/loading.gif"
	
	// Retrieve the FileList object from the referenced element ID
	myFileList = library_input.files;
 
	// Grab the first File Object from the FileList
	myFile = myFileList[0];
 
	// Set some variables containing the three attributes of the file
	myFileName = myFile.name;
	myFileSize = myFile.size;
	myFileType = myFile.type;
 
	// Alert the information we just gathered
	//alert("FileName: " + myFileName + "- FileSize: " + myFileSize + " - FileType: " + myFileType);
	console.log("FileName: " + myFileName + "- FileSize: " + myFileSize + " - FileType: " + myFileType)
 
	// Let's upload the complete file object
	uploadFile(myFile);
}

function uploadFile(myFileObject) {
    console.log("entered uploadFile()")
	// Open Our formData Object
	formData = new FormData();
 
	// Append our file to the formData object
	// Notice the first argument "file" and keep it in mind
	formData.append('my_uploaded_file', myFileObject);
	
	//*
	formData.append('user_id', accountDetails.id);
	formData.append('objective_id', current_objective);
 
	// Create our XMLHttpRequest Object
	xhr = new XMLHttpRequest();
 
	// Open our connection using the POST method
	xhr.open("POST", 'scripts/process_upload.php');

    //*
    //xhr.upload.addEventListener("loadstart", loadStartFunction, false);  
	xhr.upload.addEventListener("progress", progressFunction, false);  
    xhr.upload.addEventListener("load", transferCompleteFunction, false); 

	// Send the file
	xhr.send(formData)
	
	//*
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4){
			console.log("responseText = "+xhr.responseText)
			console.log("responseXML = "+xhr.responseXML)
			console.log("status = "+xhr.status)
			
			newUploadedImageName = $('file_name', xhr.responseXML).text()
			uploaded_image.src = "images/uploads/"+newUploadedImageName
		}
	}
}

//  Slightly altered code borrowed from http://www.sagarganatra.com/2011/04/file-upload-and-progress-events-with.html
function progressFunction(evt){
	progressBar = document.getElementById("library_progress_bar");  
	percentageDiv = document.getElementById("library_percentage_calc");  
	if (evt.lengthComputable) {  
		progressBar.max = evt.total;  
		progressBar.value = evt.loaded;  
		percentageDiv.innerHTML = Math.round(evt.loaded / evt.total * 100) + "%";  
	}  
 }
 
 function transferCompleteFunction(){
    console.log("entered transferCompleteFunction()")
	PROWEBAPPS.ViewManager.activate('uploadComplete')
	clearUploadForms()
 }
 
 function clearUploadForms(){
    console.log("entered clearUploadForms()")
	$('#library_progress_bar').attr('value', 0)
	$('#library_percentage_calc').html("")
	$('#library_input').replaceWith("<input type=\"file\" id=\"library_input\" />")
 }

function updateAppWithAccountDetails(){
	$('#accountLink').html(accountDetails.email + "'s Account Information")
	$('#signin_email').val("")
	$('#signin_password').val("")
	$(".apology").html("I'm sorry, "+accountDetails.email+", but this page is coming soon!")
}

function updateObjectives(){
    console.log("entered updateObjectives()")
	$.post('scripts/get_objectives.php', {}, function(xml){
		$(xml).find("objective").each(function(i){
			objectives[i] = {}
			objectives[i]['id'] = $('id', this).text()
			objectives[i]['type'] = $('type', this).text()
			objectives[i]['name'] = $('name', this).text()
			objectives[i]['date_added'] = $('date_added', this).text()
			objectives[i]['released'] = $('released', this).text()
		})
        populateObjectiveList(DEFAULT_LIST)
	})
}

function populateObjectiveList(type){
	console.log("entered populateObjectiveLists("+type+")")
	
	switch(type){
		case 'thing':
			$('#thing_list').html('')
			hideObjectiveList('#action_list')
			hideObjectiveList('#describe_list')				
			appendLiLink('thing')
			showObjectiveList('#thing_list')
			break;
		case 'action':
			$('#action_list').html('')
			hideObjectiveList('#thing_list')
			hideObjectiveList('#describe_list')			
			appendLiLink('action')
			showObjectiveList('#action_list')
			break;
		case 'describe':
			$('#describe_list').html('')
			hideObjectiveList('#thing_list')			
			hideObjectiveList('#action_list')
			appendLiLink('describe')	
			showObjectiveList('#describe_list')
			break;
	}
}

function appendLiLink(type){
	for(i in objectives){
		if(objectives[i].type == type){
			$('#'+type+'_list').append("<li class=\"objective, "+TYPE_COLOR[type]+"\"><a class=\"changeview\" href=\"#hunt\" id=\""+objectives[i].id+"\">"+objectives[i].name+"</a></li>").click(function(i){
				current_objective = i.srcElement.id
				updateHuntView()
				PROWEBAPPS.ViewManager.activate('hunt')
			})
		}
	}
}

function hideObjectiveList(listId){
	console.log("entered hideObjectiveList("+listId+")")
	$(listId).hide('slow')
}

function showObjectiveList(listId){
	console.log("entered showObjectiveList("+listId+")")
	$(listId).show('slow')
}

function updateHuntView(){
	console.log("entered updateHuntView();")
	for (key in objectives) {
		if (objectives.hasOwnProperty(key)) {
			if(objectives[key].id == current_objective){
				current_key = key
			}
		}
	}	
	$('#hunt_title').html("Hunting Type: \""+objectives[current_key].type.capitalize()+"\"")
	console.log("current_objective = "+objectives[current_key].name)
	$('#hunt_target').html(objectives[current_key].name.capitalize())
	switchClassColorToType($('#hunt_target'), objectives[current_key].type)	
}

function switchClassColorToType(target, type){	
	console.log("entered switchClassColorToType("+type+");")
	for(i in TYPE_COLOR){
		if($(target).hasClass(TYPE_COLOR[i])){
			$('this').removeClass(TYPE_COLOR[i])
		}
	}$(target).addClass(TYPE_COLOR[type])
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function updateTimer(target, updateHour){
	console.log("entered updateTimer()")
	//calc diff from now until 0+freq (in hours)
	now = new Date()	
	nextHuntDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), updateHour, 0, 0, 0)
	seconds = (nextHuntDate.getTime() - now.getTime()) / 1000
	if(seconds < 0) seconds += (60 * 60 * 24)
	timerId = target
	runTimer()
}
 function runTimer(){
	//console.log("entered runTimer(); seconds = "+seconds)	
	hoursLeft = Math.floor(seconds / 3600);
	minutesLeft = Math.floor((seconds - hoursLeft * 3600) / 60);
	secondsLeft = Math.floor(seconds - hoursLeft * 3600 - minutesLeft * 60);
	timeLeft = hoursLeft+"hrs "+minutesLeft+"mins "+secondsLeft+"secs"
	$(timerId).each(function(){
		$(this).html("All new hunts<br />begin in:<br />"+ timeLeft)
	})
	seconds = seconds - 1
	runner = setTimeout("runTimer()",1000);
 }