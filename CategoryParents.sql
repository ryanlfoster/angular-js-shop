DELIMITER $$

CREATE DEFINER=`u_jsshop`@`localhost` PROCEDURE `CategoryParents`(IN categoryId INT)
BEGIN
CREATE TEMPORARY TABLE IF NOT EXISTS parents (parentId INT) engine = MEMORY;
TRUNCATE TABLE parents;
INSERT INTO parents VALUES(categoryId);
WHILE categoryId > 0 DO
	SELECT IFNULL(ParentId,-1) INTO categoryId FROM (SELECT ParentId FROM categories WHERE id = categoryId) A;
	IF categoryId > 0 THEN
		INSERT INTO parents VALUES(categoryId);
	END IF;
END WHILE;

SELECT id, name FROM categories WHERE id IN (SELECT * FROM parents);

END