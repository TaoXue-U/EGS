EGS.LoadImage = function (imgName)
{

	//var img = document.createElement("img");
    //img.id = imgName;
	var img = new Image();
    img.src =  "../../Res/Effects/" + imgName;   
    img.onload = function(){
    	alert("ok");
    }

    img.onerror=function(){
        alert("error");
	}

    img.setAttribute("style", "display:none");
    var body = document.getElementsByTagName("body").item(0);
    body.appendChild(img);
    return img;
};


function requestURLImage(url) {
    
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url + ".jpg", false);
    xmlHttp.send();
    if(xmlHttp.status == 200)
        return ".jpg";

    xmlHttp.open("GET", url + ".png", false);
    xmlHttp.send();
    if(xmlHttp.status == 200)
        return ".png";
    uiAppendLog("Request " + url + " failed!");
    return "";
}

function loadImageSourceFromFile(imageName) {
    var imageObj = document.createElement("img");
    imageObj.id = imageName;
    var suffix = requestURLImage("../../Res/Effects/" + imageName);
    imageObj.onload = function(){

    }
    imageObj.src = "../../Res/Effects	/" + imageName + suffix;
    imageObj.setAttribute("style", "display:none");
    var body = document.getElementsByTagName("body").item(0);
    body.appendChild(imageObj);
    return imageObj;
}