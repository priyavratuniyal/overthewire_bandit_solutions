## Level 0:
This level just requires you to use `ssh` to login to their remote server.

`~$ ssh -p 2220 bandit0@bandit.labs.overthewire.org`

Look for the readme file in the home directory

- `~$ cat readme` : get the password for bandit1

## Level 0 ---> Level 1:
This level requires to login to `bandit1` using the password last level

Here there is a single file name `-` which is a special symbol in linux, and used for adding flags for specific options to a command.

- `~$ cat ./-` : get the password for bandit2

## Level 1 ---> Level 2
There is a file called **spaces in this filename**

- `~$ cat "spaces in this filename"`: get the password