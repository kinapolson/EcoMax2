<?php
//returns JSON data
header("Content-Type: application/json");
//allows requests from devices
header("Access-Control-Allow-Origin: *");
//alls content-type header when data is eing sent
header("Access-Control-Allow-Headers: Content-Type");

include "db_connect.php";

$data = json_decode(file_get_contents("php://input"), true);

//checks if data was receveived from teh app
if (!$data) {
    echo json_encode([
        "status" => "error",
        "message" => "No Data Received"
    ]);
    exit();
}

$first_name = $data["first_name"];
$last_name = $data["last_name"];
$username = $data["username"];
$email = $data["email"];
$password = $data["password"];

//checks for empty fields
if (empty($first_name) || empty($last_name) || empty($username) || empty($email) || empty($password)) {
    echo json_encode([
        "status" => "error",
        "message" => "All Fields are Required"
    ]);
    exit();
}

//makes pass protected in database
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

//chekcs if username or email already exists within gthe database
$sql = "SELECT * FROM users WHERE username='$username' OR email='$email'";
$result = $conn->query($sql);

//if matching credentials is found
if ($result->num_rows > 0) {
    echo json_encode([
        "status" => "error",
        "message" => "Username or Email Already Exists"
    ]);
} else {
    //adds new user to table
    $sql = "INSERT INTO users (first_name, last_name, username, email, password, eco_pts)
            VALUES ('$first_name', '$last_name', '$username', '$email', '$hashed_password', 0)";
    
    //success code
    if ($conn->query($sql) === TRUE) {
        http_response_code(200);

        echo json_encode([
            "status" => "success",
            "message" => "Account Created"
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Database Error"
        ]);
    }
}

$conn->close();
?>