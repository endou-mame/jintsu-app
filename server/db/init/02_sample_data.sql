-- サンプル病院データ
INSERT INTO hospitals (name, phone_number, address, notes, is_primary) VALUES
('東京産婦人科クリニック', '03-1234-5678', '東京都新宿区西新宿1-1-1', '24時間対応可能、担当医：田中先生', true),
('さくら産院', '03-9876-5432', '東京都世田谷区三軒茶屋2-2-2', '予約制、駐車場あり', false);

-- サンプル陣痛記録データ（現在時刻から遡って記録）
-- 以下のデータは、間隔が徐々に短くなっていく様子を表現しています

-- 3時間前の記録（間隔：約20分）
INSERT INTO contractions (start_time, end_time, duration_seconds) VALUES
(NOW() - INTERVAL '3 hours', NOW() - INTERVAL '3 hours' + INTERVAL '3 minutes', 180);

-- 2時間40分前の記録（間隔：約18分）
INSERT INTO contractions (start_time, end_time, duration_seconds) VALUES
(NOW() - INTERVAL '2 hours 40 minutes', NOW() - INTERVAL '2 hours 40 minutes' + INTERVAL '3 minutes 30 seconds', 210);

-- 2時間22分前の記録（間隔：約15分）
INSERT INTO contractions (start_time, end_time, duration_seconds) VALUES
(NOW() - INTERVAL '2 hours 22 minutes', NOW() - INTERVAL '2 hours 22 minutes' + INTERVAL '4 minutes', 240);

-- 2時間7分前の記録（間隔：約13分）
INSERT INTO contractions (start_time, end_time, duration_seconds) VALUES
(NOW() - INTERVAL '2 hours 7 minutes', NOW() - INTERVAL '2 hours 7 minutes' + INTERVAL '4 minutes 20 seconds', 260);

-- 1時間54分前の記録（間隔：約12分）
INSERT INTO contractions (start_time, end_time, duration_seconds) VALUES
(NOW() - INTERVAL '1 hour 54 minutes', NOW() - INTERVAL '1 hour 54 minutes' + INTERVAL '4 minutes 30 seconds', 270);

-- 1時間42分前の記録（間隔：約10分）
INSERT INTO contractions (start_time, end_time, duration_seconds) VALUES
(NOW() - INTERVAL '1 hour 42 minutes', NOW() - INTERVAL '1 hour 42 minutes' + INTERVAL '4 minutes 40 seconds', 280);

-- 1時間32分前の記録（間隔：約9分）
INSERT INTO contractions (start_time, end_time, duration_seconds) VALUES
(NOW() - INTERVAL '1 hour 32 minutes', NOW() - INTERVAL '1 hour 32 minutes' + INTERVAL '4 minutes 50 seconds', 290);

-- 1時間23分前の記録（間隔：約8分）
INSERT INTO contractions (start_time, end_time, duration_seconds) VALUES
(NOW() - INTERVAL '1 hour 23 minutes', NOW() - INTERVAL '1 hour 23 minutes' + INTERVAL '5 minutes', 300);

-- 1時間15分前の記録（間隔：約7分）
INSERT INTO contractions (start_time, end_time, duration_seconds) VALUES
(NOW() - INTERVAL '1 hour 15 minutes', NOW() - INTERVAL '1 hour 15 minutes' + INTERVAL '5 minutes 10 seconds', 310);

-- 1時間8分前の記録（間隔：約6分）
INSERT INTO contractions (start_time, end_time, duration_seconds) VALUES
(NOW() - INTERVAL '1 hour 8 minutes', NOW() - INTERVAL '1 hour 8 minutes' + INTERVAL '5 minutes 20 seconds', 320);

-- 1時間2分前の記録（間隔：約5分）
INSERT INTO contractions (start_time, end_time, duration_seconds) VALUES
(NOW() - INTERVAL '1 hour 2 minutes', NOW() - INTERVAL '1 hour 2 minutes' + INTERVAL '5 minutes 30 seconds', 330);

-- 57分前の記録（間隔：約5分）
INSERT INTO contractions (start_time, end_time, duration_seconds) VALUES
(NOW() - INTERVAL '57 minutes', NOW() - INTERVAL '57 minutes' + INTERVAL '5 minutes 40 seconds', 340);

-- 52分前の記録（間隔：約5分）
INSERT INTO contractions (start_time, end_time, duration_seconds) VALUES
(NOW() - INTERVAL '52 minutes', NOW() - INTERVAL '52 minutes' + INTERVAL '5 minutes 50 seconds', 350);

-- 最新の記録（記録中）
INSERT INTO contractions (start_time, end_time, duration_seconds) VALUES
(NOW() - INTERVAL '2 minutes', NULL, NULL);