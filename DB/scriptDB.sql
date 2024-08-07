-- ph... SQLINES DEMO ***
-- ve... SQLINES DEMO ***
-- SQLINES DEMO *** admin.net/
--
-- Se... SQLINES DEMO ***
-- SQLINES DEMO *** ión: 31-07-2024 a las 17:21:22
-- SQLINES DEMO *** idor: 5.7.17-log
-- SQLINES DEMO *** 5.6.30

/* SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO"; */
time_zone := "+00:00";


/* SQLINES DEMO *** ARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/* SQLINES DEMO *** ARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/* SQLINES DEMO *** LLATION_CONNECTION=@@COLLATION_CONNECTION */;
/* SQLINES DEMO *** tf8mb4 */;

--
-- SQLINES DEMO *** proyecto 4to learnhub`
--

-- SQLINES DEMO *** ---------------------------------------

--
-- SQLINES DEMO *** la para la tabla `clases`
--

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE clases (
  ID int NOT NULL,
  IDmateria int NOT NULL,
  Horainicio date NOT NULL,
  Horafin date NOT NULL,
  IDalumno int NOT NULL,
  IDprofesor int NOT NULL,
  Idioma varchar(30) NOT NULL,
  Link varchar(100) NOT NULL
) ;

-- SQLINES DEMO *** ---------------------------------------

--
-- SQLINES DEMO *** la para la tabla `dicta`
--

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE dicta (
  ID int NOT NULL,
  IDprofesores int NOT NULL,
  IDmateria int NOT NULL
) ;

-- SQLINES DEMO *** ---------------------------------------

--
-- SQLINES DEMO *** la para la tabla `materia`
--

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE materia (
  ID int NOT NULL,
  IDprofesores int NOT NULL,
  nombremateria varchar(50) NOT NULL
) ;

-- SQLINES DEMO *** ---------------------------------------

--
-- SQLINES DEMO *** la para la tabla `material`
--

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE material (
  ID int NOT NULL,
  materia varchar(100) NOT NULL,
  Profesor varchar(50) NOT NULL,
  Fecha que la subio date NOT NULL
) ;

-- SQLINES DEMO *** ---------------------------------------

--
-- SQLINES DEMO *** la para la tabla `profesor`
--

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE profesor (
  ID int NOT NULL,
  Nombre varchar(30) NOT NULL,
  Apellido varchar(30) NOT NULL,
  Fecha de nacimiento date NOT NULL,
  Email varchar(50) NOT NULL,
  Materias varchar(50) NOT NULL,
  Telefono varchar(20) NOT NULL,
  Valoracion decimal(10,0) NOT NULL,
  Pais varchar(30) NOT NULL,
  Idiomas varchar(30) NOT NULL,
  Foto text NOT NULL,
  Descripcion corta varchar(200) NOT NULL
) ;

-- SQLINES DEMO *** ---------------------------------------

--
-- SQLINES DEMO *** la para la tabla `usuario`
--

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE usuario (
  ID int NOT NULL,
  Nombre varchar(30) NOT NULL,
  Apellido varchar(30) NOT NULL,
  Nombre de usuario varchar(20) NOT NULL,
  Contraseña varchar(500) NOT NULL,
  Fecha de nacimiento date NOT NULL,
  Email varchar(50) NOT NULL,
  Telefono int NOT NULL,
  Pais varchar(15) NOT NULL,
  Idiomas varchar(15) NOT NULL,
  Foto text NOT NULL
) ;

--
-- SQLINES DEMO *** las volcadas
--

--
-- SQLINES DEMO *** la `clases`
--
ALTER TABLE clases
  ADD PRIMARY KEY (ID),
  ADD KEY IDalumno (IDalumno),
  ADD KEY IDprofesor (IDprofesor);

--
-- SQLINES DEMO *** la `dicta`
--
ALTER TABLE dicta
  ADD PRIMARY KEY (ID),
  ADD KEY IDprofesores (IDprofesores),
  ADD KEY IDmateria (IDmateria);

--
-- SQLINES DEMO *** la `materia`
--
ALTER TABLE materia
  ADD PRIMARY KEY (ID);

--
-- SQLINES DEMO *** la `material`
--
ALTER TABLE material
  ADD PRIMARY KEY (ID),
  ADD KEY materia (materia),
  ADD KEY Profesor (Profesor);

--
-- SQLINES DEMO *** la `profesor`
--
ALTER TABLE profesor
  ADD PRIMARY KEY (ID),
  ADD KEY Materias (Materias);

--
-- SQLINES DEMO ***  las tablas volcadas
--

--
-- SQLINES DEMO ***  la tabla `clases`
--
ALTER TABLE clases
  MODIFY ID cast(11 as int) NOT NULL AUTO_INCREMENT;
--
-- SQLINES DEMO ***  la tabla `dicta`
--
ALTER TABLE dicta
  MODIFY ID cast(11 as int) NOT NULL AUTO_INCREMENT;
--
-- SQLINES DEMO ***  la tabla `materia`
--
ALTER TABLE materia
  MODIFY ID cast(11 as int) NOT NULL AUTO_INCREMENT;
--
-- SQLINES DEMO ***  la tabla `material`
--
ALTER TABLE material
  MODIFY ID cast(11 as int) NOT NULL AUTO_INCREMENT;
--
-- SQLINES DEMO ***  la tabla `profesor`
--
ALTER TABLE profesor
  MODIFY ID cast(11 as int) NOT NULL AUTO_INCREMENT;
/* SQLINES DEMO *** ER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/* SQLINES DEMO *** ER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/* SQLINES DEMO *** ON_CONNECTION=@OLD_COLLATION_CONNECTION */;


