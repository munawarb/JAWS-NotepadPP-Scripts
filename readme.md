# JAWS Scripts For Notepad++

These scripts implement accurate announcement of indentation in Notepad++.

## Installing And Activating

First, download the zip file of the Master branch, or clone this repository. You will get the script binary file along with the source and accompanying Quick Settings files.

Next, copy all files to your JAWS user directory.

Third, open Notepad++ and press JAWSKEY+V.

Fourth, in Notepad++ Settings, check "Announce Indentation (Notepad++ specific behavior)" and click "Ok."

After you do this, as you arrow up and down, JAWS will announce the indentation on a line.

## Issues

Because JAWS sees both a space character and a tab character as a null character, these scripts do not distinguish between indenting by tabs or spaces and will always assume tab indentation.