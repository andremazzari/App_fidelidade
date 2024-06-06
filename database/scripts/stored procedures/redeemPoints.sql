use app_fidelidade;

DELIMITER //

CREATE PROCEDURE RedeemPoints(
    IN p_userId CHAR(36),
    IN p_phone BIGINT UNSIGNED,
    IN p_target TINYINT UNSIGNED
)
BEGIN
    DECLARE v_timestamp TIMESTAMP;
    DECLARE v_lastInsertId INT;
   
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
    INSERT INTO app_fidelidade.redeem_history (id, phone, points, created_at)
    VALUES (UUID_TO_BIN(p_userId, TRUE), p_phone, p_target, v_timestamp);

    -- Get the last inserted ID
    SET v_lastInsertId = LAST_INSERT_ID();

    -- redeem the points the records in the fidelity history
    WITH timestamp_limits AS (
            SELECT
                MIN(created_at) AS min_timestamp,
                MAX(created_at) AS max_timestamp
            FROM (
                SELECT
                    created_at
                FROM
                    app_fidelidade.fidelity_history
                WHERE
                    id = UUID_TO_BIN(p_userId, TRUE)
                    AND phone = p_phone
                    AND redeemed_at IS NULL
                    AND canceled_at IS NULL
                ORDER BY created_at ASC
                LIMIT p_target
            ) AS limited_rows
        )

        UPDATE app_fidelidade.fidelity_history
        SET redeemed_at = v_timestamp, redeem_id = v_lastInsertId
        WHERE  
            id = UUID_TO_BIN(p_userId, TRUE)
            AND phone = p_phone
            AND created_at BETWEEN (SELECT min_timestamp FROM timestamp_limits) AND (SELECT max_timestamp FROM timestamp_limits)
            AND canceled_at IS NULL
        ;

    -- Commit the transaction
    COMMIT;
end //

DELIMITER ;


