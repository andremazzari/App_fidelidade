use app_fidelidade;

DELIMITER //

CREATE PROCEDURE resetPassword(
	IN p_userId CHAR(36),
    IN p_token CHAR(36),
    IN p_password varbinary(60)
)
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Rollback the transaction if any error occurs
        ROLLBACK;
        -- Signal the error to the caller
        RESIGNAL;
    END;
    
    -- Start the transaction
    START TRANSACTION;
	
	-- update password
	UPDATE app_fidelidade.users
	SET passwordHash = p_password
    WHERE userId = UUID_TO_BIN(p_userId, TRUE);
    
    -- set the reset password token as used
    UPDATE app_fidelidade.password_reset
    SET usedAt = current_timestamp()
    WHERE token = UUID_TO_BIN(p_token, TRUE);
    
    -- Commit the transaction
    COMMIT;
end //

DELIMITER ;