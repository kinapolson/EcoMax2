<?php
$host = "db";          
$user = "root";
$password = "root";    
$database = "ecomax_users";

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>