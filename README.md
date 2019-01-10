# Mideo 📹🎶

A Mac application that turns videos into music. It uses color tracking in combination with a grid to generate Midi.
It's based on Electron and currently only tested (and built) on Mac OS Mojave.

This is a prototype that is distributed without any waranty. 
Feel free to file an issue though if you test it and find something wacky.
### How to use: ✨
1. Download the application from the **Releases** tab
2. Run it on a Mac computer
3. Open an h264/MP4 file as the video
4. (optionally) change some parameters in the menu
5. Select a Midi Output
6. Success! The app should now be outputting Midi generated from the video file

### Parameters ✨
**Colors:**

Check the colors you want to track. Custom allows an additional HEX value to be tracked.


**Tracking parameters:**

Set the **minimal dimension** and the **minimal group size** that needs to occur for a group of coloured pixels to be seen as a track event. You can tweak these to get fitting color tracking results for your specific input video.


**Grid:**

Set the size of the grid that is used for Midi output. The grid generates notes from bottom-to-top and left-to-right. Going from 0 up to 127.
Anything above 127 outputs as 127.

**Midi:**

**Retrigger** means that every tracking event results in a note. This is turned off by default. When retrigger is off the app only sends a note-off once a specific cell on the grid is no longer active. Polyphony can occur with retrigger off. With retrigger turned on, it will turn off the previous note before starting a new one. Making it (hectic) monophonic output.

**Blip mode** is used to automatically output note-off for a generated note after the **blipLength** in milliseconds has occured.

**output_name** is a dropdown allowing you to set where the Midi needs to be outputted to. 


### Virtual Midi bus ✨
To use Mideo locally and send data to a DAW directly, you can use a virtual Midi bus.
An example on how to use these with Ableton on a Mac can be found here:

https://help.ableton.com/hc/en-us/articles/209774225-Using-virtual-MIDI-buses
