use app_fidelidade;

DELIMITER //

CREATE PROCEDURE CancelPoints(
	IN p_companyId CHAR(36),
    IN p_userId CHAR(36),
    IN p_phone BIGINT UNSIGNED,
    IN p_timestamp TIMESTAMP(1)
)
BEGIN
	DECLARE v_timestamp TIMESTAMP;
    DECLARE affected_rows INT;
    
	SET v_timestamp = CURRENT_TIMESTAMP(1);
    
	UPDATE app_fidelidade.fidelity_history
	SET canceledAt = v_timestamp, canceledBy = UUID_TO_BIN(p_userId, TRUE) 
	WHERE companyId = UUID_TO_BIN(p_companyId, TRUE) AND phone = p_phone AND createdAt = p_timestamp AND redeemedAt IS NULL AND canceledAt IS NULL;
    
    SET affected_rows = ROW_COUNT();
    
	SELECT v_timestamp AS canceledAt, affected_rows AS affectedRows;
end //

DELIMITER ;


