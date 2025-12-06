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
There is a file called **--spaces in this filename--**

- `~$ cat ./"--spaces in this filename--"`: get the password


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

```
./var/lib/dpkg/info/bandit7.password
```

## Level 7 ---> Level 8:
We just have to use: `~$ grep "millionth" data.txt`

## Level 8 ---> Level 9:
The file **data.txt** contains the password, which is the only one which occur only once in the file

We need to sort the contents first, as 'uniq' command only works for adjacent duplicates.

`~$ sort data.txt | uniq -u` gives you the unique test

## Level 9 ---> Level 10:
We are going to use the 'strings' command to find the human readable string in the **data.txt** file.

`~$ strings data.txt | grep ===`

The result is something like this:
```
bandit9@bandit:~$ strings data.txt | grep ===*
========== the
========== password{k
=========== is
========== FGUW5ilLVJrxX9kMYMmlN4MgbpfMiqey
```

## Level 10 ---> Level 11:
The password for the next level is stored in the file data.txt, which contains base64 encoded data

`~$ base64 --decode data.txt`: get the password

## Level 11 ---> Level 12:
The password for the next level is stored in the file data.txt where all the uppercase and lowercase characters are rotated by 13 position.

We'll be using `tr` command for this. `tr` stands for translate.

`~$ tr 'A-Za-z' 'N-ZA-Mn-za-m' < data.txt` : gives us the password

```
bandit11@bandit:~$ cat data.txt
Gur cnffjbeq vf 7k16JArUVv5LxVuJfsSVdbbtaHGlw9D4

bandit11@bandit:~$ tr 'A-Za-z' 'N-ZA-Mn-za-m' < data.txt
The password is 7x16WNeHIi5YkIhWsfFIqoognUTyj9Q4
```

_Note: Look carefully, the digits are the same only the alphabets are rotated. This is because for digits, we use something like ROT5 ciper, while the ROT13 ciper works on latin alphabet._

## Level 12 ---> Level 13:
This is an interesting level.

There is a __data.txt__ file with the password. It is actually the hex-dump of a file that is compressed multiple times.

