Righteous Barrage - By Andrew Castillo
------------------------------------------

Instructions:
Aim the Howitzer with the mouse. Click to set azimuth and elevation.
Try and hit the targets given by your spotter. 
The closer your shot hits, the more enemy lives you claim.
Eliminate as many hostiles as possible within 60 seconds.

Development
--------------------------------------------
For this game I focused more on graphics than gameplay. I wanted to make something that had a somewhat realistic look to it.
I built simple models in Blender and rendered them out as sprites. Depending on the howitzer's elevation, a sprite with the corresponding
barrel position is used.

The code was not particularly difficult for this game, and I didn't have any major issues. Probably the hardest part was figuring out
how to wrap angles that went above or below the 0-360 range. I found a function on the Unity Answers site and translated it into Javascript to
solve this problem. It is also somewhat irritating having to re-write basic mathematical functions for every project, such as clamp() since
p5.js does not have them.

Overall, I spent less time on this project compared to previous ones due to other assignments taking up my time. I would have liked to add more
polish to the game such as effects and music.