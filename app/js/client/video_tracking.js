require('tracking/build/tracking-min');
import {initGUIControllers} from './color_camera_gui';

const scale = (num, in_min, in_max, out_min, out_max) => {
    return Math.round((num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min);
}

window.startVideoTracking = function() {

    function drawGrid(){
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');

        context.beginPath();
        context.strokeStyle = "red";

        let horizontalPart = canvas.width / window.grid.horizontal;
        let verticalPart = canvas.height / window.grid.vertical;

        //vertical lines to indicate horizontal sections
        for(let i = 0; i < window.grid.horizontal; i++) {
            //ctx.moveTo(x, y);
            context.moveTo((i * horizontalPart),0);
            context.lineTo((i * horizontalPart),canvas.height);
            context.stroke();
        }

        //horizontal lines to indicate vertical sections
        for(let j = 0; j <= window.grid.vertical; j++) {
            //ctx.moveTo(x, y);
            context.moveTo(0,(j * verticalPart));
            context.lineTo(canvas.width,(j * verticalPart));
            context.stroke();
        }

    };

    function highlightTrackedSection(x , y) {

        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');

        let horizontalPart = canvas.width / window.grid.horizontal;
        let verticalPart = canvas.height / window.grid.vertical;

        // scale = (num, in_min, in_max, out_min, out_max)
        let startX = scale(x, 0, canvas.width, 0, grid.horizontal) * horizontalPart;
        let startY = scale(y, 0, canvas.height, 0, grid.vertical) * verticalPart;

        context.fillStyle = 'rgba(255,255,255,0.7)';
        context.fillRect(startX, startY, horizontalPart, verticalPart);
    }

    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    console.log('start tracking');
    tracking.ColorTracker.registerColor('purple', function(r, g, b) {
        var dx = r - 120;
        var dy = g - 60;
        var dz = b - 210;
        if ((b - g) >= 100 && (r - g) >= 60) {
            return true;
        }
        return dx * dx + dy * dy + dz * dz < 3500;
    });
    var tracker = new tracking.ColorTracker(['yellow', 'purple']);
    tracker.setMinDimension(5);
    tracking.track('#video', tracker);
    tracker.on('track', function(event) {
        //console.log(event);
        context.clearRect(0, 0, canvas.width, canvas.height);

        event.data.forEach(function(rect) {
            if (rect.color === 'custom') {
                rect.color = tracker.customColor;
            }
            context.strokeStyle = rect.color;
            context.strokeRect(rect.x, rect.y, rect.width, rect.height);
            context.font = '11px Helvetica';
            context.fillStyle = "#fff";
            context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
            context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);

            highlightTrackedSection(rect.x,rect.y);
            //coordToNote(rect.x,rect.y);
        });
        drawGrid();
        eventsToNotes(event.data);

    });
    initGUIControllers(tracker);
};
