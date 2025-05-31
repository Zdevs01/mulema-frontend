-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : sam. 31 mai 2025 à 15:12
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `mulemaap_db`
--

-- --------------------------------------------------------

--
-- Structure de la table `language`
--

CREATE TABLE `language` (
  `id` int(11) NOT NULL,
  `nom` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `actus` int(200) NOT NULL DEFAULT 1,
  `video_intro` text NOT NULL,
  `vue` int(200) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Déchargement des données de la table `language`
--

INSERT INTO `language` (`id`, `nom`, `description`, `actus`, `video_intro`, `vue`) VALUES
(1, 'Duálá', ' Apprends le **duálá**, langue vibrante des peuples côtiers ! Plonge dans la culture, les sons et les traditions du Littoral .', 1, 'douala.mp4', 0),
(2, 'Bassa', 'Le **bassa** est une langue riche et rythmée du Centre et du Littoral. Découvre ses mots puissants et ses expressions uniques ! ✨', 1, 'bassa.mp4', 0),
(3, 'Ghomálá', 'Le **ghomálá** est une langue fascinante des hauts plateaux de l’Ouest. Apprends à t’exprimer comme un vrai Bamiléké .', 1, 'ghomala.mp4', 0);

-- --------------------------------------------------------

--
-- Structure de la table `niveau1_progress`
--

CREATE TABLE `niveau1_progress` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `avancer` int(11) NOT NULL DEFAULT 1,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `niveau1_progress1`
--

CREATE TABLE `niveau1_progress1` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `avancer` int(11) NOT NULL DEFAULT 1,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `niveau1_progress2`
--

CREATE TABLE `niveau1_progress2` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `avancer` int(11) NOT NULL DEFAULT 1,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `theme0`
--

CREATE TABLE `theme0` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `avancer` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `theme0`
--

INSERT INTO `theme0` (`id`, `user_id`, `avancer`) VALUES
(6, 32, 1),
(7, 33, 2);

-- --------------------------------------------------------

--
-- Structure de la table `theme1`
--

CREATE TABLE `theme1` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `avancer` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `theme1`
--

INSERT INTO `theme1` (`id`, `user_id`, `avancer`) VALUES
(6, 33, 1);

-- --------------------------------------------------------

--
-- Structure de la table `theme2`
--

CREATE TABLE `theme2` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `avancer` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `theme2`
--

INSERT INTO `theme2` (`id`, `user_id`, `avancer`) VALUES
(6, 33, 1);

-- --------------------------------------------------------

--
-- Structure de la table `theme3`
--

CREATE TABLE `theme3` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `avancer` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `img` varchar(900) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `id_langue` int(11) DEFAULT NULL,
  `vue` int(200) NOT NULL DEFAULT 0,
  `vue_video_intro` tinyint(4) DEFAULT 0,
  `photo_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `email`, `username`, `password`, `img`, `created_at`, `id_langue`, `vue`, `vue_video_intro`, `photo_url`) VALUES
(32, 'yann@gmail.com', 'yann', '$2b$10$qxJVVHAMvG.QJT/w9MMzCeeD0Rn8BaM7LY7kI6adYL9dvLnmwuShC', '', '2025-05-23 06:50:51', NULL, 0, 0, NULL),
(33, 'yann1@gmail.com', 'yann', '$2b$10$jLUFyL.DzcOdICYuRsZabOam24bKA8hf161Qg.0mX4RkfO1jdK5gO', '', '2025-05-23 06:53:13', NULL, 0, 0, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `user_langue`
--

CREATE TABLE `user_langue` (
  `id` int(11) NOT NULL,
  `id_utilisateur` int(11) NOT NULL,
  `id_langue` int(11) NOT NULL,
  `vue` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `user_lessons`
--

CREATE TABLE `user_lessons` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `lesson_number` int(11) NOT NULL DEFAULT 1,
  `status` varchar(20) DEFAULT 'locked',
  `completed` tinyint(1) DEFAULT 0,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `user_lessons`
--

INSERT INTO `user_lessons` (`id`, `user_id`, `lesson_number`, `status`, `completed`, `updated_at`) VALUES
(14, 32, 1, 'unlocked', 0, '2025-05-23 06:50:51'),
(15, 33, 1, 'unlocked', 0, '2025-05-23 06:53:13');

-- --------------------------------------------------------

--
-- Structure de la table `user_lessons1`
--

CREATE TABLE `user_lessons1` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `lesson_number` int(11) NOT NULL DEFAULT 1,
  `status` varchar(20) DEFAULT 'locked',
  `completed` tinyint(1) DEFAULT 0,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `user_lessons1`
--

INSERT INTO `user_lessons1` (`id`, `user_id`, `lesson_number`, `status`, `completed`, `updated_at`) VALUES
(14, 33, 1, 'unlocked', 0, '2025-05-23 06:53:14');

-- --------------------------------------------------------

--
-- Structure de la table `user_lessons2`
--

CREATE TABLE `user_lessons2` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `lesson_number` int(11) NOT NULL DEFAULT 1,
  `status` varchar(20) DEFAULT 'locked',
  `completed` tinyint(1) DEFAULT 0,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `user_lessons2`
--

INSERT INTO `user_lessons2` (`id`, `user_id`, `lesson_number`, `status`, `completed`, `updated_at`) VALUES
(14, 33, 1, 'unlocked', 0, '2025-05-23 06:53:14');

-- --------------------------------------------------------

--
-- Structure de la table `user_stats`
--

CREATE TABLE `user_stats` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `cauris` int(11) DEFAULT 5,
  `last_cauri_update` datetime DEFAULT current_timestamp(),
  `crevettes` int(11) DEFAULT 0,
  `time1` int(11) DEFAULT NULL,
  `time2` int(11) DEFAULT NULL,
  `time3` int(11) DEFAULT NULL,
  `time4` int(11) DEFAULT NULL,
  `time5` int(11) DEFAULT NULL,
  `time6` int(11) DEFAULT NULL,
  `time7` int(11) DEFAULT NULL,
  `time8` int(11) DEFAULT NULL,
  `time9` int(11) DEFAULT NULL,
  `time10` int(11) DEFAULT NULL,
  `time11` int(11) DEFAULT NULL,
  `time12` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `user_stats`
--

INSERT INTO `user_stats` (`id`, `user_id`, `cauris`, `last_cauri_update`, `crevettes`, `time1`, `time2`, `time3`, `time4`, `time5`, `time6`, `time7`, `time8`, `time9`, `time10`, `time11`, `time12`) VALUES
(8, 32, 0, '2025-05-23 07:50:51', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(9, 33, 5, '2025-05-23 07:53:13', 700, 102, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `user_stats1`
--

CREATE TABLE `user_stats1` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `cauris` int(11) DEFAULT 5,
  `last_cauri_update` datetime DEFAULT current_timestamp(),
  `crevettes` int(11) DEFAULT 0,
  `time1` int(11) DEFAULT NULL,
  `time2` int(11) DEFAULT NULL,
  `time3` int(11) DEFAULT NULL,
  `time4` int(11) DEFAULT NULL,
  `time5` int(11) DEFAULT NULL,
  `time6` int(11) DEFAULT NULL,
  `time7` int(11) DEFAULT NULL,
  `time8` int(11) DEFAULT NULL,
  `time9` int(11) DEFAULT NULL,
  `time10` int(11) DEFAULT NULL,
  `time11` int(11) DEFAULT NULL,
  `time12` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `user_stats1`
--

INSERT INTO `user_stats1` (`id`, `user_id`, `cauris`, `last_cauri_update`, `crevettes`, `time1`, `time2`, `time3`, `time4`, `time5`, `time6`, `time7`, `time8`, `time9`, `time10`, `time11`, `time12`) VALUES
(8, 33, 5, '2025-05-23 07:53:14', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `user_stats2`
--

CREATE TABLE `user_stats2` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `cauris` int(11) DEFAULT 5,
  `last_cauri_update` datetime DEFAULT current_timestamp(),
  `crevettes` int(11) DEFAULT 0,
  `time1` int(11) DEFAULT NULL,
  `time2` int(11) DEFAULT NULL,
  `time3` int(11) DEFAULT NULL,
  `time4` int(11) DEFAULT NULL,
  `time5` int(11) DEFAULT NULL,
  `time6` int(11) DEFAULT NULL,
  `time7` int(11) DEFAULT NULL,
  `time8` int(11) DEFAULT NULL,
  `time9` int(11) DEFAULT NULL,
  `time10` int(11) DEFAULT NULL,
  `time11` int(11) DEFAULT NULL,
  `time12` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `user_stats2`
--

INSERT INTO `user_stats2` (`id`, `user_id`, `cauris`, `last_cauri_update`, `crevettes`, `time1`, `time2`, `time3`, `time4`, `time5`, `time6`, `time7`, `time8`, `time9`, `time10`, `time11`, `time12`) VALUES
(8, 33, 5, '2025-05-23 07:53:14', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `user_video_views`
--

CREATE TABLE `user_video_views` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `langue_id` int(11) NOT NULL,
  `viewed` tinyint(1) DEFAULT 0,
  `viewed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `language`
--
ALTER TABLE `language`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `niveau1_progress`
--
ALTER TABLE `niveau1_progress`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user` (`user_id`);

--
-- Index pour la table `niveau1_progress1`
--
ALTER TABLE `niveau1_progress1`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user` (`user_id`);

--
-- Index pour la table `niveau1_progress2`
--
ALTER TABLE `niveau1_progress2`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user` (`user_id`);

--
-- Index pour la table `theme0`
--
ALTER TABLE `theme0`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `theme1`
--
ALTER TABLE `theme1`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `theme2`
--
ALTER TABLE `theme2`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `theme3`
--
ALTER TABLE `theme3`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_users_language` (`id_langue`);

--
-- Index pour la table `user_langue`
--
ALTER TABLE `user_langue`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_utilisateur` (`id_utilisateur`,`id_langue`),
  ADD KEY `id_langue` (`id_langue`);

--
-- Index pour la table `user_lessons`
--
ALTER TABLE `user_lessons`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `user_lessons1`
--
ALTER TABLE `user_lessons1`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `user_lessons2`
--
ALTER TABLE `user_lessons2`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `user_stats`
--
ALTER TABLE `user_stats`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `user_stats1`
--
ALTER TABLE `user_stats1`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `user_stats2`
--
ALTER TABLE `user_stats2`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `user_video_views`
--
ALTER TABLE `user_video_views`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_view` (`user_id`,`langue_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `language`
--
ALTER TABLE `language`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `niveau1_progress`
--
ALTER TABLE `niveau1_progress`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `niveau1_progress1`
--
ALTER TABLE `niveau1_progress1`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `niveau1_progress2`
--
ALTER TABLE `niveau1_progress2`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `theme0`
--
ALTER TABLE `theme0`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `theme1`
--
ALTER TABLE `theme1`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `theme2`
--
ALTER TABLE `theme2`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `theme3`
--
ALTER TABLE `theme3`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT pour la table `user_langue`
--
ALTER TABLE `user_langue`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `user_lessons`
--
ALTER TABLE `user_lessons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT pour la table `user_lessons1`
--
ALTER TABLE `user_lessons1`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT pour la table `user_lessons2`
--
ALTER TABLE `user_lessons2`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT pour la table `user_stats`
--
ALTER TABLE `user_stats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `user_stats1`
--
ALTER TABLE `user_stats1`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `user_stats2`
--
ALTER TABLE `user_stats2`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `user_video_views`
--
ALTER TABLE `user_video_views`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `niveau1_progress`
--
ALTER TABLE `niveau1_progress`
  ADD CONSTRAINT `niveau1_progress_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `niveau1_progress1`
--
ALTER TABLE `niveau1_progress1`
  ADD CONSTRAINT `niveau1_progress1_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `niveau1_progress2`
--
ALTER TABLE `niveau1_progress2`
  ADD CONSTRAINT `niveau1_progress2_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `theme0`
--
ALTER TABLE `theme0`
  ADD CONSTRAINT `theme0_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `theme1`
--
ALTER TABLE `theme1`
  ADD CONSTRAINT `theme1_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `theme2`
--
ALTER TABLE `theme2`
  ADD CONSTRAINT `theme2_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `theme3`
--
ALTER TABLE `theme3`
  ADD CONSTRAINT `theme3_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_users_language` FOREIGN KEY (`id_langue`) REFERENCES `language` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Contraintes pour la table `user_langue`
--
ALTER TABLE `user_langue`
  ADD CONSTRAINT `user_langue_ibfk_1` FOREIGN KEY (`id_utilisateur`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `user_langue_ibfk_2` FOREIGN KEY (`id_langue`) REFERENCES `language` (`id`);

--
-- Contraintes pour la table `user_lessons`
--
ALTER TABLE `user_lessons`
  ADD CONSTRAINT `user_lessons_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `user_lessons1`
--
ALTER TABLE `user_lessons1`
  ADD CONSTRAINT `user_lessons1_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `user_lessons2`
--
ALTER TABLE `user_lessons2`
  ADD CONSTRAINT `user_lessons2_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `user_stats`
--
ALTER TABLE `user_stats`
  ADD CONSTRAINT `user_stats_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `user_stats1`
--
ALTER TABLE `user_stats1`
  ADD CONSTRAINT `user_stats1_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `user_stats2`
--
ALTER TABLE `user_stats2`
  ADD CONSTRAINT `user_stats2_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
