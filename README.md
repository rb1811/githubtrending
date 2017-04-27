Packages you need to install before you start the project 

1.Irrespective of the OS you are using you need to have Python insalled in your system to run this project. If you are using Linux or MAC Python will be preinstalled in your system. So you can skip this step. For Windows platform you need to install Python 

2.Once you have Python installed you need to install Pip. Again depending on the version of Ubuntu and MAC you are using, sometimes they may be preinstalled. You can check whether pip is installed or not by typing this command in your terminal: 

$ pip --version

3. If its installed you can skip this step and move on to step 4. Else type these commands.

$ sudo apt-get install python-pip python-dev build-essential 
$ sudo pip install --upgrade pip  

If you using windows you need to install pip as well. You can follow  this link: https://github.com/BurntSushi/nfldb/wiki/Python-&-pip-Windows-installation

4.Once you have Python and Pip installed, run these two commands:

$pip install flask
$pip install flask_cors

5.Once you have them
open terminal and move to the "Files" directory and run 

$python server.py

Copy the ip address that appears in terminal and paste it in the browser. You are good to go
