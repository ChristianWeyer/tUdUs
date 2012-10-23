For the Android project, the www folder from the TodoWebApp folder needs to be linked to the assets folder.

MacOSX:
go to the assets folder in Terminal and type:
ln -s ../../../TodoWebApp/www/ www

Windows:
open a console and type:
mklink /D c:\pathtoproject\Todo.Apps\Android\assets\www c:\pathtoproject\TodoWebApp\www
