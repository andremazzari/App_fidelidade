use app_fidelidade;

DELIMITER //

CREATE PROCEDURE CancelPoints(
    IN p_userId CHAR(36),
    IN p_phone BIGINT UNSIGNED,
    IN p_timestamp TIMESTAMP(1)
)
BEGIN
	DECLARE v_timestamp TIMESTAMP;
    DECLARE affected_rows INT;
    
	SET v_timestamp = CURRENT_TIMESTAMP(1);
    
	UPDATE app_fidelidade.fidelity_history
	SET canceled_at = v_timestamp
	WHERE id = UUID_TO_BIN(p_userId, TRUE) AND phone = p_phone AND created_at = p_timestamp AND redeemed_at IS NULL AND canceled_at IS NULL;
    
    SET affected_rows = ROW_COUNT();
    
	SELECT v_timestamp AS canceled_at, affected_rows AS affected_rows;
end //

DELIMITER ;


