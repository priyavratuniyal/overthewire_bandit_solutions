## Level 0:
This level just requires you to use `ssh` to login to their remote server.

`~$ ssh -p 2220 bandit0@bandit.labs.overthewire.org`

## Level 0 ---> Level 1:
Look for the readme file in the home directory

- `~$ cat readme` : get the password for bandit1

## Level 1 ---> Level 2:
This level requires to login to `bandit1` using the password last level

Here there is a single file name `-` which is a special symbol in linux, and used for adding flags for specific options to a command.

- `~$ cat ./-` : get the password for bandit2

## Level 2 ---> Level 3:
There is a file called **spaces in this filename**

- `~$ cat "spaces in this filename"`: get the password


## Level 3 ---> Level 4:
There is a directory **inhere** which has a hidden file `...Hiding-From-You`

- `~$ cd inhere`
- `~$ ls -a`
- `~$ cat ...Hiding-From-You`

## Level 4 ---> Level 5:
There is only one human-readable file, in the **inhere** directory

- `~$ ls -la`
- `~$ file ./*`

bandit4@bandit:~/inhere$ file ./*
./-file00: PGP Secret Sub-key -
./-file01: data
./-file02: data
./-file03: data
./-file04: data
./-file05: data
./-file06: data
./-file07: ASCII text
./-file08: data
./-file09: data

- `~$ cat ./-file07`


## Level 5 ---> Level 6:
We want a file with:
- human-readable
- 1033 bytes in size
- not executable

`~$ du -a -b | grep "1033`:  gives you all the files with 1033 bytes of size

Extra: `~$ file */{.,}* | grep "ASCII text" | grep -v "with very long lines"`: this helps to filter out all the files of type ASCII text


## Level 6 ---> Level 7:
We want a file with:
- owned by user bandit7
- owned by group bandit6
- 33 bytes in size

Interestingly, we have to find the file from all the directories.

`~$ find -type f -user bandit7 -group bandit6 -size 33c` but it will print all the errors for Permission denied.

So we can dump all the errors using 2>/dev/null

`~$ find -type f -user bandit7 -group bandit6 -size 33c 2>/dev/null`

This will give us a file like this:

`./var/lib/dpkg/info/bandit7.password`

## Level 7 ---> Level 8:
We just have to use: `~$ grep "millionth" data.txt`

## Level 8 ---> Level 9:
The file **data.txt** contains the password, which is the only one which occur only once in the file

We need to sort the contents first, as 'uniq' command only works for adjacent duplicates.

`~$ sort data.txt | uniq -u` gives you the unique test