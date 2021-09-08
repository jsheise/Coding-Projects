I had some issues getting mongo commands to work in Git Bash, but figured it out as illustrated by the below:

The main issue was that I preferred to install Mongo on my DATA drive, since my OS drive was running low.
Hence, I modified the install path, so it was later important to supply the --dbpath flag when running mongod.
The other issue is that since I am used to the Linux CLI, I have been using Git Bash. However, this was problematic because Git Bash was not set up to recognize the "mongo" and "mongod" commands. Hence, I got "command not found when attempting to use them.
I am not sure if adjusting the Windows environment variables aided the situation or not, but what certainly ended up working was creating aliases for Git Bash.
In other words, I'm fairly certain Git Bash does not rely on Windows Environment Variables for commands.

*****

This page was helpful in making sure Git Bash aliases were set up properly, and the second reply noted the --dbpath flag, which was beneficial since I installed on D:/ instead of C:/. 
https://teamtreehouse.com/community/how-to-setup-mongodb-on-windows-cmd-or-gitbash-with-shortcuts

*****

cd ~
code .bashrc

alias mongod="\"D:/mongodb/bin/mongod.exe\""\ "--dbpath=D:/data/db";
alias mongo="D:/mongodb/bin/mongo.exe"

on next bash terminal open, warning regarding no bash_profile, but automatically resolves.