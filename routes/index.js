var express = require('express');
var router = express.Router();

var http = require('http');

function GetPageService(name, observer) {
    this.name = name;
    this.observer = observer;
    this.http = http;
}

GetPageService.prototype.getPage = function(url) {
    var options = {
        host: url,
	path: '/'
    };
    response_processor = this;
    this.http.get(options, function(response) {
        response_processor.processResponse(response); 
    });
};

GetPageService.prototype.processResponse = function(response) {
    console.log("running callback generated by GetPageService Object called "+this.name+" that will call the observer:" + this.observer.name);
    var str = '';
    response.on('data', function (chunk) {
        str += chunk;
    });

    observer = this.observer;
    response.on('end', function () {
        console.log(str);
        observer.getPageSuccess(str);
    });
};


function GetPageController(name, response) {
    this.name = name;
    this.response = response;
    this.getPageSuccess = function(page) {
         this.response.send('Hello, obtained page: ' +  page);
    };
}

router.get('/', function(req, res, next) {
    var observer = new GetPageController("controller pedro", res);
    var service = new GetPageService("service juan", observer);
    service.getPage("www.example.com");
});

module.exports = router;
