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