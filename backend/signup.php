<?php
//returns JSON data
header("Content-Type: application/json");
//allows requests from devices
header("Access-Control-Allow-Origin: *");
//alls content-type header when data is eing sent
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

//preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include "db_connect.php";

//gets json input
$data = json_decode(file_get_contents("php://input"), true);

//logs raw input
//NEW CODE
error_log("RAW INPUT: " . file_get_contents("php://input"));
//NEW CODE

//checks if data was receveived from teh app
if (!$data) {
    echo json_encode([
        "status" => "error",
        "message" => "No data received"
    ]);
    exit();
}

$first_name = $data["first_name"] ?? "";
$last_name  = $data["last_name"] ?? "";
$username   = $data["username"] ?? "";
$email      = $data["email"] ?? "";
$password   = $data["password"] ?? "";

//checks for empty fields
if (empty($first_name) || empty($last_name) || empty($username) || empty($email) || empty($password)) {
    echo json_encode([
        "status" => "error",
        "message" => "All fields are required"
    ]);
    exit();
}

//makes pass protected in database
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

//chekcs if username or email already exists within gthe database
//NEW CODE
$stmt = $conn->prepare("SELECT user_id FROM users WHERE username = ? OR email = ?");
if (!$stmt) {
    echo json_encode([
        "status" => "error",
        "message" => "Prepare failed: " . $conn->error
    ]);
    exit();
}
//NEW CODE

//NEW CODE
$stmt->bind_param("ss", $username, $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode([
        "status" => "error",
        "message" => "Username or Email already exists"
    ]);
    exit();
}
//NEW CODE

//adds new user
$stmt = $conn->prepare(
    "INSERT INTO users (first_name, last_name, username, email, password, eco_pts)
     VALUES (?, ?, ?, ?, ?, 0)"
);

if (!$stmt) {
    echo json_encode([
        "status" => "error",
        "message" => "Insert prepare failed: " . $conn->error
    ]);
    exit();
}

$stmt->bind_param("sssss", $first_name, $last_name, $username, $email, $hashed_password);

//NEW CODE
//log before insert
error_log("INSERTING USER: " . $username);

if ($stmt->execute()) {
    echo json_encode([
        "status" => "success",
        "message" => "Account created",
        "insert_id" => $stmt->insert_id,
        "user" => [
            "id" => $stmt->insert_id,
            "first_name" => $first_name,
            "eco_pts" => 0
        ]
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Execute failed: " . $stmt->error
    ]);
}
//NEW CODE

$conn->close();
?>
