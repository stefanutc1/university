CREATE DATABASE IF NOT EXISTS gestiunefacultate;
USE gestiunefacultate;
CREATE TABLE `cursuri` (
  `id_curs` int(11) NOT NULL,
  `denumire` varchar(100) NOT NULL,
  `credite_ECTS` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- structura
CREATE TABLE `cursuri` (
  `id_curs` int(11) NOT NULL,
  `denumire` varchar(100) NOT NULL,
  `credite_ECTS` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `note` (
  `id_nota` int(11) NOT NULL,
  `id_student` int(11) DEFAULT NULL,
  `id_curs` int(11) DEFAULT NULL,
  `valoare_nota` int(11) DEFAULT NULL,
  `data_examinare` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `studenti` (
  `id_student` int(11) NOT NULL,
  `nume` varchar(50) NOT NULL,
  `prenume` varchar(50) NOT NULL,
  `medie_admitere` decimal(4,2) DEFAULT NULL,
  `tip_finantare` enum('Buget','Taxa') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- date fictive
INSERT INTO `cursuri` (`id_curs`, `denumire`, `credite_ECTS`) VALUES
(1, 'Baze de Date', 6),
(2, 'Statistica', 5);

INSERT INTO `note` (`id_nota`, `id_student`, `id_curs`, `valoare_nota`, `data_examinare`) VALUES
(1, 1, 1, 10, '2026-01-20'),
(2, 2, 1, 7, '2026-01-20'),
(3, 3, 2, 9, '2026-01-22');

INSERT INTO `studenti` (`id_student`, `nume`, `prenume`, `medie_admitere`, `tip_finantare`) VALUES
(1, 'Popescu', 'Ionut', 9.50, 'Buget'),
(2, 'Ionescu', 'Maria', 8.20, 'Taxa'),
(3, 'Georgescu', 'Andrei', 9.85, 'Buget');

-- index-uri
ALTER TABLE `cursuri` ADD PRIMARY KEY (`id_curs`);
ALTER TABLE `note` ADD PRIMARY KEY (`id_nota`), ADD KEY `id_student` (`id_student`), ADD KEY `id_curs` (`id_curs`);
ALTER TABLE `studenti` ADD PRIMARY KEY (`id_student`);
ALTER TABLE `note` MODIFY `id_nota` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
ALTER TABLE `studenti` MODIFY `id_student` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
ALTER TABLE `note` ADD CONSTRAINT `note_ibfk_1` FOREIGN KEY (`id_student`) REFERENCES `studenti` (`id_student`) ON DELETE CASCADE;
ALTER TABLE `note` ADD CONSTRAINT `note_ibfk_2` FOREIGN KEY (`id_curs`) REFERENCES `cursuri` (`id_curs`) ON DELETE CASCADE;



-- filtrare
SELECT nume AS 'Nume_Familie', prenume AS 'Prenume_Student' FROM studenti;
SELECT * FROM studenti WHERE medie_admitere >= 9.00 AND tip_finantare = 'Buget' ORDER BY medie_admitere DESC;

-- caractere, agregare, group by
SELECT valoare_nota, ROUND(valoare_nota * 0.9, 2) AS 'Nota_Ajustata' FROM note;
SELECT UPPER(nume) AS 'Nume_Upper' FROM studenti;
SELECT id_curs, AVG(valoare_nota) AS 'Media_Note_Curs' FROM note GROUP BY id_curs;

-- functii avansate
SELECT 
    CONCAT(nume, ' ', prenume) AS 'Nume_Complet',
    NOW() AS 'Data_Curenta',
    IFNULL(medie_admitere, 0) AS 'Medie_Verificata',
    CHAR_LENGTH(nume) AS 'Lungime_Nume'
FROM studenti;

-- 4. expresia case, simpla + cautare
SELECT nume, tip_finantare, 
    CASE tip_finantare WHEN 'Buget' THEN 'Fara Taxa' ELSE 'Cu Taxa' END AS 'Status' FROM studenti;

SELECT valoare_nota, 
    CASE WHEN valoare_nota >= 5 THEN 'Admis' ELSE 'Respins' END AS 'Rezultat' FROM note;

-- interogari duble (join-uri)
SELECT s.nume, n.valoare_nota FROM studenti s JOIN note n ON s.id_student = n.id_student;
SELECT n.valoare_nota, c.denumire FROM note n JOIN cursuri c ON n.id_curs = c.id_curs;
SELECT s.nume, c.denumire, n.valoare_nota FROM studenti s JOIN note n ON s.id_student = n.id_student JOIN cursuri c ON n.id_curs = c.id_curs;

-- actualizare
INSERT INTO cursuri (id_curs, denumire, credite_ECTS) VALUES (4, 'Securitate Cibernetica', 5);
UPDATE cursuri SET credite_ECTS = 6 WHERE id_curs = 4;
DELETE FROM cursuri WHERE id_curs = 4;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
