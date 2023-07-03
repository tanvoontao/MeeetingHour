-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 10, 2022 at 02:04 PM
-- Server version: 10.4.19-MariaDB
-- PHP Version: 7.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `my_hd_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `name`, `email`, `password`) VALUES
('0280fab7-542f-43c0-9bb4-bbeafd52f15e', 'string', 'string', '$2a$11$v1VtNSl4ZRbIpUjVGcehROdrqune6SRDOMnenucKdQ2UhyGG2J4JW'),
('3d510e61-0585-4dfd-8611-159d319831f8', 'admin1', 'admin1@admins.swinburne.edu.my', '$2a$11$7TXpmr1pH7CvS6NcpEkw8uoSG5HM56Yf61WTOBq0mtgmG4dqNTp8i');

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `id` varchar(50) NOT NULL,
  `staff_id` varchar(50) NOT NULL,
  `student_id` varchar(50) NOT NULL,
  `datetime` datetime NOT NULL,
  `approve` tinyint(1) DEFAULT 0,
  `pending` tinyint(1) DEFAULT 1,
  `complete` tinyint(1) DEFAULT 0,
  `cancel` tinyint(1) DEFAULT 0,
  `cancel_reason` varchar(255) DEFAULT '',
  `note` varchar(255) DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `staff_id`, `student_id`, `datetime`, `approve`, `pending`, `complete`, `cancel`, `cancel_reason`, `note`) VALUES
('889c4acf-77be-49b8-8adf-efd55eb5d964', '6c208df1-3283-40a7-bc18-a13aff3d3a89', '342cc238-be72-4044-b3e8-9b7715095b35', '2022-12-31 10:00:00', 0, 0, 0, 1, '', ''),
('13e6a67e-d095-4a29-989a-a413776a3391', '6c208df1-3283-40a7-bc18-a13aff3d3a89', '342cc238-be72-4044-b3e8-9b7715095b35', '2022-12-31 18:00:00', 0, 0, 0, 1, '', ''),
('db90ea5e-bb7e-439d-b4d0-01763629c22d', '6c208df1-3283-40a7-bc18-a13aff3d3a89', '342cc238-be72-4044-b3e8-9b7715095b35', '2022-12-31 18:00:00', 0, 0, 0, 1, '', ''),
('7fc1466a-89d4-4a22-bb3c-96df33d020ec', '6c208df1-3283-40a7-bc18-a13aff3d3a89', '342cc238-be72-4044-b3e8-9b7715095b35', '2022-12-31 17:00:00', 1, 1, 1, 0, '', ''),
('3e6d397b-6ea0-49af-b5bd-121397cf410e', '6c208df1-3283-40a7-bc18-a13aff3d3a89', '342cc238-be72-4044-b3e8-9b7715095b35', '2022-12-31 18:00:00', 0, 0, 0, 1, '', ''),
('ad2e7b1a-2531-496c-b2a6-401324cd41f1', '6c208df1-3283-40a7-bc18-a13aff3d3a89', '342cc238-be72-4044-b3e8-9b7715095b35', '2022-12-31 11:00:00', 0, 0, 0, 1, '', ''),
('1256eee4-ad52-4ba8-b1eb-9a8834fa6dd1', '6c208df1-3283-40a7-bc18-a13aff3d3a89', '342cc238-be72-4044-b3e8-9b7715095b35', '2022-12-31 12:00:00', 1, 1, 1, 0, '', ''),
('c2642c5e-add9-4bb9-b613-60abee26563b', '6c208df1-3283-40a7-bc18-a13aff3d3a89', '342cc238-be72-4044-b3e8-9b7715095b35', '2022-12-31 16:00:00', 1, 1, 1, 0, '', ''),
('87eb207d-15ee-4111-a77a-dac82ef625e8', '6c208df1-3283-40a7-bc18-a13aff3d3a89', '09231e68-f42b-45cc-bd92-3af87fe398db', '2022-12-31 10:00:00', 0, 0, 0, 1, '', ''),
('3cab283e-19f5-41b8-9bd7-aadd37e74364', '6c208df1-3283-40a7-bc18-a13aff3d3a89', '09231e68-f42b-45cc-bd92-3af87fe398db', '2022-12-31 10:00:00', 0, 0, 0, 1, '', ''),
('d5ae90a1-413f-4873-9606-e73e61340c95', '6c208df1-3283-40a7-bc18-a13aff3d3a89', '09231e68-f42b-45cc-bd92-3af87fe398db', '2022-12-31 10:00:00', 1, 1, 1, 0, '', ''),
('50867173-39f0-4c32-a389-b48f700b7bfb', '6c208df1-3283-40a7-bc18-a13aff3d3a89', '342cc238-be72-4044-b3e8-9b7715095b35', '2022-12-31 11:00:00', 0, 1, 0, 0, '', ''),
('b321eefa-0171-4110-8457-8270821cbb00', '6c208df1-3283-40a7-bc18-a13aff3d3a89', '342cc238-be72-4044-b3e8-9b7715095b35', '2022-12-31 18:00:00', 1, 1, 0, 0, '', '');

-- --------------------------------------------------------

--
-- Table structure for table `staffs`
--

CREATE TABLE `staffs` (
  `id` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `fname` varchar(100) NOT NULL,
  `lname` varchar(100) NOT NULL,
  `gender` varchar(6) NOT NULL,
  `biography` text NOT NULL,
  `profile_img_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `staffs`
