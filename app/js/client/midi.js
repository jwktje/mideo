import WebMidi from 'webmidi'

window.midi = {
    "retrigger" : false,
    "blipMode" : false,
    "blipLength" : 10,
    "captured" : [],
    "output_name" : ""
};
window.midi.noteState = [];

// Enable WebMidi.js
WebMidi.enable(function (err) {

    if (err) {
        console.log("WebMidi could not be enabled.", err);
    }

    // Viewing available inputs and outputs
    //console.log(WebMidi.inputs);
    console.log(WebMidi.outputs);

    // Display the current time
    //console.log(WebMidi.time);

    // Retrieving an output port/device using its id, name or index
    window.midi_out = WebMidi.outputs[0];

    window.midi_outputs = WebMidi.outputs;
    window.midi_outputs_names = WebMidi.outputs.map(function(item){
        return item.name;
    });

    console.log(midi_outputs_names);

    // You can chain most method calls
    midi_out.playNote("C3",1,{velocity:1})
        .stopNote("C3",1, {time: 1000});    // After 1.2 s.

});
const scale = (num, in_min, in_max, out_min, out_max) => {
    return Math.round((num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min);
}


function returnNoteFromCoords(x,y) {
    var canvas = document.getElementById('canvas');

    //Inverse
    let xInverse = canvas.width - x;
    let yInverse = canvas.height - y;

    let noteX = scale(x,0,canvas.width,1,window.grid.horizontal);
    let noteY = scale(y,0,canvas.height,1,window.grid.vertical);

    //Vertical the amount per row. Horizontal notes. But inverse now
    let amountGridMax = window.grid.vertical * window.grid.horizontal;
    let noteCandidate = amountGridMax - ((noteY * window.grid.horizontal) + noteX);
    if(noteCandidate > 127) {
        noteCandidate = 127;
    }
    if(noteCandidate < 0) {
        noteCandidate = 0;
    }
    return noteCandidate;
}

window.setMidiOutputByName = function(name) {
    console.log(name);
    console.log(WebMidi.getOutputByName(name));
    window.midi_out = WebMidi.getOutputByName(name);
    midi_out.playNote("C3",1,{velocity:1})
        .stopNote("C3",1, {time: 1000});    // After 1.2 s.
};

window.eventsToNotes = function(eventData) {

    if(window.midi.retrigger) {
        //Retrigger version plays whatever comes in, sequentially
        eventData.forEach(function(rect){
            let noteToPlay = returnNoteFromCoords(rect.x,rect.y);
            //console.log(noteToPlay);
            if (typeof window.midi.previousNote !== "undefined") {
                midi_out.stopNote(window.midi.previousNote,1);
            }
            if(window.midi.blipMode) {
                midi_out.playNote(noteToPlay, 1, {velocity: 1})
                    .stopNote(noteToPlay,1, {time: WebMidi.time + window.midi.blipLength});
            } else {
                midi_out.playNote(noteToPlay, 1, {velocity: 1});
                window.midi.previousNote = noteToPlay;
            }
        })

    } else {
        //Non retrigger version handles state per section.
        let newNotesCandidates = []; //List of new notes to start

        eventData.forEach(function(rect) {
            let noteCandidate = returnNoteFromCoords(rect.x,rect.y);
            //Add it if its not a double track event in the same section
            if(newNotesCandidates.indexOf(noteCandidate) == -1) {
                newNotesCandidates.push(noteCandidate); //Save as new note to play
            }
        });
        //console.log(newNotesCandidates);

        //Things go okay above here

        let newNoteState = [];
        let newNoteBlacklist = [];
        //Now we have an array of new notes newNotesCandidates
        window.midi.noteState.forEach(function(note,index){
            if(newNotesCandidates.indexOf(note) == -1) {
                //Note in old state is not in newly tracked data. So playing stop it
                //console.log("stop: ",note);
                midi_out.stopNote(note,1);
            } else {
                //console.log("blacklist: ",note);
                //Note in old state is in newly tracked data. So it was started before. Prevent retrigger!
                newNoteBlacklist.push(note); //Add to blacklist of notes to play
                newNoteState.push(note); //Add again to new state, as it was there again.
            }
        });

        newNotesCandidates.forEach(function(note){
            /*
            console.log(note);
            console.log(newNoteBlacklist);
             */

            if(newNoteBlacklist.indexOf(note) == -1) {
                //So, if the note isn't in the blacklist.
                //console.log("start: ",note);
                //console.log(midi_out);
                if(window.midi.blipMode) {
                    midi_out.playNote(note, 1, {velocity: 1})
                        .stopNote(note, 1, {time: WebMidi.time + window.midi.blipLength});
                    console.log(window.midi.blipLength);
                } else {
                    midi_out.playNote(note, 1, {velocity: 1});
                }
                newNoteState.push(note);
            } else {
                //If it is in the blacklist
                //Don't retrigger this note!
                //console.log("prevented: ",note);
            }
        });

        window.midi.noteState = newNoteState;
        //console.log(midi.noteState);
    }

};
