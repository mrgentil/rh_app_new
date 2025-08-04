-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:3306
-- Généré le : ven. 01 août 2025 à 11:19
-- Version du serveur : 8.0.30
-- Version de PHP : 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `my_rh_app`
--

-- --------------------------------------------------------

--
-- Structure de la table `announcements`
--

CREATE TABLE `announcements` (
  `id` int UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `postedBy` int UNSIGNED NOT NULL,
  `date` datetime NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `applications`
--

CREATE TABLE `applications` (
  `id` int UNSIGNED NOT NULL,
  `candidateId` int UNSIGNED NOT NULL,
  `jobOfferId` int UNSIGNED NOT NULL,
  `status` enum('en cours','accepté','refusé') NOT NULL DEFAULT 'en cours',
  `interviewDate` datetime DEFAULT NULL,
  `notes` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `id` int NOT NULL,
  `userId` int DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `table` varchar(255) NOT NULL,
  `rowId` int DEFAULT NULL,
  `details` text,
  `createdAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `audit_logs`
--

INSERT INTO `audit_logs` (`id`, `userId`, `action`, `table`, `rowId`, `details`, `createdAt`) VALUES
(1, 1, 'DELETE', 'User', 2, '', '2025-07-28 14:25:40'),
(2, 1, 'DELETE', 'User', 3, '', '2025-07-28 14:25:56'),
(3, 1, 'DELETE', 'User', 4, '', '2025-07-28 14:26:05'),
(4, 1, 'CREATE', 'User', 5, '{\"username\":\"bedi\",\"email\":\"tshitshob@gmail.com\",\"firstName\":\"bedi\",\"lastName\":\"tshitsho\",\"phone\":\"+243812380589\",\"roleId\":1,\"departmentId\":1,\"jobTitleId\":1,\"birthDate\":\"1995-09-04\",\"hireDate\":\"2025-07-29\",\"status\":\"actif\",\"managerId\":1}', '2025-07-29 10:09:09'),
(5, 1, 'DELETE', 'User', 5, '', '2025-07-29 10:50:30'),
(6, 1, 'CREATE', 'User', 6, '{\"username\":\"bedi\",\"email\":\"tshitshob@gmail.com\",\"firstName\":\"bedi\",\"lastName\":\"tshitsho\",\"phone\":\"+243812380589\",\"roleId\":1,\"departmentId\":1,\"jobTitleId\":3,\"address\":\"Mon adresse\",\"birthDate\":\"1995-09-04\",\"hireDate\":\"2025-07-29\",\"status\":\"actif\",\"managerId\":1}', '2025-07-29 10:56:46'),
(7, 1, 'UPDATE', 'User', 6, '{\"username\":\"bedi\",\"email\":\"tshitshob@gmail.com\",\"roleId\":1,\"employeeId\":7,\"isActive\":true,\"photoUrl\":\"\",\"salary\":600,\"firstName\":\"bedi\",\"lastName\":\"tshitsho\",\"phone\":\"+243812380589\",\"address\":\"Mon adresse\",\"birthDate\":\"1995-09-04T00:00:00.000Z\",\"hireDate\":\"2025-07-29T00:00:00.000Z\",\"status\":\"actif\"}', '2025-07-29 15:23:30'),
(8, 1, 'UPDATE', 'User', 6, '{\"username\":\"bedi\",\"email\":\"tshitshob@gmail.com\",\"roleId\":1,\"employeeId\":7,\"isActive\":true,\"photoUrl\":\"data:image/jpeg;base64,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\",\"salary\":6000,\"firstName\":\"bedi\",\"lastName\":\"tshitsho\",\"phone\":\"+243812380589\",\"address\":\"Mon adresse\",\"birthDate\":\"1995-09-04T00:00:00.000Z\",\"hireDate\":\"2025-07-29T00:00:00.000Z\",\"status\":\"actif\"}', '2025-07-30 09:39:30'),
(9, 6, 'CREATE', 'User', 7, '{\"username\":\"mrgentil\",\"email\":\"bedi@totem-experience.com\",\"firstName\":\"MrGentil\",\"lastName\":\"Bilongo\",\"phone\":\"+243897875654\",\"roleId\":3,\"departmentId\":3,\"jobTitleId\":6,\"address\":\"Son adresse à elle\",\"birthDate\":\"2002-05-06\",\"hireDate\":\"2023-07-31\",\"status\":\"actif\"}', '2025-07-31 16:12:14');

-- --------------------------------------------------------

--
-- Structure de la table `candidates`
--

CREATE TABLE `candidates` (
  `id` int UNSIGNED NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `cvUrl` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `contracts`
--

CREATE TABLE `contracts` (
  `id` int UNSIGNED NOT NULL,
  `type` varchar(255) NOT NULL,
  `startDate` datetime NOT NULL,
  `endDate` datetime DEFAULT NULL,
  `salary` float NOT NULL,
  `employeeId` int UNSIGNED NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `departments`
--

CREATE TABLE `departments` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `departments`
--

INSERT INTO `departments` (`id`, `name`, `description`, `createdAt`, `updatedAt`) VALUES
(1, 'Ressources Humaines', 'Gestion du personnel', '2025-07-28 13:57:04', '2025-07-28 13:57:04'),
(2, 'Informatique', 'Développement et maintenance', '2025-07-28 13:57:04', '2025-07-28 13:57:04'),
(3, 'Marketing', 'Communication et promotion', '2025-07-28 13:57:04', '2025-07-28 13:57:04'),
(4, 'Finance', 'Gestion financière', '2025-07-28 13:57:04', '2025-07-28 13:57:04'),
(5, 'Commercial', 'Vente et relation client', '2025-07-28 13:57:04', '2025-07-28 13:57:04');

-- --------------------------------------------------------

--
-- Structure de la table `documents`
--

CREATE TABLE `documents` (
  `id` int UNSIGNED NOT NULL,
  `employeeId` int UNSIGNED NOT NULL,
  `type` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `employees`
--

CREATE TABLE `employees` (
  `id` int UNSIGNED NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `address` text,
  `birthDate` datetime NOT NULL,
  `hireDate` datetime NOT NULL,
  `jobTitleId` int UNSIGNED DEFAULT NULL,
  `departmentId` int UNSIGNED DEFAULT NULL,
  `managerId` int UNSIGNED DEFAULT NULL,
  `status` enum('actif','suspendu','démissionnaire','licencié') NOT NULL DEFAULT 'actif',
  `photoUrl` text,
  `contractEndDate` datetime DEFAULT NULL,
  `employeeType` enum('permanent','stagiaire','cdi','cdd') DEFAULT 'permanent',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `salary` decimal(10,2) DEFAULT NULL COMMENT 'Salaire brut annuel en euros',
  `city` varchar(100) DEFAULT NULL,
  `postalCode` varchar(20) DEFAULT NULL,
  `country` varchar(100) DEFAULT 'France',
  `emergencyContactName` varchar(255) DEFAULT NULL,
  `emergencyContactPhone` varchar(50) DEFAULT NULL,
  `emergencyContactRelationship` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `employees`
--

INSERT INTO `employees` (`id`, `firstName`, `lastName`, `email`, `phone`, `address`, `birthDate`, `hireDate`, `jobTitleId`, `departmentId`, `managerId`, `status`, `photoUrl`, `contractEndDate`, `employeeType`, `createdAt`, `updatedAt`, `salary`, `city`, `postalCode`, `country`, `emergencyContactName`, `emergencyContactPhone`, `emergencyContactRelationship`) VALUES
(1, 'Admin', 'Système', 'admin@rh-app.com', '0123456789', '123 Rue Admin, 75000 Paris', '1990-01-01 00:00:00', '2024-01-01 00:00:00', 1, 1, NULL, 'actif', NULL, NULL, 'permanent', '2025-07-28 13:57:05', '2025-07-28 13:57:05', NULL, NULL, NULL, 'France', 'Contact d\'urgence', '+33 1 23 45 67 89', 'Famille'),
(2, 'Jean', 'Dupont', 'testuser1@example.com', '0123456789', '123 Rue de la Paix, 75001 Paris', '1990-01-15 00:00:00', '2023-01-01 00:00:00', NULL, NULL, NULL, 'actif', NULL, NULL, 'permanent', '2025-07-28 13:57:49', '2025-07-28 13:57:49', NULL, NULL, NULL, 'France', 'Contact d\'urgence', '+33 1 23 45 67 89', 'Famille'),
(3, 'Jean', 'Dupont', 'testuser1753711824240@example.com', '0123456789', '123 Rue de la Paix, 75001 Paris', '1990-01-15 00:00:00', '2023-01-01 00:00:00', NULL, NULL, NULL, 'actif', NULL, NULL, 'permanent', '2025-07-28 14:10:28', '2025-07-28 14:10:28', NULL, NULL, NULL, 'France', 'Contact d\'urgence', '+33 1 23 45 67 89', 'Famille'),
(4, 'Jean', 'Dupont', 'testuser1753712000447@example.com', '0123456789', '123 Rue de la Paix, 75001 Paris', '1990-01-15 00:00:00', '2023-01-01 00:00:00', 1, 1, NULL, 'actif', NULL, NULL, 'permanent', '2025-07-28 14:13:21', '2025-07-28 14:13:21', NULL, NULL, NULL, 'France', 'Contact d\'urgence', '+33 1 23 45 67 89', 'Famille'),
(7, 'bedi', 'tshitsho', 'tshitshob@gmail.com', '+243812380589', 'Mon adresse', '1995-09-04 00:00:00', '2025-07-29 00:00:00', 3, 1, 1, 'actif', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wAARCADHASwDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD2aiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAopKM0ALRSZHrRkeooAWikyPWjIoAWikpaACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKSigBaKSloAKKKKACiiigAoopKAFpKoS65p0Wqw6WblTeTZ2wryQACSTjoMDvV/qKBJp7EVxdW9pA89zNHDEgy0kjBVX6k1nSa4XJWw0+8vW7FY/LT2O9yoI91zV9bK3EomMStKM4dhuYZ64J6VPimJ3ZgkeK7w8DTdNjYer3Ein/wAdX+dV38K6pdgfb/Feovj/AJ9AluP/AB0V09FPma2J9mnucg3w502Zi11qerXJP/Pa6z/SopPhZ4fYfK94jf3hMM/qK7Sin7SfcXsafY4Z/ht9nX/iVeIdTs39TJn/ANB21m3eo+OPBuJb54tV09TgyEZ2jPc4DA+5yOa9LqOSJJYmjkRXRwVZWGQQexqlVf2tSXQX2HYxPDXi3T/E0BNuxiuEGZLd/vL7j1Hv9Olb1eJa5bzeB/HHm2GRGhE0K56xt1Q+3DL9AD1r2m2njubaOeI7o5UDqfUEZFFSCjZx2YqNVyvGW6JaKKKyOgKKKKACiiigAooooAKKKKACiiigAooooAKKKSgDmfGni4eFrSDyrcT3FyWEascKAMZJx9RxXLQ/EPxZcRLLB4dE0bfdeO2lZT9CDVD4s3Zk8RW1sGysNsDj0LMc/oFr0zw5afYvDenWzLho7aMMP9raM/rmum0YU02rtnFedSrKKlZI4X/hPvGX/QsN/wCAk1elRF/LXzAN+Pmx0zTsCqeqatY6NZNd39wsEK8bm7n0A6k+wrGTUvhVjohFwu5SuXaK84uvi7As5Wz0iWaMdGlmCE/gAf51veFPG9t4pkkgS0lt54l3sCd6Yzjhh39iBTdKaV2hRr05OyZ1NFY2veJ9M8O24kvpjvf/AFcMYy7/AEH9TgVyD/Fo/NJFoMjQKceY0+Pz+UgfnSjTlJXSHOtCDs2ekVT1a6+waReXn/PCB5PyUmsnwz4z07xMrRwb4bqMZeCTrjjkEdRk/wD1qi+IV59k8F321wry7Yl98sMj/vnNCg+ZRYSqL2bkjiPhVA1z4nubt8v5Vu2Xbk7mYc/XAavXRXjPgbxRa+GoLz/RJ7u6u2UJFCo6Lnqfct2B6V0kPxZgW78nUdGntQOpWQOy/VSFretCUpuyObD1YQppN6nodFVdP1C11OyjvLOZZoJRlXXvWT4i8ZaV4adYbwzSTuu9YokyduSM5OB1B75rmUW3ZHY5xSu3odBRXmsnxe5LRaGzRj+JrnGf/HT/ADrc8N/EPTdfuVs5Ins7t/uI7Blc+gYd/qB+NW6U0r2M416cnZM66is7WNasdCsTeahMYotwUEKWJY9AAPoa4y5+Llr5m2x0i4n/AOukgjP5ANSjTlLZDnVhDSTPRKSvN4/i5smCXehyRLn5ts+WA+hUfzrttE16w8QWAvLCUumdrKwwyN6EetEqco6tBCtCbtFnmvxaK/8ACR2vHzfYx/6G1el+HUeLw5pscmd62kQOfXYK8q8eGTVviE1ih5Bhto/+BAH+bmvZEARAo4AGAPStaulOKMKGtWch9FcfqPxDsrTWf7Ks7SfUJwwQ+QRgv/dHrjv6V1kDO8KNImxyAWXOdp9M96xcWtzqjOMtmSUUUVJQUUUUAFFFFABRRRQAUUUUAFFFFABSGlprkKpJOAO9AHhnjCeDUPHl6ZZPLg+0LDI/J2BQEY4H0J4r01fiL4UCgf2n/wCS8n/xNeZeGLOHxL42Rb2IyQ3Mks0y5I7Meo5HOK9O/wCFd+Ff+gV/5Hl/+Krsq8itGV9DzaHtHzThbVmpo/iHTNeSV9NuDOsJAc+Wy4J/3gK8r1C6ufiD42is4ZGWzVysRwSEjHLP9TjP5Cu612w0/wAJ+CdU/su3+zrImDh2Y7nwmckk965v4Q2Sm61G+ZfmREiRvqSW/ktRTtGMpr5GlVynKNOXzPQtJ0ex0azW1sbdIkA5IHzMfUnufrTL1rDRLW91VoI48R75nRQGfbnAPqeePrWlXEfFW9e28MR26HH2q4VXHqoBb+YWsYpykl3Omo1Tg2uhynhbT5vHXiu41LVj5kEOJJF7ZP3Ix6Dg/l75r11beJIBCsaLGF2hAoAA9Melcd8LLEW/hU3WAWu52YHHOF+XH5hvzrtautK87dEZ4eFoXe7PFb6OPw18Tgtl+7ihu4yFX+FHALKPbDEV1PxbutmkWFnnmW4Mn4KuP/ZxXLa2RqnxRdY/mDX8URx/s7VP8jV/4tXhl160tDjbBbb/AKMzHP6KtdCV5wv2ONytTqW7nYfDeyS28HWsvlgSXDPI5xyfmIH6AVP460a31TwzdvJGvnWkTTQyY+ZSBkgexAx/+qtXQrNtP0Oxs3ADwW8aPj+8FAP65qt4tuEtvCmqSOwUG1dAT6sNo/UiuXmbqXXc7uVKlyvscT8I9Rk82/0xmJj2ieMehztb8/l/KvQrjStPu7uO7ubOGaaMYR5EDFR14zXmnwmiVL/U752CRwQKjMxwACc9f+AVqX/j3U9Z1FtL8J2XmtyPtMi9h1YA8ADjlvXpWtWDdR8phRqKNJcx6EQNuOK8W8Y20On/ABA2aYgjcSRSBEGAshweB9cH6muvj8GeJb/97rHiq4Qn70VqSF/mB/47XE6PpiSfEiCwikeRLe/OHkOWcREkk/XZ+tVRSi2730JxEnJRTjbU6z4u3e3TtOssf62V5f8AvkAf+z1u/DuxW08HWbmJUln3SOwHLAsduT9MVw/xWujL4mhtw2VgtlyPRiST+m2vVdItPsGj2dn/AM+8CR/koH9KielGK7mlP3q8n2MzxpZ2t34T1H7TGreVA8sZP8LqCVI/GuJ+ERmN/qW3/U+Um/8A3snb+m6up+JV0LfwZcx5w1xIka/99bv5Ka5/4dY0zwfrWsYy6bjjsRGm4fqxpx/gvzFN/wC0LyRg6EF1n4orMdzI17JODnoF3Mv8hXU+N/Gcqzf8I/oRaW9lby5pIuSmeNi4/i9T2+vTz/RLjUtPt7/U9PQZhhEUk3eEOcbh78Ee2a7v4V6fpclnPqAbzdRVykm//lkD02/Xnn6itasUnzPoYUZOS5Fo3qbHgrwVD4etxdXIWXUZF+ZuoiH91f6mutAwKBS1xyk5O7PShBQVkFFFFSUFFFFABRRRQAUUUUAFFFFABRRRQAVj+K7r7H4V1OYNtYWzqp9GYbR+pFbFYHjXTLzV/C13ZWCB53KEIWA3AMCRk8dqqNuZXInfldjhPhHaGTW727z8sNuI8Y7swIP/AI4fzr1kdK8f0bQfiBoImGmWZt/OI3/NA2cZx1J9TWnu+K3v+VtXRVjzyumjjoVPZwUXF/cdP8RY2l8EX4QElfLYgegdc1zvwhuY/I1K2yBIHSTHcggj+n610vhy01q90G5tvFY8yad3TYdg/dFQMfJx13e9cDc+EPFPhXV2u9EEs6AERzQAMxU/wsn4DtjpShZxdNsqpzKcaqWh7DmvPPi/G50zTph9xZmU/Urkf+gmoLe6+I2sXMCmD7DCjqZCyCINg55zlucdq7XxFocPiHRpdPmbYWw0cm3JRx0P9PoTUJezmm2aSftqbSRm/DmRH8EWAQjKGRWGeh3t/j+tbWr6nDo+lXGoTn93AhYjONx7D6k4H415hp1j458GTyxWVgbmCRslUTzY2PTcMEMP0+lWJ9C8Z+NbmIawBY2SNuCsAqqemQmdxPXr781cqacuZtWM41pKCiou5W+G2mz6t4nm1q5ywtyzs5GN8r5/oWP5VT8ShdZ+Jr2+SySXcVufYDarfrmvWdG0W00HTY7GyQiNBks2Nzt3YnuT/nivMr3wt4q0nxPLrVvp0d232hp0aMh1JYk425DcZ9Pxq4VFKbfloZ1KThTirX1uz1wYHHpXnnxV1+OOxi0SGTMszCScD+FByAfqcH/gPuKiPiD4i3yGCHQ0tnYY8wW5Qj6F22/nVzw18PZodQGr+IbgXd3u3rFksA3qxPUj06DHesoxVN80mbTnKquSCMW/srjwt8LkhYGO51S4Xz+oZVIJ2+vRQCD/AHmFb/ws0+GDw296FHnXUx3N32rwB+eT+Nb/AIp8Px+I9EksGfy5AweJyOFcdM+3JH41wWkQeOPBgktoNLF3bO5bYo8xSem5dpyM4HX8qtS9pBq+tyHD2VRO2iR6jczpb20s7nCxoXJ9gM15H8MIDeeLpbqXLNFA8m48/MxA/qa2r7WPHWt2U9jD4cW3jnjaNy4KtgjBwWIA4rU8A+Er3w1FeTX/AJJmuVQKkZyUAzkE9Ocjp6Ul+7g7vVjk3VqRaTsjh9ZK638T3iwSj30cDDrwpCN/6CTXtYGBxXl3hTwl4gt/GcerapYmKPfJK7mRGyzA9gSerV6j2pV2nZLoisNFrmk1uzzr4vXZSx02zGMSyvKf+AgAf+hmoGVtJ+C4DARy3f8A48HkyP8AxwVL8Q/DWva7rUMun2Jnt4oAoPmIvzbiTwSO2Ku+MPD+qXfhPStG020a4a32eYQ6qAETb3I65/Sri48sI36mclLnnK3SyKXws0yG50HVXnQPHdSCB1PdQvP/AKGa5y0mufh741eKYu9uDtk4/wBbCeQw9x1+oI9a9J8DaRcaL4XgtbuEw3Jd3lTIOCWOORx90Cs/4g+E5fEFjFc2MXmX1ucKuQN6E8jJ9Oo59fWkqi9o09mN0WqUXHdHXQypPCssbh0cBlYHIIPQipK5LwHBrunaY2m6zZvEsB/0eQyK2VP8PBPTt7HHausrnkrOx2QlzRTFoooqSgooooAKKKKACiiigAooooAKKKKAEqGeaaPHlW5mz1wwGPzqekqZJtWTsBT+1Xf/AED2/wC/q/40fabv/oHt/wB/V/xq5RWfs5fzv8P8gKf2m7/6B7/9/V/xo+03f/QPb/v6v+NXM0Uezl/O/wAP8gKf2m7/AOge3/f1f8aPtN3/ANA9v+/q/wCNXKWj2cv53+H+QFL7Td/9A9v+/q0C5u886e4/7aL/AI1doo9nL+d/h/kBU+03P/Pi/wD38X/Gj7Tc/wDPi/8A38X/ABq1RR7OX8z/AA/yAq/aLn/nxf8A7+L/AI0fabkf8uL/APfxf8atUU/Zy/mf4f5AVftNz/z4v/38X/Gj7Rc/8+L/APfxf8atUUvZy/mf4f5AVftNz/z4v/38X/Gj7Tc/8+L/APfxf8atVBJeW0VxFbSTxpNNny42cBnwMnA6nin7OX8z/D/ILoZ9puf+fF/+/i/40fabn/nxf/v4v+NWSQBycUopezl/M/w/yAq/abn/AJ8X/wC/i/40fabn/nxf/v4v+NWqQkZx3NHs5fzP8P8AICt9puf+fF/+/i/40fabn/nxf/v4v+NWqKPZy/mf4f5AQwyyyE+ZA0WOmWBz+VTUUtaRTSs3cAoooqgCiiigAooooAKKKKACiiigAooooAQ9K53wxdS32o67dyTSNGL428cbOSqCNQPlHQZJzx1roWyASK5PwxFrNjojWM+lSwXkhmla5eSNo/MYsQThix6gdO1UtmZyfvItaz4gvtGPn3FtZG2EiqEW6PnOpYLkKVxnnOM/jW+8ixxs7EKqjJJ7CuItdGvJLXS7UaLNBdLdwzajeStExm2Hc2XDFmy2MV1OvQ3Nx4fv4LSMyXEtu8cahgMkgjqeO9OSSsiYyerOEgvPtvh21a11K5fxLeOXhRbqTC5kzgrnaFCdQRjj1rt9UvdQsgJLdLDyQuWkubkx5bnjG0j8c/hWG1hqOoaZpOkR6TNZx2bwtLc3DR5UR4+5tYnccdfrUV5puoNJrTXGiy317cmRLG5VoysURTagG5gUwSScDn3q3Zszi3FGl/wlE9zBoos7JPtGro7os0pVYgq7jkhST7cCnR+KjbQas2qWywvpTIrmBy6y7gCoXIBzyBj1IqPT9FurbX9NMkIa00/ShCkuRxMWAbA6/dXr71Rm0HVW0/UJhADcvrP2xYd6jzokZdqk5wOBkZpWiO9S1/62/wAzTTXdUi1jTLG+06CH+0BIcRzl2h2LuO75QD2HFMk8VlfC11ryWqvHHMyQoJP9aBJsU5xxk1Wt7m51TxrJILWS1NlppVEuNhKySPwflY9l9c1n2emau2g6RoJ0ee3FrdxyXkryRmNkVixxhsnJwelHKuouaXTzOkuNYvJdTm07S7aGaW1RWuJJ5SiIW5VRgEkkc+gGPpVjQtVGt6PBf+SYTJuDRlt20qxUjPfkVz8ukGDXNSlvPDratHcyiaCVWjYDKgFWV2AGMdeeDXVWVvFa2ccUFqlrGq8QooAQnkjA46ntUSStoawcm9Tk57myvPFGtf2rqElvZ6fFCkaLdvCu4qWZsKwyegqzoN5rcXhKwmmEDzMrmSS+nKFV3HZnCnJK45OO3WrGgaCI7jUL7U7GBrqa/lmgkdFZ0j4CYbnHAz+NV7u0vV8T3d5e6TLqdusSDT9hjKwnB38MwwScc46Dr2q9HoZpNe8xw8XytotndpZRtc3d99iSPzv3e/cRuDBeV4z0q7p2tXsutXGk31rDHNFAs6yQSFkIJIwcgEHj3rI0vw/qNqnhi3mizHZGaa8JZTtkZSVHXk5c8jPSl1LSNbkl8SXdmGWa78iO12yBWMaD58HPyk5YDOKGo7L+tQTna7/rQ0E1+/h1yz02+trIG8LgfZ7oyNGVUt8wKjg468Vj2GoXEGo+JvEdzBbyR2ubdQJSWUxKPkUlejE8+/Y1esNL3a/YTwaG+m2VhBLt3+WC0j7R0ViT8oPJqodA1O48ESafLabLzUb0y3Sh1+QGbcWznB+VR09aa5UJ8z1/rYu6neyyWGmrrOl20n22/hjjgjmY7M/NuYkDJGOmMVci1q/v766h0qzt5bezl8mWeaYoGkH3lUBT04BJxz607VLG7uvEmizRJmzs/OeY5H3igVOOvdqqeG4tS0pp9MuNNmKtdSyLeq6FGViWBIzuz0GMGp0sX7ylYn1/Xb7RIZrw29i9rEAQHuissg4zgbcZ68ZOaZcahZ/8JYiyWi+Za6a9z9pZzmNSwBXHTnGc+1YQ0PUbrRjp95o8r6ld3K/bdQZoyGjEoJIbduwFAAXA+laWpaXqsk3ieeK181ry2itrP5lBK7SH78csevpVcsUTzSepJH4o1JbXSr+6023jtdTniiRUuC0ieZ90n5QD64q3Nrd/cXF7HpNlBcR2J2SyTT7A8gGSi4B5GRknHJqK70e4Nx4dsooN9lYP5kz7gNhSPEfGcnJPb0rMttF+w3eoJfeGDqjS3Us0M+YmR1c55DsNpHQ8dqVohea0Os0q+XU9Ltr5UKLcxLIFJyVyM4q5UcEMdvCkMUaxxoAqIgwFA6AAdBUlZHQttQooooGFFFFABRRRQAUUUUAFFFFABRRRQAh5oxS0UAJijFLRQAmKMUtFACYoIpaKAKdvpdta6hd38anz7zZ5rFic7RhcDtVvFLRQJKwmKKWigYmKMUtFACYoxS0UAJijFLRQAmKMClooATFGKWigBMD0oxS0UAJS0UUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAf//Z', NULL, 'permanent', '2025-07-29 10:56:43', '2025-07-30 09:39:30', 6000.00, NULL, NULL, 'France', 'Contact d\'urgence', '+33 1 23 45 67 89', 'Famille'),
(8, 'MrGentil', 'Bilongo', 'bedi@totem-experience.com', '+243897875654', 'Son adresse à elle', '2002-05-06 00:00:00', '2023-07-31 00:00:00', 6, 3, NULL, 'actif', NULL, NULL, 'permanent', '2025-07-31 16:12:09', '2025-07-31 16:12:09', NULL, NULL, NULL, 'France', 'Contact d\'urgence', '+33 1 23 45 67 89', 'Famille');

-- --------------------------------------------------------

--
-- Structure de la table `employee_trainings`
--

CREATE TABLE `employee_trainings` (
  `id` int UNSIGNED NOT NULL,
  `employeeId` int UNSIGNED NOT NULL,
  `trainingId` int UNSIGNED NOT NULL,
  `status` enum('inscrit','terminé','annulé') NOT NULL DEFAULT 'inscrit',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `invoices`
--

CREATE TABLE `invoices` (
  `id` int UNSIGNED NOT NULL,
  `number` varchar(255) NOT NULL,
  `amount` float NOT NULL,
  `dueDate` datetime NOT NULL,
  `status` enum('payée','en retard','annulée') NOT NULL DEFAULT 'en retard',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `job_offers`
--

CREATE TABLE `job_offers` (
  `id` int UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `departmentId` int UNSIGNED NOT NULL,
  `postedDate` datetime NOT NULL,
  `status` enum('ouverte','fermée') NOT NULL DEFAULT 'ouverte',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `job_titles`
--

CREATE TABLE `job_titles` (
  `id` int UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `job_titles`
--

INSERT INTO `job_titles` (`id`, `title`, `description`, `createdAt`, `updatedAt`) VALUES
(1, 'Directeur RH', 'Direction des ressources humaines', '2025-07-28 13:57:04', '2025-07-28 13:57:04'),
(2, 'Responsable RH', 'Gestion RH opérationnelle', '2025-07-28 13:57:04', '2025-07-28 13:57:04'),
(3, 'Développeur Full-Stack', 'Développement web', '2025-07-28 13:57:04', '2025-07-28 13:57:04'),
(4, 'Développeur Frontend', 'Interface utilisateur', '2025-07-28 13:57:04', '2025-07-28 13:57:04'),
(5, 'Développeur Backend', 'Logique métier', '2025-07-28 13:57:04', '2025-07-28 13:57:04'),
(6, 'Chef de Projet', 'Gestion de projets', '2025-07-28 13:57:04', '2025-07-28 13:57:04'),
(7, 'Chargé de Marketing', 'Marketing digital', '2025-07-28 13:57:04', '2025-07-28 13:57:04'),
(8, 'Comptable', 'Comptabilité générale', '2025-07-28 13:57:04', '2025-07-28 13:57:04'),
(9, 'Commercial', 'Vente et prospection', '2025-07-28 13:57:04', '2025-07-28 13:57:04');

-- --------------------------------------------------------

--
-- Structure de la table `leaves`
--

CREATE TABLE `leaves` (
  `id` int UNSIGNED NOT NULL,
  `employeeId` int UNSIGNED NOT NULL,
  `leaveTypeId` int UNSIGNED NOT NULL,
  `startDate` datetime NOT NULL,
  `endDate` datetime NOT NULL,
  `status` enum('en attente','approuvé','refusé') NOT NULL DEFAULT 'en attente',
  `commentaire` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `leave_types`
--

CREATE TABLE `leave_types` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `leave_types`
--

INSERT INTO `leave_types` (`id`, `name`, `description`, `createdAt`, `updatedAt`) VALUES
(1, 'Congés Payés', 'Congés annuels', '2025-07-28 13:57:04', '2025-07-28 13:57:04'),
(2, 'Maladie', 'Arrêt maladie', '2025-07-28 13:57:04', '2025-07-28 13:57:04'),
(3, 'RTT', 'Réduction du temps de travail', '2025-07-28 13:57:04', '2025-07-28 13:57:04'),
(4, 'Congé Maternité', 'Congé maternité', '2025-07-28 13:57:04', '2025-07-28 13:57:04'),
(5, 'Congé Paternité', 'Congé paternité', '2025-07-28 13:57:04', '2025-07-28 13:57:04'),
(6, 'Formation', 'Congé formation', '2025-07-28 13:57:05', '2025-07-28 13:57:05');

-- --------------------------------------------------------

--
-- Structure de la table `messages`
--

CREATE TABLE `messages` (
  `id` int UNSIGNED NOT NULL,
  `senderId` int UNSIGNED NOT NULL,
  `receiverId` int UNSIGNED NOT NULL,
  `content` text NOT NULL,
  `timestamp` datetime NOT NULL,
  `isRead` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `notifications`
--

CREATE TABLE `notifications` (
  `id` int UNSIGNED NOT NULL,
  `employeeId` int UNSIGNED NOT NULL,
  `type` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `isRead` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `payrolls`
--

CREATE TABLE `payrolls` (
  `id` int UNSIGNED NOT NULL,
  `employeeId` int UNSIGNED NOT NULL,
  `month` int NOT NULL,
  `year` int NOT NULL,
  `basicSalary` float NOT NULL,
  `overtime` float NOT NULL DEFAULT '0',
  `deductions` float NOT NULL DEFAULT '0',
  `netSalary` float NOT NULL,
  `fichePaieUrl` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `roles`
--

CREATE TABLE `roles` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `permissions` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `roles`
--

INSERT INTO `roles` (`id`, `name`, `permissions`, `createdAt`, `updatedAt`) VALUES
(1, 'Admin', '[\"all\"]', '2025-07-28 13:57:03', '2025-07-28 13:57:03'),
(2, 'RH', '[\"employees:view\",\"employees:create\",\"employees:edit\",\"employees:view_salary\",\"employees:edit_salary\",\"employees:view_personal\",\"employees:edit_personal\",\"users:view\",\"users:create\",\"users:edit\",\"users:suspend\",\"users:activate\",\"roles:view\",\"departments:view\",\"departments:create\",\"departments:edit\",\"leaves:view_all\",\"leaves:approve\",\"leaves:reject\",\"payroll:view_all\",\"payroll:create\",\"payroll:edit\",\"payroll:process\",\"documents:view_all\",\"documents:upload\",\"documents:delete\",\"notifications:view\",\"notifications:send\",\"dashboard:view\",\"dashboard:view_stats\",\"dashboard:view_financial\"]', '2025-07-28 13:57:03', '2025-07-31 11:03:11'),
(3, 'Manager', '[\"employees:view\",\"employees:view_personal\",\"leaves:view\",\"leaves:approve\",\"leaves:reject\",\"documents:view\",\"documents:upload\",\"notifications:view\",\"dashboard:view\",\"dashboard:view_stats\"]', '2025-07-28 13:57:03', '2025-07-31 11:03:11'),
(4, 'Comptable', '[\"payroll\",\"employees\"]', '2025-07-28 13:57:03', '2025-07-28 13:57:03'),
(5, 'Employé', '[\"employee.view\",\"leave.request\",\"leave.view\",\"reports.view\"]', '2025-07-28 13:57:04', '2025-07-29 11:12:48'),
(6, 'Stagiaire', '[\"profile\",\"employees\"]', '2025-07-28 13:57:04', '2025-07-28 13:57:04'),
(7, 'Administrateur', '[\"employee.view\",\"employee.create\",\"employee.update\",\"employee.delete\",\"employee.export\",\"payroll.view\",\"payroll.update\",\"payroll.generate\",\"payroll.export\",\"leave.view\",\"leave.approve\",\"leave.manage\",\"leave.request\",\"user.view\",\"user.create\",\"user.update\",\"user.delete\",\"user.suspend\",\"role.view\",\"role.create\",\"role.update\",\"role.delete\",\"department.view\",\"department.create\",\"department.update\",\"department.delete\",\"system.logs\",\"system.settings\",\"system.backup\",\"reports.view\",\"reports.generate\",\"reports.export\",\"audit.view\",\"audit.export\"]', '2025-07-29 11:12:48', '2025-07-29 11:12:48'),
(9, 'Employee', '[\"employees:view\",\"employees:view_personal\",\"leaves:view\",\"leaves:create\",\"leaves:edit\",\"documents:view\",\"documents:upload\",\"notifications:view\",\"dashboard:view\"]', '2025-07-31 11:03:11', '2025-07-31 11:03:11');

-- --------------------------------------------------------

--
-- Structure de la table `trainings`
--

CREATE TABLE `trainings` (
  `id` int UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `startDate` datetime NOT NULL,
  `endDate` datetime NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int UNSIGNED NOT NULL,
  `employeeId` int UNSIGNED DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `roleId` int UNSIGNED NOT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `photoUrl` varchar(10000) DEFAULT NULL,
  `salary` decimal(10,2) DEFAULT NULL COMMENT 'Salaire brut annuel en euros',
  `firstName` varchar(100) DEFAULT NULL,
  `lastName` varchar(100) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `address` text,
  `city` varchar(100) DEFAULT NULL,
  `postalCode` varchar(20) DEFAULT NULL,
  `country` varchar(100) DEFAULT 'France',
  `emergencyContactName` varchar(255) DEFAULT NULL,
  `emergencyContactPhone` varchar(50) DEFAULT NULL,
  `emergencyContactRelationship` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `employeeId`, `username`, `email`, `password`, `roleId`, `isActive`, `createdAt`, `updatedAt`, `photoUrl`, `salary`, `firstName`, `lastName`, `phone`, `address`, `city`, `postalCode`, `country`, `emergencyContactName`, `emergencyContactPhone`, `emergencyContactRelationship`) VALUES
(1, 1, 'admin', 'admin@rh-app.com', '$2a$10$9qMICyeyRqhXO.tsuhuBK.IiVYlI3RX1V5AtEzOzch6TiHJL.VDfW', 1, 1, '2025-07-28 13:57:06', '2025-07-28 13:57:06', NULL, NULL, 'Admin', 'Système', '0123456789', '123 Rue Admin, 75000 Paris', NULL, NULL, 'France', 'Contact d\'urgence', '+33 1 23 45 67 89', 'Famille'),
(6, 7, 'bedi', 'tshitshob@gmail.com', '$2a$10$qNIxZCpSIqrG/ogevqfr0eH0tyAYAHWCUgINk52G.L0cjSxC4fBwK', 1, 1, '2025-07-29 10:56:43', '2025-07-30 09:39:30', 'data:image/jpeg;base64,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', 6000.00, 'bedi', 'tshitsho', '+243812380589', 'Mon adresse', NULL, NULL, 'France', 'Contact d\'urgence', '+33 1 23 45 67 89', 'Famille'),
(7, 8, 'mrgentil', 'bedi@totem-experience.com', '$2a$10$iv2dOEZij/8CEXM6OgoSwOicBtu734KCkIClWXwEAPY2hVwc99x5u', 3, 1, '2025-07-31 16:12:09', '2025-07-31 16:13:20', NULL, NULL, 'MrGentil', 'Bilongo', '+243897875654', 'Son adresse à elle', NULL, NULL, 'France', 'Contact d\'urgence', '+33 1 23 45 67 89', 'Famille');

-- --------------------------------------------------------

--
-- Doublure de structure pour la vue `user_profiles`
-- (Voir ci-dessous la vue réelle)
--
CREATE TABLE `user_profiles` (
`userId` int unsigned
,`username` varchar(255)
,`email` varchar(255)
,`firstName` varchar(100)
,`lastName` varchar(100)
,`phone` varchar(50)
,`address` text
,`city` varchar(100)
,`postalCode` varchar(20)
,`country` varchar(100)
,`photoUrl` varchar(10000)
,`salary` decimal(10,2)
,`emergencyContactName` varchar(255)
,`emergencyContactPhone` varchar(50)
,`emergencyContactRelationship` varchar(100)
,`userCreatedAt` datetime
,`userUpdatedAt` datetime
,`employeeId` int unsigned
,`birthDate` datetime
,`hireDate` datetime
,`employeeStatus` enum('actif','suspendu','démissionnaire','licencié')
,`employeeType` enum('permanent','stagiaire','cdi','cdd')
,`contractEndDate` datetime
,`departmentName` varchar(255)
,`jobTitle` varchar(255)
,`roleName` varchar(255)
,`rolePermissions` text
);

-- --------------------------------------------------------

--
-- Structure de la vue `user_profiles`
--
DROP TABLE IF EXISTS `user_profiles`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `user_profiles`  AS SELECT `u`.`id` AS `userId`, `u`.`username` AS `username`, `u`.`email` AS `email`, `u`.`firstName` AS `firstName`, `u`.`lastName` AS `lastName`, `u`.`phone` AS `phone`, `u`.`address` AS `address`, `u`.`city` AS `city`, `u`.`postalCode` AS `postalCode`, `u`.`country` AS `country`, `u`.`photoUrl` AS `photoUrl`, `u`.`salary` AS `salary`, `u`.`emergencyContactName` AS `emergencyContactName`, `u`.`emergencyContactPhone` AS `emergencyContactPhone`, `u`.`emergencyContactRelationship` AS `emergencyContactRelationship`, `u`.`createdAt` AS `userCreatedAt`, `u`.`updatedAt` AS `userUpdatedAt`, `e`.`id` AS `employeeId`, `e`.`birthDate` AS `birthDate`, `e`.`hireDate` AS `hireDate`, `e`.`status` AS `employeeStatus`, `e`.`employeeType` AS `employeeType`, `e`.`contractEndDate` AS `contractEndDate`, `d`.`name` AS `departmentName`, `jt`.`title` AS `jobTitle`, `r`.`name` AS `roleName`, `r`.`permissions` AS `rolePermissions` FROM ((((`users` `u` left join `employees` `e` on((`u`.`employeeId` = `e`.`id`))) left join `departments` `d` on((`e`.`departmentId` = `d`.`id`))) left join `job_titles` `jt` on((`e`.`jobTitleId` = `jt`.`id`))) left join `roles` `r` on((`u`.`roleId` = `r`.`id`))) ;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `postedBy` (`postedBy`);

--
-- Index pour la table `applications`
--
ALTER TABLE `applications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `candidateId` (`candidateId`),
  ADD KEY `jobOfferId` (`jobOfferId`);

--
-- Index pour la table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `candidates`
--
ALTER TABLE `candidates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Index pour la table `contracts`
--
ALTER TABLE `contracts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `employeeId` (`employeeId`);

--
-- Index pour la table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Index pour la table `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employeeId` (`employeeId`);

--
-- Index pour la table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `jobTitleId` (`jobTitleId`),
  ADD KEY `departmentId` (`departmentId`),
  ADD KEY `managerId` (`managerId`);

--
-- Index pour la table `employee_trainings`
--
ALTER TABLE `employee_trainings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employeeId` (`employeeId`),
  ADD KEY `trainingId` (`trainingId`);

--
-- Index pour la table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `number` (`number`);

--
-- Index pour la table `job_offers`
--
ALTER TABLE `job_offers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `departmentId` (`departmentId`);

--
-- Index pour la table `job_titles`
--
ALTER TABLE `job_titles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `title` (`title`);

--
-- Index pour la table `leaves`
--
ALTER TABLE `leaves`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employeeId` (`employeeId`),
  ADD KEY `leaveTypeId` (`leaveTypeId`);

--
-- Index pour la table `leave_types`
--
ALTER TABLE `leave_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Index pour la table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `senderId` (`senderId`),
  ADD KEY `receiverId` (`receiverId`);

--
-- Index pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employeeId` (`employeeId`);

--
-- Index pour la table `payrolls`
--
ALTER TABLE `payrolls`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employeeId` (`employeeId`);

--
-- Index pour la table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Index pour la table `trainings`
--
ALTER TABLE `trainings`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `employeeId` (`employeeId`),
  ADD KEY `roleId` (`roleId`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `announcements`
--
ALTER TABLE `announcements`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `applications`
--
ALTER TABLE `applications`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `audit_logs`
--
ALTER TABLE `audit_logs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `candidates`
--
ALTER TABLE `candidates`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `contracts`
--
ALTER TABLE `contracts`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `documents`
--
ALTER TABLE `documents`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `employee_trainings`
--
ALTER TABLE `employee_trainings`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `job_offers`
--
ALTER TABLE `job_offers`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `job_titles`
--
ALTER TABLE `job_titles`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `leaves`
--
ALTER TABLE `leaves`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `leave_types`
--
ALTER TABLE `leave_types`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `payrolls`
--
ALTER TABLE `payrolls`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `trainings`
--
ALTER TABLE `trainings`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `announcements`
--
ALTER TABLE `announcements`
  ADD CONSTRAINT `announcements_ibfk_1` FOREIGN KEY (`postedBy`) REFERENCES `employees` (`id`) ON UPDATE CASCADE;

--
-- Contraintes pour la table `applications`
--
ALTER TABLE `applications`
  ADD CONSTRAINT `applications_ibfk_1` FOREIGN KEY (`candidateId`) REFERENCES `candidates` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `applications_ibfk_2` FOREIGN KEY (`jobOfferId`) REFERENCES `job_offers` (`id`) ON UPDATE CASCADE;

--
-- Contraintes pour la table `contracts`
--
ALTER TABLE `contracts`
  ADD CONSTRAINT `contracts_ibfk_1` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `documents`
--
ALTER TABLE `documents`
  ADD CONSTRAINT `documents_ibfk_1` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`jobTitleId`) REFERENCES `job_titles` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_2` FOREIGN KEY (`departmentId`) REFERENCES `departments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_3` FOREIGN KEY (`managerId`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Contraintes pour la table `employee_trainings`
--
ALTER TABLE `employee_trainings`
  ADD CONSTRAINT `employee_trainings_ibfk_1` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employee_trainings_ibfk_2` FOREIGN KEY (`trainingId`) REFERENCES `trainings` (`id`) ON UPDATE CASCADE;

--
-- Contraintes pour la table `job_offers`
--
ALTER TABLE `job_offers`
  ADD CONSTRAINT `job_offers_ibfk_1` FOREIGN KEY (`departmentId`) REFERENCES `departments` (`id`) ON UPDATE CASCADE;

--
-- Contraintes pour la table `leaves`
--
ALTER TABLE `leaves`
  ADD CONSTRAINT `leaves_ibfk_1` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leaves_ibfk_2` FOREIGN KEY (`leaveTypeId`) REFERENCES `leave_types` (`id`) ON UPDATE CASCADE;

--
-- Contraintes pour la table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`senderId`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiverId`) REFERENCES `employees` (`id`) ON UPDATE CASCADE;

--
-- Contraintes pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `payrolls`
--
ALTER TABLE `payrolls`
  ADD CONSTRAINT `payrolls_ibfk_1` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`) ON UPDATE CASCADE;

--
-- Contraintes pour la table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_2` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