```
�hȔ'�7<bandit12@bandit:~$ ls -ls
total 4
4 -rw-r----- 1 bandit13 bandit12 2581 Oct 14 09:26 data.txt

bandit12@bandit:~$ xxd -r data.txt
�h�@щ��AFM�@ё�h���h��2�i���&�������#C�40�h����hh�hhh�L�M���0�� 2h��h4b4�hi��z�@�����4
                                                                  �d��h`5A,���{�G��i0�P��d�@1/KȰ
                                                                                                �l�ת3j폻{�?�DX�N����a.�'������-hf��'Tu�9
                                                                                                                                        ��x(F����C��9z��#*ڛ�M�]J��2䔮�'�0�S<f�`��Fp�2+qt��R��
&{qe �w��"�35OƎ����Z
�hȔ'�7<

bandit12@bandit:~$ 
```

We can see this in the binary form now.

The level suggests us to make a temp directory using `mktemp -d` and copying our __data.txt__ file there, because it's easier to work with one, as it would involve extracting files many times.

```
bandit12@bandit:~$ mktemp -d
/tmp/tmp.dZ6dtZJKkp

bandit12@bandit:~$ cd /tmp/tmp.dZ6dtZJKkp

bandit12@bandit:/tmp/tmp.dZ6dtZJKkp$ cp ~/data.txt .
```


```
bandit12@bandit:/tmp/tmp.dZ6dtZJKkp$ ls -l
total 8
-rw-r----- 1 bandit12 bandit12 2581 Oct 29 04:33 data.txt

bandit12@bandit:/tmp/tmp.dZ6dtZJKkp$ cat data.txt | head
00000000: 1f8b 0808 2817 ee68 0203 6461 7461 322e  ....(..h..data2.
00000010: 6269 6e00 013c 02c3 fd42 5a68 3931 4159  bin..<...BZh91AY
00000020: 2653 59cc 46b5 2d00 0018 ffff da5f e6e3  &SY.F.-......_..
00000030: 9fcd f59d bc69 ddd7 f7ff a7e7 dbdd b59f  .....i..........
00000040: fff7 cfdd ffbf bbdf ffff ff5e b001 3b58  ...........^..;X
00000050: 2406 8000 00d0 6834 6234 d000 6869 9000  $.....h4b4..hi..
00000060: 1a7a 8003 40d0 01a1 a006 8188 340d 1a68  .z..@.......4..h
00000070: d340 d189 e906 8f41 0346 4d94 40d1 91a0  .@.....A.FM.@...
00000080: 681a 0681 a068 0680 c400 3207 a269 a189  h....h....2..i..
00000090: a326 8000 c800 c81a 1883 1000 00d0 c023  .&.............#
```

Cool __data.txt__ is actually a hex dump.

Trick is, we rename the file to something without extentsion. Why? because when we convert the hex-dump to binary again, we don't want to presume the file type.


```
bandit12@bandit:/tmp/tmp.dZ6dtZJKkp$ mv data.txt hexdump_data

bandit12@bandit:/tmp/tmp.dZ6dtZJKkp$ file hexdump_data 
hexdump_data: ASCII text

bandit12@bandit:/tmp/tmp.dZ6dtZJKkp$ xxd -r hexdump_data compressed_data

bandit12@bandit:/tmp/tmp.dZ6dtZJKkp$ ls -l
total 8
-rw-rw-r-- 1 bandit12 bandit12  605 Oct 29 04:35 compressed_data
-rw-r----- 1 bandit12 bandit12 2581 Oct 29 04:33 hexdump_data

bandit12@bandit:/tmp/tmp.dZ6dtZJKkp$ file compressed_data 
compressed_data: gzip compressed data, was "data2.bin", last modified: Tue Oct 14 09:26:00 2025, max compression, from Unix, original size modulo 2^32 572
```

See, the new __compressed_data__ file is not a text file in itself. It is a gzip file (i.e. a file that is compressed by the gzip algo)

Now here's a main issue with `.gz` type file. For decompression, you need to rename it.

But for files `.bz` or `.tar` it is not the issue, and we can decompress them as is.

From now on, we'll try to decompress the files __(using different algos as per the file type)__ until we get the password.
```
bandit12@bandit:/tmp/tmp.dZ6dtZJKkp$ mv compressed_data compressed_data.gz

bandit12@bandit:/tmp/tmp.dZ6dtZJKkp$ gzip -d compressed_data.gz 

bandit12@bandit:/tmp/tmp.dZ6dtZJKkp$ ls -l
total 8
-rw-rw-r-- 1 bandit12 bandit12  572 Oct 29 04:35 compressed_data
-rw-r----- 1 bandit12 bandit12 2581 Oct 29 04:33 hexdump_data

bandit12@bandit:/tmp/tmp.dZ6dtZJKkp$ file compressed_data 
compressed_data: bzip2 compressed data, block size = 900k

bandit12@bandit:/tmp/tmp.dZ6dtZJKkp$ mv compressed_data compressed_data.bz

bandit12@bandit:/tmp/tmp.dZ6dtZJKkp$ ls -ltr
total 8
-rw-r----- 1 bandit12 bandit12 2581 Oct 29 04:33 hexdump_data
-rw-rw-r-- 1 bandit12 bandit12  572 Oct 29 04:35 compressed_data.bz

bandit12@bandit:/tmp/tmp.dZ6dtZJKkp$ bzip2 compressed_data.bz -d

bandit12@bandit:/tmp/tmp.dZ6dtZJKkp$ ls -l
total 8
-rw-rw-r-- 1 bandit12 bandit12  434 Oct 29 04:35 compressed_data
-rw-r----- 1 bandit12 bandit12 2581 Oct 29 04:33 hexdump_data

bandit12@bandit:/tmp/tmp.dZ6dtZJKkp$ file compressed_data 
compressed_data: gzip compressed data, was "data4.bin", last modified: Tue Oct 14 09:26:00 2025, max compression, from Unix, original size modulo 2^32 20480

bandit12@bandit:/tmp/tmp.dZ6dtZJKkp$ mv compressed_data compressed_data.gz

bandit12@bandit:/tmp/tmp.dZ6dtZJKkp$ gzip -d compressed_data.gz 

bandit12@bandit:/tmp/tmp.dZ6dtZJKkp$ ls -l
total 24
-rw-rw-r-- 1 bandit12 bandit12 20480 Oct 29 04:35 compressed_data
-rw-r----- 1 bandit12 bandit12  2581 Oct 29 04:33 hexdump_data

bandit12@bandit:/tmp/tmp.dZ6dtZJKkp$ file compressed_data 
compressed_data: POSIX tar archive (GNU)

bandit12@bandit:/tmp/tmp.dZ6dtZJKkp$ tar xvf compressed_data
data5.bin

bandit12@bandit:/tmp/tmp.dZ6dtZJKkp$ ls -l
total 36
-rw-rw-r-- 1 bandit12 bandit12 20480 Oct 29 04:35 compressed_data
-rw-r--r-- 1 bandit12 bandit12 10240 Oct 14 09:26 data5.bin
-rw-r----- 1 bandit12 bandit12  2581 Oct 29 04:33 hexdump_data

bandit12@bandit:/tmp/tmp.dZ6dtZJKkp$ file data5.bin 
data5.bin: POSIX tar archive (GNU)

bandit12@bandit:/tmp/tmp.dZ6dtZJKkp$ mv data5.bin data5.bin

bandit12@bandit:/tmp/tmp.dZ6dtZJKkp$ tar xvf data5.bin data6.bin

bandit12@bandit:/tmp/tmp.dZ6dtZJKkp$ ls -l
total 40
-rw-rw-r-- 1 bandit12 bandit12 20480 Oct 29 04:35 compressed_data
-rw-r--r-- 1 bandit12 bandit12 10240 Oct 14 09:26 data5.bin
-rw-r--r-- 1 bandit12 bandit12   219 Oct 14 09:26 data6.bin
-rw-r----- 1 bandit12 bandit12  2581 Oct 29 04:33 hexdump_data

bandit12@bandit:/tmp/tmp.dZ6dtZJKkp$ file data6.bin 
data6.bin: bzip2 compressed data, block size = 900k

bandit12@bandit:/tmp/tmp.dZ6dtZJKkp$ bzip2 data6.bin -d
bzip2: Can't guess original name for data6.bin -- using data6.bin.out

bandit12@bandit:/tmp/tmp.dZ6dtZJKkp$ ls -l
total 48
-rw-rw-r-- 1 bandit12 bandit12 20480 Oct 29 04:35 compressed_data
-rw-r--r-- 1 bandit12 bandit12 10240 Oct 14 09:26 data5.bin
-rw-r--r-- 1 bandit12 bandit12 10240 Oct 14 09:26 data6.bin.out
-rw-r----- 1 bandit12 bandit12  2581 Oct 29 04:33 hexdump_data

bandit12@bandit:/tmp/tmp.dZ6dtZJKkp$ file data6.bin.out 
data6.bin.out: POSIX tar archive (GNU)

bandit12@bandit:/tmp/tmp.dZ6dtZJKkp$ tar xvf data6.bin.out
data8.bin

bandit12@bandit:/tmp/tmp.dZ6dtZJKkp$ ls -l
total 52
-rw-rw-r-- 1 bandit12 bandit12 20480 Oct 29 04:35 compressed_data
-rw-r--r-- 1 bandit12 bandit12 10240 Oct 14 09:26 data5.bin
-rw-r--r-- 1 bandit12 bandit12 10240 Oct 14 09:26 data6.bin.out
-rw-r--r-- 1 bandit12 bandit12    79 Oct 14 09:26 data8.bin
-rw-r----- 1 bandit12 bandit12  2581 Oct 29 04:33 hexdump_data

bandit12@bandit:/tmp/tmp.dZ6dtZJKkp$ file data8.bin 
data8.bin: gzip compressed data, was "data9.bin", last modified: Tue Oct 14 09:26:00 2025, max compression, from Unix, original size modulo 2^32 49

bandit12@bandit:/tmp/tmp.dZ6dtZJKkp$ mv data8.bin data8.bin.gz

bandit12@bandit:/tmp/tmp.dZ6dtZJKkp$ gzip -d data8.bin.gz 

bandit12@bandit:/tmp/tmp.dZ6dtZJKkp$ ls -l
total 52
-rw-rw-r-- 1 bandit12 bandit12 20480 Oct 29 04:35 compressed_data
-rw-r--r-- 1 bandit12 bandit12 10240 Oct 14 09:26 data5.bin
-rw-r--r-- 1 bandit12 bandit12 10240 Oct 14 09:26 data6.bin.out
-rw-r--r-- 1 bandit12 bandit12    49 Oct 14 09:26 data8.bin
-rw-r----- 1 bandit12 bandit12  2581 Oct 29 04:33 hexdump_data

bandit12@bandit:/tmp/tmp.dZ6dtZJKkp$ file data8.bin 
data8.bin: ASCII text

bandit12@bandit:/tmp/tmp.dZ6dtZJKkp$ cat data8.bin | head
The password is FO5dwFsc0cbaIiH0h8J2eUks2vdTDwAn
```


## Level 13 ---> Level 14
The password for the next level is stored in /etc/bandit_pass/bandit14 and can only be read by user bandit14.

So this level doesn't have any password.

It does have a private key though. Which means I can login to `bandit14` level just by using that ssh-key.

Issue is, that the key is right now in `bandit13` so we need to copy it to our machine using `scp`

```
priyavrat@New-Bro-ThinkPad-P16v:~/Downloads$ scp -P 2220 bandit13@bandit.labs.overthewire.org:sshkey.private .
                         _                     _ _ _   
                        | |__   __ _ _ __   __| (_) |_ 
                        | '_ \ / _` | '_ \ / _` | | __|
                        | |_) | (_| | | | | (_| | | |_ 
                        |_.__/ \__,_|_| |_|\__,_|_|\__|
                                                       

                      This is an OverTheWire game server. 
            More information on http://www.overthewire.org/wargames

backend: gibson-0
bandit13@bandit.labs.overthewire.org's password: 
sshkey.private                                                                                100% 1679     2.8KB/s   00:00    
priyavrat@personal-pc:~/Downloads$ ls -ltr
total 1296
-rwx------ 1 priyavrat priyavrat    1679 Oct 29 22:55 sshkey.private
```

So now we have the private key so let's use that to ssh login into bandit14.

But before let's change the permission, to reduce them a bit using `chmod 700`.

```
priyavrat@personal-pc:~/Downloads$ chmod 700 sshkey.private 
priyavrat@personal-pc:~/Downloads$ ssh -i sshkey.private bandit14@bandit.labs.overthewire.org -p 2220
                      
                      This is an OverTheWire game server.
bandit14@bandit:~$ 

```

Cool, we're in!

## Level 14 ---> Level 15
The password for the next level can be retrieved by submitting the password of the current level to port 30000 on localhost.

Now we are entering in the nterworking zone slowly.

So here we'll use `nc` (netcat) command to do this.

```
bandit14@bandit:~$ cat /etc/bandit_pass/bandit14 | nc 127.0.0.1 30000
Correct!
8xCjnmgoKbGLhHFAZlGE5Tmu4M2tKJQo
```

By the way, `bandit14`'s password is simply by doing:

```
bandit14@bandit:~$ cat /etc/bandit_pass/bandit14
MU4VWeTyJk8ROof1qqmcBPaLh7lDCPvS
```

## Level 15 ---> Level 16
The password for the next level can be retrieved by submitting the password of the current level to port 30001 on localhost using SSL/TLS encryption.

So, for this level I learned about SSL (Secure socket layer) and TLS(Transport Layer Security) and `sym` and `asym` encryption, and why do we need `certificates`. (refer Man-in-middle attacks)

[YT video on SSL Certificate](https://www.youtube.com/watch?v=0yw-z6f7Mb4&pp=ygUHc3NsIHRscw%3D%3D)

So, earlier I thought, I have to encrypt a password using `openssl` and then I can just send it over to the localhost on port 30001. But then I realised that I have to open a secure connection instead and then send the password over it to the host and the port.

Here's how it's done:

```
bandit15@bandit:~$ openssl s_client -connect 127.0.0.1:30001
...

8xCjnmgoKbGLhHFAZlGE5Tmu4M2tKJQo
Correct!
kSkvUpMQ7lBYyCM4GBPvCvT1BfWRy0Dx

closed
```

## Level 16 ---> Level 17
Getting the password on this level is a bit tricky. Not in terms of the actual solution, but in general figuring out the unexpected errors (that shouldn't have been part of the game).

We have to find a (single) port in the range 31000-32000 that has SSL/TLS encryption and is not 'just echoing what I say to it'.

For that requirement, we have `nmap`.

```
bandit16@bandit:~$ nmap -sV -p 31000-32000 localhost
Starting Nmap 7.94SVN ( https://nmap.org ) at 2025-11-01 07:20 UTC
Nmap scan report for localhost (127.0.0.1)
Host is up (0.00016s latency).
Not shown: 996 closed tcp ports (conn-refused)
PORT      STATE SERVICE     VERSION
31046/tcp open  echo
31518/tcp open  ssl/echo
31691/tcp open  echo
31790/tcp open  ssl/unknown
31960/tcp open  echo
```

We can see that only one port `31790` fullfil our requirement.

```
bandit16@bandit:~$ mktemp -d
/tmp/tmp.dZ6dtZJKkp
bandit16@bandit:~$ cd /tmp/tmp.dZ6dtZJKkp
bandit16@bandit:/tmp/tmp.dZ6dtZJKkp$ openssl s_client -ign_eof localhost:31790 > output
....

<entered the pass of level 16>

....

<got the private key for level 17 :) >
```

The private key would look something like this:

```
-----BEGIN RSA PRIVATE KEY-----

<content of the key>

-----END RSA PRIVATE KEY-----

```

Now just like in `Level 13 --> 14` where we copied the private file to our own system, we would copy this `output` file, extract the private key and use it with `ssh` to login to `bandit17`.

__NOTE__: There exists an issue, where you have to add a new-line `\n` at the end of the private key.

_Link to the issue_: [Load key "...": error in libcrypto](https://maxrohde.com/2025/08/16/fix-error-in-libcrypto-error-reading-private-ssh-key/#:~:text=I%20simply%20needed%20to%20add%20a%20newline,loading%20ssh%20key%20from%20an%20environment%20variable.)


## Level 17 ---> Level 18
This is a rather simple level. We need to find the password by finding the difference between the two files in home directory.

```
bandit17@bandit:~$ ls -ltr
total 8
-rw-r----- 1 bandit18 bandit17 3300 Oct 14 09:26 passwords.old
-rw-r----- 1 bandit18 bandit17 3300 Oct 14 09:26 passwords.new

bandit17@bandit:~$ diff -q passwords.old passwords.new 
Files passwords.old and passwords.new differ

bandit17@bandit:~$ diff -d passwords.old passwords.new 
42c42
< BMIOFKM7CRSLI97voLp3TD80NAq5exxk
---
> x2gLTTjFwMOhQ8oWNbMN362QKxfRqGlO

```

The __latter__ is our password for level 18.

## Leve 18 ---> Level 19
The password for the next level is stored in a file readme in the homedirectory. Unfortunately, someone has modified .bashrc to log you out when you log in with SSH.

So, when we login, we can't stay there, it auto logout us.

What we can do though is copying the readme file to our local.

```
priyavrat@New-Bro-ThinkPad-P16v:~$ scp -P 2220 bandit18@bandit.labs.overthewire.org:readme .
....

                      This is an OverTheWire game server. 
            More information on http://www.overthewire.org/wargames

backend: gibson-0
bandit18@bandit.labs.overthewire.org's password: 
readme                                                                                                                                                      100%   33     0.1KB/s   00:00    

```
Cool, we got the file, we need to just open it, and there's our password for the next level :)

__NOTE__: Alternate way of doing this is, and I didn't knew this, I saw someone else's solution. You can execute commands with `ssh`.

```
priyavrat@New-Bro-ThinkPad-P16v:~$ ssh -p 2220 bandit18@bandit.labs.overthewire.org cat readme
                    
....

                      This is an OverTheWire game server. 
            More information on http://www.overthewire.org/wargames

backend: gibson-0
bandit18@bandit.labs.overthewire.org's password: 
cGWpMaKXVwDUNgPAVJbWYuGHVn9zl3j8

```

## Level 19 ---> Level 20
To gain access to the next level, you should use the setuid binary in the homedirectory. Execute it without arguments to find out how to use it. The password for this level can be found in the usual place (/etc/bandit_pass), after you have used the setuid binary.

__Theory__:
1. First `-` tells us this is a file. `d` for directory
2. First `---` tell us the permission i.e. read|write|execute for the __user__.
3. Second `---` tells perms for the __group__.
4. Third `---` tells perms for __all others__.

The perms can be changed by using `chmod` command.

So basically, `setuid` allows a user to run a program/command like the root user.
For groups, `setgrp` is the alternative.

See closely below, the __execute permission__ is replaced by `s` which tells us that the file can be executed as root user.

```
bandit19@bandit:~$ ls -ltr
total 16
-rwsr-x--- 1 bandit20 bandit19 14884 Oct 14 09:26 bandit20-do
```

So to find, we can just use the above command, and use it to open the bandit20 password file.

```
bandit19@bandit:~$ ./bandit20-do cat /etc/bandit_pass/bandit20
0qXahG8ZjOVMN9Ghs7iOWsCfZyXOUbYO
```


## Level 20 ---> Level 21
There is a setuid binary in the homedirectory that does the following: it makes a connection to localhost on the port you specify as a commandline argument. It then reads a line of text from the connection and compares it to the password in the previous level (bandit20). If the password is correct, it will transmit the password for the next level (bandit21).

For this, we can use the `nc` (netcat) command to start a local server on a port.
```
bandit20@bandit:~$ nc -l 8080
```

Then open another terminal window in the same level and open the binary present.

```
bandit20@bandit:~$ ./suconnect 8080
```

Now just send the present level password to the `nc` server from ___Terminal 1___ via copy-pasting it in the current session.
```
bandit20@bandit:~$ nc -l 8080
0qXahG8ZjOVMN9Ghs7iOWsCfZyXOUbYO
```

We will get the password for the next level from ___Terminal 2___

```
bandit20@bandit:~$ ./suconnect 8080
Read: 0qXahG8ZjOVMN9Ghs7iOWsCfZyXOUbYO
Password matches, sending next password
```

```
bandit20@bandit:~$ nc -l 8080
0qXahG8ZjOVMN9Ghs7iOWsCfZyXOUbYO
EeoULMCra2q0dSkYj561DX7s1CpBuOBt
```

### A Better way to do this? `tmux`
`tmux` is a much better way to do this, where you don't have to open different terminal windows, rather you can just use `tmux`.


## Level 21 ---> Level 22
A program is running automatically at regular intervals from cron, the time-based job scheduler. Look in /etc/cron.d/ for the configuration and see what command is being executed.

```
bandit21@bandit:~$ cd /etc/cron.d

bandit21@bandit:/etc/cron.d$ ls -ltr
total 40
-rw-r--r-- 1 root root 396 Jan  9  2024 sysstat
-rw-r--r-- 1 root root 201 Apr  8  2024 e2scrub_all
-rw-r--r-- 1 root root 123 Oct 14 09:19 clean_tmp
-rw-r--r-- 1 root root 120 Oct 14 09:26 cronjob_bandit22
-rw-r--r-- 1 root root 122 Oct 14 09:26 cronjob_bandit23
-rw-r--r-- 1 root root 120 Oct 14 09:26 cronjob_bandit24
-r--r----- 1 root root  47 Oct 14 09:26 behemoth4_cleanup
-r--r----- 1 root root  48 Oct 14 09:27 leviathan5_cleanup
-rw------- 1 root root 138 Oct 14 09:28 manpage3_resetpw_job
-rwx------ 1 root root  52 Oct 14 09:29 otw-tmp-dir

bandit21@bandit:/etc/cron.d$ cat cronjob_bandit22
@reboot bandit22 /usr/bin/cronjob_bandit22.sh &> /dev/null
* * * * * bandit22 /usr/bin/cronjob_bandit22.sh &> /dev/null

bandit21@bandit:/etc/cron.d$ cat /usr/bin/cronjob_bandit22.sh
#!/bin/bash
chmod 644 /tmp/t7O6lds9S0RqQh9aMcz6ShpAoZKF7fgv
cat /etc/bandit_pass/bandit22 > /tmp/t7O6lds9S0RqQh9aMcz6ShpAoZKF7fgv

bandit21@bandit:/etc/cron.d$ ls -l /tmp/t7O6lds9S0RqQh9aMcz6ShpAoZKF7fgv
-rw-r--r-- 1 bandit22 bandit22 33 Nov  5 14:06 /tmp/t7O6lds9S0RqQh9aMcz6ShpAoZKF7fgv

bandit21@bandit:/etc/cron.d$ cat /tmp/t7O6lds9S0RqQh9aMcz6ShpAoZKF7fgv
tRae0UfB9v0UzbCdn9cY0gQnds9GF58Q
```

Explaining what happened above?

So as suggested I moved to the `/etc/cron.d/` directory. I can see that filnames like `cronjob_bandit <number>` have __read__ permissions.

I opened the `cronjob_bandit22` file, saw that it runs every minute; every day. Now what I can see is, it is executing a `.sh` file.

I opened the `/usr/bin/cronjob_bandit22.sh` and see that it is changing the persmission of a file, and writing password for __bandit22__ in it.

Looking at the permission of the temporary file, I can see that everyone can open it. When opened it gives the password for __level 22__.

## Level 22 ---> Level 23
 program is running automatically at regular intervals from cron, the time-based job scheduler. Look in /etc/cron.d/ for the configuration and see what command is being executed.

 Very similar to the previous level, just the difference is, that we need to look into the `.sh` file to see what is it doing?

```
bandit22@bandit:~$ cd /etc/cron.d

bandit22@bandit:/etc/cron.d$ ls -ls | grep "bandit"
4 -rw-r--r-- 1 root root 120 Oct 14 09:26 cronjob_bandit22
4 -rw-r--r-- 1 root root 122 Oct 14 09:26 cronjob_bandit23
4 -rw-r--r-- 1 root root 120 Oct 14 09:26 cronjob_bandit24

bandit22@bandit:/etc/cron.d$ cat cronjob_bandit23
@reboot bandit23 /usr/bin/cronjob_bandit23.sh  &> /dev/null
* * * * * bandit23 /usr/bin/cronjob_bandit23.sh  &> /dev/null

bandit22@bandit:/etc/cron.d$ cat /usr/bin/cronjob_bandit23.sh
#!/bin/bash

myname=$(whoami)
mytarget=$(echo I am user $myname | md5sum | cut -d ' ' -f 1)

echo "Copying passwordfile /etc/bandit_pass/$myname to /tmp/$mytarget"

cat /etc/bandit_pass/$myname > /tmp/$mytarget
```

So as we see we need to supply the `bandit23` username to kinda get the location/name of the file which the cron job is writing the password to.

___NOTE___: This is just a problem which you look a little bit into, i.e. not that hard, just that spend a little more time and you'll get the way to do it :)

```
bandit22@bandit:/etc/cron.d$ /usr/bin/cronjob_bandit23.sh
Copying passwordfile /etc/bandit_pass/bandit22 to /tmp/8169b67bd894ddbb4412f91573b38db3

bandit22@bandit:/etc/cron.d$ exec echo I am user bandit23 | md5sum | cut -d ' ' -f 1
8ca319486bfbbc3663ea0fbe81326349

bandit22@bandit:/etc/cron.d$ cat /tmp/8ca319486bfbbc3663ea0fbe81326349
0Zf11ioIjMVN551jX3CmStKLYqjk54Ga
```


## Level 23 ---> Level 24
A program is running automatically at regular intervals from cron, the time-based job scheduler. Look in /etc/cron.d/ for the configuration and see what command is being executed.

Again a similar level.

This is the cronjob.

```
bandit23@bandit:~$ cat /etc/cron.d/cronjob_bandit24
@reboot bandit24 /usr/bin/cronjob_bandit24.sh &> /dev/null
* * * * * bandit24 /usr/bin/cronjob_bandit24.sh &> /dev/null
```

This is the `shell` script it's executing.

```
bandit23@bandit:~$ cat /usr/bin/cronjob_bandit24.sh
#!/bin/bash

myname=$(whoami)

cd /var/spool/$myname/foo
echo "Executing and deleting all scripts in /var/spool/$myname/foo:"
for i in * .*;
do
    if [ "$i" != "." -a "$i" != ".." ];
    then
        echo "Handling $i"
        owner="$(stat --format "%U" ./$i)"
        if [ "${owner}" = "bandit23" ]; then
            timeout -s 9 60 ./$i
        fi
        rm -f ./$i
    fi
done

```

Here we can see, that for a given `bandit` username, it is deleting  all the scripts one by one, but before, executing only if the file owner is `bandit23`.

So what we need to do is to create some sort of a script to get the password.

Getting inspired from the previoius level we can just copy the previous level script in the `/var/spool/bandit24/foo` folder.

```
#!/bin/bash

myname=$(whoami)
mytarget=$(echo I am user $myname | md5sum | cut -d ' ' -f 1)

echo "Copying passwordfile /etc/bandit_pass/$myname to /tmp/$mytarget"

cat /etc/bandit_pass/$myname > /tmp/$mytarget
```

and hence we'll see the password

```
bandit23@bandit:~$ cat /tmp/ee4ee1703b083edac9f8183e4ae70293
gb8KRRCsshuZXI0tUuR6ypOFjiZbf3G8

```

## Level 24 ---> Level 25
A daemon is listening on port 30002 and will give you the password for bandit25 if given the password for bandit24 and a secret numeric 4-digit pincode. There is no way to retrieve the pincode except by going through all of the 10000 combinations, called brute-forcing.

So basically, we have to use `nc` and push the combination using a for loop. We can easily achieve this by using `for-loop` in a bash script.

This is the bash script that I created:
```
bandit24@bandit:/tmp/bandit25puniyal$ cat bandit25_pass.sh 

#!/bin/bash
FILE="/etc/bandit_pass/bandit24"
PASS=$(<"$FILE")
#echo "$PASS"
#echo 'something new' | nc localhost 30002
for ((i=1000;i<=9999;i++)); do
	#echo "trying value $(/etc/bandit_pass/bandit24) $i"
	echo "$PASS $i"| nc -q 0 localhost 30002 >> new_file.txt
done
echo "task is finished"
```

For this, I need to make this `new_file.txt`.

```
bandit24@bandit:/tmp/bandit25puniyal$ grep "The password of user bandit25" new_file.txt
The password of user bandit25 is iCi86ttT4KSNe1armKiwbQNmB3YJP3q4
```

___NOTE___: The level says _'You do not need to create new connections each time'_.

How do we achieve this?

By passing all the combinations to the `nc` connection all at once, and then noting it into a file.

## Level 25 ---> Level 26
This is a wierd level. This basically needs you to ssh into `bandit26` which in turn would exit the ssh. So, you need to try a **hack**, that is, minimizing the terminal size so as to go into command mode in `more` from where you can switch to `vim` and execute some commands.

Here how it goes:
- copy the private key to your own system
- use it to `ssh` into __bandit26__
- minimize while ssh-ing
- type `v` to switch over to __vim__
- type `:e /etc/bandit_pass/bandit26` to get the password for **bandit26**

## Level 26 --> Level 27
You have to continue from the previous `vim` command mode, and do something like `:set shell=/bin/bash` so that you can use bash as you shell instead of the custom 'notext' something shell.

Now do, `:shell` and you'd see the bash shell.

Here's a file, __bandit27-do__, and you'd see that the run permission of this file is special becuase it is something like this `-rws` for __bandit27__ user. 

Use this to find the password like this: `./bandit27-do cat /etc/bandit_pass/bandit27`

## Level 27 --> Level 28
This level was rather simple, you just need to find out how to use the git url and clone the repo with the mentioned port.

```
priyavrat@bruno34:~$ cd /tmp/tmp.920atZ5XdD

priyavrat@bruno34:/tmp/tmp.920atZ5XdD$ git 
clone ssh://bandit27-git@bandit.labs.overthewire.org:2220/home/bandit27-git/repo
Cloning into 'repo'...                       

                      This is an OverTheWire game server. 
            More information on http://www.overthewire.org/wargames

backend: gibson-1
bandit27-git@bandit.labs.overthewire.org's password: 
remote: Enumerating objects: 3, done.
remote: Counting objects: 100% (3/3), done.
remote: Compressing objects: 100% (2/2), done.
remote: Total 3 (delta 0), reused 0 (delta 0), pack-reused 0
Receiving objects: 100% (3/3), done.

priyavrat@bruno34:/tmp/tmp.920atZ5XdD$ ls -ltr
total 4
drwxrwxr-x 3 priyavrat priyavrat 4096 Dec  2 19:53 repo

priyavrat@bruno34:/tmp/tmp.920atZ5XdD$ cd repo/

priyavrat@bruno34:/tmp/tmp.920atZ5XdD/repo$ ls -ltr
total 4
-rw-rw-r-- 1 priyavrat priyavrat 68 Dec  2 19:53 README

priyavrat@bruno34:/tmp/tmp.920atZ5XdD/repo$ cat README 
The password to the next level is: Yz9IpL0sBcCeuG7m9uQFt8ZNpS4HZRcN

```


## Level 28 --> Level 29
We need two commands here, `git log` and `git show [commit_id]`.

When you see the file we can see their is password, and then you see the git logs, then you can see a weird commit. Open that and you'll see that password.

```
priyavrat@bruno34:/tmp/tmp.920atZ5XdD/repo$ cat README.md 
# Bandit Notes
Some notes for level29 of bandit.

## credentials

- username: bandit29
- password: xxxxxxxxxx

priyavrat@bruno34:/tmp/tmp.920atZ5XdD/repo$ ls -ltr
total 4
-rw-rw-r-- 1 priyavrat priyavrat 111 Dec  2 19:58 README.md

priyavrat@bruno34:/tmp/tmp.920atZ5XdD/repo$ git log
commit b5ed4b5a3499533c2611217c8780e8ead48609f6 (HEAD -> master, origin/master, origin/HEAD)
Author: Morla Porla <morla@overthewire.org>
Date:   Tue Oct 14 09:26:24 2025 +0000

    fix info leak

commit 8b7c651b37ce7a94633b7b7b7c980ded19a16e4f
Author: Morla Porla <morla@overthewire.org>
Date:   Tue Oct 14 09:26:24 2025 +0000

    add missing data

commit 6d8e5e607602b597ade7504a550a29ba03f2cca0
Author: Ben Dover <noone@overthewire.org>
Date:   Tue Oct 14 09:26:24 2025 +0000

    initial commit of README.md

priyavrat@bruno34:/tmp/tmp.920atZ5XdD/repo$ git show 8b7c651b37ce7a94633b7b7b7c980ded19a16e4f
commit 8b7c651b37ce7a94633b7b7b7c980ded19a16e4f
Author: Morla Porla <morla@overthewire.org>
Date:   Tue Oct 14 09:26:24 2025 +0000

    add missing data

diff --git a/README.md b/README.md
index 7ba2d2f..d4e3b74 100644
--- a/README.md
+++ b/README.md
@@ -4,5 +4,5 @@ Some notes for level29 of bandit.
 ## credentials
 
 - username: bandit29
-- password: <TBD>
+- password: 4pT1t5DENaYuqnqvadYs1oE4QLCdjmJ7

```

## Level 29 --> Level 30
This level includes the concept of possiblity of different branches to a repo. In one of the repos you will find the password.

```
priyavrat@bruno34:~$ cd /tmp/tmp.ApQMbeTl8J

priyavrat@bruno34:/tmp/tmp.ApQMbeTl8J$ ls -ltra
total 20
drwxrwxrwt 21 root      root      12288 Dec  5 15:26 ..
drwx------  3 priyavrat priyavrat  4096 Dec  5 15:26 .
drwxrwxr-x  5 priyavrat priyavrat  4096 Dec  5 15:28 repo

priyavrat@bruno34:/tmp/tmp.ApQMbeTl8J$ cd repo

priyavrat@bruno34:/tmp/tmp.ApQMbeTl8J/repo$ git branch -a
* (HEAD detached at origin/dev)
  master
  remotes/origin/HEAD -> origin/master
  remotes/origin/dev
  remotes/origin/master
  remotes/origin/sploits-dev

priyavrat@bruno34:/tmp/tmp.ApQMbeTl8J/repo$ git checkout origin/dev
HEAD is now at e50e6cc add data needed for development

priyavrat@bruno34:/tmp/tmp.ApQMbeTl8J/repo$ ls -ltr
total 12
-rw-rw-r-- 1 priyavrat priyavrat  134 Dec  5 15:28 README.md
drwxrwxr-x 2 priyavrat priyavrat 4096 Dec  5 15:28 exploits
drwxrwxr-x 2 priyavrat priyavrat 4096 Dec  5 15:28 code

priyavrat@bruno34:/tmp/tmp.ApQMbeTl8J/repo$ cat README.md 
# Bandit Notes
Some notes for bandit30 of bandit.

## credentials

- username: bandit30
- password: qp30ex3VLz5MDG1n91YowTv4Q8l7CDZL
```

## Level 30 --> Level 31
This one contains concept of git __'tags'__

```
priyavrat@bruno34:/tmp/tmp.ApQMbeTl8J/repo$ git branch
* master

priyavrat@bruno34:/tmp/tmp.ApQMbeTl8J/repo$ git branch -a
* master
  remotes/origin/HEAD -> origin/master
  remotes/origin/master

priyavrat@bruno34:/tmp/tmp.ApQMbeTl8J/repo$ git log
commit d604df2303c973b8e0565c60e4c29d3801445299 (HEAD -> master, origin/master, origin/HEAD)
Author: Ben Dover <noone@overthewire.org>
Date:   Tue Oct 14 09:26:28 2025 +0000

    initial commit of README.md

priyavrat@bruno34:/tmp/tmp.ApQMbeTl8J/repo$ git tag
secret

priyavrat@bruno34:/tmp/tmp.ApQMbeTl8J/repo$ git show secret
fb5S2xb7bRyFmAvQYQGEqsbhVyJqhnDy
```

## Level 31 --> Level 32
This level require you to push a file, but take care of the `.gitignore` file as well.

```
priyavrat@bruno34:/tmp/tmp.ApQMbeTl8J/repo$ cat README.md 
This time your task is to push a file to the remote repository.

Details:
    File name: key.txt
    Content: 'May I come in?'
    Branch: master


priyavrat@bruno34:/tmp/tmp.ApQMbeTl8J/repo$ touch key.txt; echo "May I come in?" > key.txt

priyavrat@bruno34:/tmp/tmp.ApQMbeTl8J/repo$ ls -ltr
total 8
-rw-rw-r-- 1 priyavrat priyavrat 147 Dec  6 12:18 README.md
-rw-rw-r-- 1 priyavrat priyavrat  15 Dec  6 12:19 key.txt

priyavrat@bruno34:/tmp/tmp.ApQMbeTl8J/repo$ cat key.txt 
May I come in?

priyavrat@bruno34:/tmp/tmp.ApQMbeTl8J/repo$ ls -ltra
total 24
drwx------ 3 priyavrat priyavrat 4096 Dec  6 12:18 ..
-rw-rw-r-- 1 priyavrat priyavrat  147 Dec  6 12:18 README.md
-rw-rw-r-- 1 priyavrat priyavrat    6 Dec  6 12:18 .gitignore
-rw-rw-r-- 1 priyavrat priyavrat   15 Dec  6 12:19 key.txt
drwxrwxr-x 3 priyavrat priyavrat 4096 Dec  6 12:19 .
drwxrwxr-x 8 priyavrat priyavrat 4096 Dec  6 12:21 .git

priyavrat@bruno34:/tmp/tmp.ApQMbeTl8J/repo$ cat .gitignore 
*.txt

priyavrat@bruno34:/tmp/tmp.ApQMbeTl8J/repo$ vim .gitignore

priyavrat@bruno34:/tmp/tmp.ApQMbeTl8J/repo$ cat .gitignore 
hello.txt

priyavrat@bruno34:/tmp/tmp.ApQMbeTl8J/repo$ git status
On branch master
Your branch is up to date with 'origin/master'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   .gitignore

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	key.txt

no changes added to commit (use "git add" and/or "git commit -a")

priyavrat@bruno34:/tmp/tmp.ApQMbeTl8J/repo$ git add .

priyavrat@bruno34:/tmp/tmp.ApQMbeTl8J/repo$ git commit -m "whatever sucker" && git push
[master 2ff44a8] whatever sucker
 2 files changed, 2 insertions(+), 1 deletion(-)
 create mode 100644 key.txt
                        ..............................
                      This is an OverTheWire game server. 
            More information on http://www.overthewire.org/wargames

backend: gibson-1
bandit31-git@bandit.labs.overthewire.org's password: 
Enumerating objects: 6, done.
Counting objects: 100% (6/6), done.
Delta compression using up to 22 threads
Compressing objects: 100% (2/2), done.
Writing objects: 100% (4/4), 352 bytes | 352.00 KiB/s, done.
Total 4 (delta 0), reused 0 (delta 0), pack-reused 0
remote: ### Attempting to validate files... ####
remote: 
remote: .oOo.oOo.oOo.oOo.oOo.oOo.oOo.oOo.oOo.oOo.
remote: 
remote: Well done! Here is the password for the next level:
remote: 3O9RfhqyAlVBEZpVb6LYStshZoqoSx5K 
remote: 
remote: .oOo.oOo.oOo.oOo.oOo.oOo.oOo.oOo.oOo.oOo.
remote: 
```