require('./midi');
require('./video_tracking');
var $ = require('jquery');

$(document).ready(function(){
    console.log("hello");
    $("#videoFile").change(function(){
        var videoFile = 'file://'+$(this)[0]['files'][0].path;
        console.log(videoFile);
        $("#video source").attr('src',videoFile);
        $("#video")[0].load();
        $("#video")[0].currentTime = 0;
        $("#video")[0].play();

        startVideoTracking();
    });


});


