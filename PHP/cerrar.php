<?php
require_once 'sesion.php';
$_SESSION = [];
session_destroy();
header("Location: ../HTML/formu.php");
exit();