--

INSERT INTO `staffs` (`id`, `email`, `password`, `fname`, `lname`, `gender`, `biography`, `profile_img_name`) VALUES
('1e6a2e56-418c-4370-a424-9b7499239f31', 'mtktsun@swinburne.edu.my', '$2a$11$7TXpmr1pH7CvS6NcpEkw8uoSG5HM56Yf61WTOBq0mtgmG4dqNTp8i', 'Kit Tsun', 'Mark Tee', 'male', 'Dr. Mark Tee received his BSc(Hons) in Computer Science from Coventry University in 2005 and served and intermittently contracted in the software development industry until 2018. He completed a Masters in Software Engineering (OUM) and a BEng(Hons) from Swinburne University of Technology Sarawak by 2014. He completed his PhD candidature at the same university in 2018 and joined the Faculty of Engineering, Computing and Science as a Lecturer in the following year.\nHis doctoral research focused on developing a real-time multi-sensor fusion model for augmenting the human-following navigation of indoor companion robots. His previous activity areas include computer game development, drone technology applications and assistive robotics for injury prevention.\nDr. Mark currently pursues research and industrial applications of the Internet of Things (IoT), Deep Learning, and Assistive Robotics.', '1670392359813.jpg'),
('3d510e61-0585-4dfd-8611-159d319831f7', 'ctan@swinburne.edu.my', '$2a$11$7TXpmr1pH7CvS6NcpEkw8uoSG5HM56Yf61WTOBq0mtgmG4dqNTp8i', 'Choon Lin', 'Colin Tan', 'male', 'Colin Tan received his BEng (Hons) in Electronics and Computer Engineering and MSc in Computer Science from Universiti Malaysia Sarawak (UNIMAS). After completing his Master’s study in 2016, he went to Kuala Lumpur and worked as a lecturer at Erican College. In 2017, he continued his study at UNIMAS in the information security domain, specializing in the detection of phishing websites. Throughout his research journey, Colin has published a number of articles in top-tier ISI indexed journals. In 2021, Colin obtained his PhD and joined Swinburne University of Technology Sarawak as a lecturer.', '1670392446412.jpg'),
('6c208df1-3283-40a7-bc18-a13aff3d3a89', 'jhyong@swinburne.edu.my', '$2a$11$Ze9vWCrsTxnSFLZmpVcAYu7Jep4YvMjlXieKp3Ctb.g4GflGSgYeW', 'Hsien Ming', 'Jason Yong', 'male', 'Dr. Jason Yong obtained his BSc in Computer Science and Software Engineering and BEng Robotics and Mechatronics from Swinburne University of Technology Sarawak in 2013. He, then, obtained his MSc in Nanoelectronics and PhD in Electrical and Electronics Engineering from the University of Melbourne in 2015 and 2019 respectively. His Ph.D. dissertation topic was on development on techniques pertaining to the development of high-performance solution processed electronics for memory and neuromorphic applications......!!!!', '1670329959249.jpg'),
('e24b97f0-4e7f-4441-82e1-877f64fa1943', 'jcmthan@swinburne.edu.my', '$2a$11$7TXpmr1pH7CvS6NcpEkw8uoSG5HM56Yf61WTOBq0mtgmG4dqNTp8i', 'Chia Ming', 'Joel Than', 'male', 'Joel Than Chia Ming received his Bachelor of Engineering (Biomedical) from Universiti Tunku Abdul Rahman in 2013. He later received MPhil from Universiti Teknologi Malaysia (UTM) in 2015. He earned his doctoral degree from the same university in 2019, working in the area of deep learning and medical imaging classification. He then became a post-doctoral researcher in the same year in UTM before joining Swinburne University Technology, Sarawak, as a lecturer in 2020.', '1670392463598.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `staff_enroll_units`
--

CREATE TABLE `staff_enroll_units` (
  `staff_id` varchar(50) NOT NULL,
  `code` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `staff_enroll_units`
--

INSERT INTO `staff_enroll_units` (`staff_id`, `code`) VALUES
('1e6a2e56-418c-4370-a424-9b7499239f31', 'COS 30008'),
('e24b97f0-4e7f-4441-82e1-877f64fa1943', 'COS 30019'),
('6c208df1-3283-40a7-bc18-a13aff3d3a89', 'COS 30041'),
('3d510e61-0585-4dfd-8611-159d319831f7', 'SWE 30009');

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` varchar(50) NOT NULL,
  `student_id` varchar(100) NOT NULL,
  `fname` varchar(100) NOT NULL,
  `lname` varchar(100) NOT NULL,
  `gender` varchar(6) NOT NULL,
  `address` varchar(100) NOT NULL,
  `profile_img_name` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `student_id`, `fname`, `lname`, `gender`, `address`, `profile_img_name`, `email`, `password`) VALUES
('09231e68-f42b-45cc-bd92-3af87fe398db', '102762221', 'Mandy Xing Ying', 'Lam', 'female', 'no for now.....................', '1670663116166.jpeg', '102762221@students.swinburne.edu.my', '$2a$11$azs3vmMuQOIcHcJIM6IXSer0ZJ3aD8duh3h/HxpCHa6xdYGNarlFS'),
('342cc238-be72-4044-b3e8-9b7715095b35', '12345', 'Voon Taoo', 'Tan', 'male', 'ya', '1670419901285.jpg', '12345@students.swinburne.edu.my', '$2a$11$/vsYtcWIgQwaZnim14dNfe6oBE9WaOqNPlbH6tfIx7L5fQ.oi0KeC');

-- --------------------------------------------------------

--
-- Table structure for table `units`
--

CREATE TABLE `units` (
  `code` varchar(10) NOT NULL,
  `name` varchar(255) NOT NULL,
  `course_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `units`
--

INSERT INTO `units` (`code`, `name`, `course_name`) VALUES
('COS 30008', 'Data Structures and Patterns', 'Bachelor of Computer Science'),
('COS 30019', 'Introduction to Artificial Intelligence', 'Bachelor of Computer Science'),
('COS 30041', 'Creating Secure and Scalable Software', 'Bachelor of Computer Science'),
('SWE 30009', 'Software Testing and Realiability', 'Bachelor of Computer Science');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `staffs`
--
ALTER TABLE `staffs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `units`
--
ALTER TABLE `units`
  ADD PRIMARY KEY (`code`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
