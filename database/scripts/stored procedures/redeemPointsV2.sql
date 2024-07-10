use app_fidelidade;

DELIMITER //

CREATE PROCEDURE RedeemPoints(
	IN p_companyId CHAR(36),
    IN p_userId CHAR(36),
    IN p_phone BIGINT UNSIGNED,
    IN p_target TINYINT UNSIGNED
)
BEGIN
    DECLARE v_timestamp TIMESTAMP;
    DECLARE v_lastInsertId INT;
    DECLARE v_points_sum INT;
    DECLARE v_fidelity_id INT;
    DECLARE v_min_timestamp TIMESTAMP(1);
    DECLARE v_max_timestamp TIMESTAMP(1);
    DECLARE v_last_target  INT;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Rollback the transaction if any error occurs
        ROLLBACK;
        -- Signal the error to the caller
        RESIGNAL;
    END;

    -- Start the transaction
    START TRANSACTION;

    -- Generate current timestamp
    SET v_timestamp = CURRENT_TIMESTAMP();

    -- Register the redeem event
    INSERT INTO app_fidelidade.redeem_history (companyId, phone, points, createdAt, redeemedBy)
    VALUES (UUID_TO_BIN(p_companyId, TRUE), p_phone, p_target, v_timestamp, UUID_TO_BIN(p_userId, TRUE));

    -- Get the last inserted ID
    SET v_lastInsertId = LAST_INSERT_ID();

    -- redeem the points in the fidelity history
    WITH cumulative_points AS (
		SELECT
			createdAt,
            cumulativePoints
		FROM (
			SELECT
				createdAt,
                points,
				SUM(points) OVER (PARTITION BY companyId, phone ORDER BY createdAt, fidelityId) AS cumulativePoints
			FROM
				app_fidelidade.fidelity_history
			WHERE
				companyId = UUID_TO_BIN(p_companyId, TRUE)
				AND phone = p_phone
				AND redeemedAt IS NULL
				AND canceledAt IS NULL
        ) AS elligible_points
        WHERE
			cumulativePoints <= p_target
			OR (cumulativePoints > p_target AND cumulativePoints - points < p_target)
    )
    
    SELECT
		MAX(cumulativePoints), MIN(createdAt), MAX(createdAt)
    INTO
		 v_points_sum, v_min_timestamp, v_max_timestamp
    FROM
		cumulative_points;
    
	UPDATE app_fidelidade.fidelity_history
	SET redeemedAt = v_timestamp, redeemId = v_lastInsertId
	WHERE  
		companyId = UUID_TO_BIN(p_companyId, TRUE)
		AND phone = p_phone
		AND createdAt BETWEEN v_min_timestamp AND v_max_timestamp
		AND canceledAt IS NULL
        AND redeemedAt IS NULL
	;
    
    IF v_points_sum > p_target THEN
		SELECT fidelityId INTO v_fidelity_id FROM app_fidelidade.fidelity_history WHERE createdAt = v_max_timestamp ORDER BY fidelityId LIMIT 1;
		
		UPDATE app_fidelidade.fidelity_history
        SET points = (p_target - (v_points_sum - points))
        WHERE  
		fidelityId = v_fidelity_id;
        
        SELECT target INTO v_last_target FROM app_fidelidade.fidelity_history WHERE fidelityId = v_fidelity_id;
        
        INSERT INTO app_fidelidade.fidelity_history (companyId, phone, points, target, createdAt, originalFidelityId)
        VALUES (UUID_TO_BIN(p_companyId, TRUE), p_phone, v_points_sum - p_target, v_last_target, v_max_timestamp, v_fidelity_id);
	END IF;

    -- Commit the transaction
    COMMIT;
end //

DELIMITER ;