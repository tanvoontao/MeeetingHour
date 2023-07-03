create database my_hd_db;
use my_hd_db;

CREATE TABLE students
(
id varchar(50) not null PRIMARY KEY,
student_id varchar(100) not null,
fname varchar(100) not null,
lname varchar(100) not null,
gender varchar(6) not null,
address varchar(100) not null,
profile_img_name varchar(255) not null,
email varchar(100) not null,
password varchar(255) not null
);

CREATE TABLE staffs
(
id varchar(50) not null PRIMARY KEY,
email varchar(100) not null,
password varchar(255) not null,
fname varchar(100) not null,
lname varchar(100) not null,
gender varchar(6) not null,
biography text(500) not null,
profile_img_name varchar(255) not null
);

CREATE TABLE admins
(
id varchar(50) not null PRIMARY KEY,
name varchar(100) not null,
email varchar(100) not null,
password varchar(255) not null
);

CREATE TABLE units
(
code varchar(10) not null PRIMARY KEY,
name varchar(255) not null,
course_name varchar(255) not null
);

CREATE TABLE staff_enroll_units
(
staff_id varchar(50) not null,
code varchar(10) not null
);

CREATE TABLE appointments
(
id varchar(50) not null,
staff_id varchar(50) not null,
student_id varchar(50) not null,
datetime DATETIME  not null,
approve bool default 0,
pending bool default 1,
complete bool default 0,
cancel bool default 0,
cancel_reason varchar(255) default "",
note varchar(255) default ""
);


-- populate units
insert into units (code, name, course_name)
values ("COS 30008","Data Structures and Patterns","Bachelor of Computer Science");

insert into units (code, name, course_name)
values ("COS 30019","Introduction to Artificial Intelligence","Bachelor of Computer Science");

insert into units (code, name, course_name)
values ("COS 30041","Creating Secure and Scalable Software","Bachelor of Computer Science");

insert into units (code, name, course_name)
values ("SWE 30009","Software Testing and Realiability","Bachelor of Computer Science");


-- populate staffs
insert into staff_enroll_units (staff_id, code) 
value ("1e6a2e56-418c-4370-a424-9b7499239f31", "COS 30008");

insert into staff_enroll_units (staff_id, code) 
value ("e24b97f0-4e7f-4441-82e1-877f64fa1943", "COS 30019");

insert into staff_enroll_units (staff_id, code) 
value ("6c208df1-3283-40a7-bc18-a13aff3d3a89", "COS 30041");

insert into staff_enroll_units (staff_id, code) 
value ("3d510e61-0585-4dfd-8611-159d319831f7", "SWE 30009");

insert into students (id, email, password) 
value ("9d36c994-fbe6-4aa3-9690-39406bc42507", "tvt@gmail.com", "$2a$11$2eveXC2ek.BKXebc4zpU7Ou6ge/98zXUe9Kj2O9ZGIaGaDoSNGZlu");

insert into students (id, email, password) 
value ("d1f123e3-df57-474e-8477-560f0d619d7c", "tvt2@gmail.com", "$2a$11$2eveXC2ek.BKXebc4zpU7Ou6ge/98zXUe9Kj2O9ZGIaGaDoSNGZlu");


-- student get upcoming consultation
select * from appointments where student_id="9d36c994-fbe6-4aa3-9690-39406bc42507" and datetime > NOW() and approve=1 and pending=1; 

-- student get pending consultation but not approve yet
select * from appointments where student_id="9d36c994-fbe6-4aa3-9690-39406bc42507" and datetime > NOW() and approve=0 and pending=1; 

-- history or cancelled
select * from appointments where student_id="9d36c994-fbe6-4aa3-9690-39406bc42507" and datetime < NOW() or cancel=1; 

1e6a2e56-418c-4370-a424-9b7499239f31
3d510e61-0585-4dfd-8611-159d319831f7
6c208df1-3283-40a7-bc18-a13aff3d3a89
e24b97f0-4e7f-4441-82e1-877f64fa1943

mtktsun@swinburne.edu.my
ctan@swinburne.edu.my
jhyong@swinburne.edu.my
jcmthan@swinburne.edu.my

