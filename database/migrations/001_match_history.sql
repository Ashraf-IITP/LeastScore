-- Run against leastscore database to add match history tables.
USE `leastscore`;

CREATE TABLE IF NOT EXISTS `matches` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `room_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mode` enum('online','friends','ai','play_along') COLLATE utf8mb4_unicode_ci NOT NULL,
  `player_count` tinyint unsigned NOT NULL,
  `started_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ended_at` timestamp NULL DEFAULT NULL,
  `winner_seat` tinyint unsigned DEFAULT NULL,
  `end_reason` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_matches_started` (`started_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `match_participants` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `match_id` bigint unsigned NOT NULL,
  `seat_index` tinyint unsigned NOT NULL,
  `username` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int unsigned DEFAULT NULL,
  `is_bot` tinyint(1) NOT NULL DEFAULT '0',
  `bot_difficulty` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_guest` tinyint(1) NOT NULL DEFAULT '0',
  `guest_session_id` int unsigned DEFAULT NULL,
  `final_score` int DEFAULT NULL,
  `placement` tinyint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_match_seat` (`match_id`,`seat_index`),
  KEY `idx_participant_user` (`user_id`,`match_id`),
  CONSTRAINT `fk_match_participants_match` FOREIGN KEY (`match_id`) REFERENCES `matches` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_match_participants_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `match_moves` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `match_id` bigint unsigned NOT NULL,
  `move_number` int unsigned NOT NULL,
  `event_type` enum('deal','turn','declare','eliminate','disconnect','poll_start','game_end','bots_only_end') COLLATE utf8mb4_unicode_ci NOT NULL,
  `acting_player` tinyint unsigned DEFAULT NULL,
  `payload` json NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_match_move` (`match_id`,`move_number`),
  CONSTRAINT `fk_match_moves_match` FOREIGN KEY (`match_id`) REFERENCES `matches` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
