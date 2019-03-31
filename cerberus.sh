#!/bin/bash
if [ -s apps.txt ]
then
     echo "File not empty"
else
     ls /Applications > apps.txt
fi
input="apps.txt"
while IFS= read -r var
do
  sudo spctl --add --label "ApprovedApps" /Applications/"$var"
done < "$input"
sudo spctl --enable --label "ApprovedApps" 
sudo spctl --add --label "DeniedApps" /Applications/Firefox.app
sudo spctl --disable --label "DeniedApps" 