$2a$11$7TXpmr1pH7CvS6NcpEkw8uoSG5HM56Yf61WTOBq0mtgmG4dqNTp8i

insert into staffs (id, email, password, fname, lname, gender, biography, profile_img_name)
value ("1e6a2e56-418c-4370-a424-9b7499239f31", "mtktsun@swinburne.edu.my", "$2a$11$7TXpmr1pH7CvS6NcpEkw8uoSG5HM56Yf61WTOBq0mtgmG4dqNTp8i", 
"Kit Tsun", "Mark Tee", "male", "Dr. Mark Tee received his BSc(Hons) in Computer Science from Coventry University in 2005 and served and intermittently contracted in the software development industry until 2018. He completed a Masters in Software Engineering (OUM) and a BEng(Hons) from Swinburne University of Technology Sarawak by 2014. He completed his PhD candidature at the same university in 2018 and joined the Faculty of Engineering, Computing and Science as a Lecturer in the following year.
His doctoral research focused on developing a real-time multi-sensor fusion model for augmenting the human-following navigation of indoor companion robots. His previous activity areas include computer game development, drone technology applications and assistive robotics for injury prevention.
Dr. Mark currently pursues research and industrial applications of the Internet of Things (IoT), Deep Learning, and Assistive Robotics."
,"");

insert into staffs (id, email, password, fname, lname, gender, biography, profile_img_name)
value ("e24b97f0-4e7f-4441-82e1-877f64fa1943", "jcmthan@swinburne.edu.my", "$2a$11$7TXpmr1pH7CvS6NcpEkw8uoSG5HM56Yf61WTOBq0mtgmG4dqNTp8i", 
"Chia Ming", "Joel Than", "male", "Joel Than Chia Ming received his Bachelor of Engineering (Biomedical) from Universiti Tunku Abdul Rahman in 2013. He later received MPhil from Universiti Teknologi Malaysia (UTM) in 2015. He earned his doctoral degree from the same university in 2019, working in the area of deep learning and medical imaging classification. He then became a post-doctoral researcher in the same year in UTM before joining Swinburne University Technology, Sarawak, as a lecturer in 2020."
,"");

insert into staffs (id, email, password, fname, lname, gender, biography, profile_img_name)
value ("6c208df1-3283-40a7-bc18-a13aff3d3a89", "jhyong@swinburne.edu.my", "$2a$11$7TXpmr1pH7CvS6NcpEkw8uoSG5HM56Yf61WTOBq0mtgmG4dqNTp8i", 
"Hsien Ming", "Jason Yong", "male", "Dr. Jason Yong obtained his BSc in Computer Science and Software Engineering and BEng Robotics and Mechatronics from Swinburne University of Technology Sarawak in 2013. He, then, obtained his MSc in Nanoelectronics and PhD in Electrical and Electronics Engineering from the University of Melbourne in 2015 and 2019 respectively. His Ph.D. dissertation topic was on development on techniques pertaining to the development of high-performance solution processed electronics for memory and neuromorphic applications."
,"");

insert into staffs (id, email, password, fname, lname, gender, biography, profile_img_name)
value ("3d510e61-0585-4dfd-8611-159d319831f7", "ctan@swinburne.edu.my", "$2a$11$7TXpmr1pH7CvS6NcpEkw8uoSG5HM56Yf61WTOBq0mtgmG4dqNTp8i", 
"Choon Lin", "Colin Tan", "male", "Colin Tan received his BEng (Hons) in Electronics and Computer Engineering and MSc in Computer Science from Universiti Malaysia Sarawak (UNIMAS). After completing his Master’s study in 2016, he went to Kuala Lumpur and worked as a lecturer at Erican College. In 2017, he continued his study at UNIMAS in the information security domain, specializing in the detection of phishing websites. Throughout his research journey, Colin has published a number of articles in top-tier ISI indexed journals. In 2021, Colin obtained his PhD and joined Swinburne University of Technology Sarawak as a lecturer."
,"");


insert into admins (id, name, email, password)
values ("3d510e61-0585-4dfd-8611-159d319831f8", "admin1", "admin1@admins.swinburne.edu.my", "$2a$11$7TXpmr1pH7CvS6NcpEkw8uoSG5HM56Yf61WTOBq0mtgmG4dqNTp8i");