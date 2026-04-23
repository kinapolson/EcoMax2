<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include "db_connect.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["status" => "error", "message" => "No Data Received"]);
    exit();
}

$user_id      = $data["user_id"]      ?? "";
$first_name   = $data["first_name"]   ?? "";
$last_name    = $data["last_name"]    ?? "";
$email        = $data["email"]        ?? "";
$new_password = $data["new_password"] ?? "";

if (!$user_id || !$first_name || !$email) {
    echo json_encode(["status" => "error", "message" => "Missing Required Fields"]);
    exit();
}

// make sure the email is not already taken by a different user
$stmt = $conn->prepare("SELECT user_id FROM users WHERE email = ? AND user_id != ?");
$stmt->bind_param("si", $email, $user_id);
$stmt->execute();
if ($stmt->get_result()->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "Email already in use"]);
    exit();
}

if ($new_password) {
    $hashed = password_hash($new_password, PASSWORD_DEFAULT);
    $stmt = $conn->prepare("UPDATE users SET first_name=?, last_name=?, email=?, password=? WHERE user_id=?");
    $stmt->bind_param("ssssi", $first_name, $last_name, $email, $hashed, $user_id);
} else {
    $stmt = $conn->prepare("UPDATE users SET first_name=?, last_name=?, email=? WHERE user_id=?");
    $stmt->bind_param("sssi", $first_name, $last_name, $email, $user_id);
}

if ($stmt->execute()) {
    echo json_encode([
        "status" => "success",
        "message" => "Profile Updated",
        "user" => [
            "first_name" => $first_name,
            "last_name"  => $last_name,
            "email"      => $email
        ]
    ]);
} else {
    echo json_encode(["status" => "error", "message" => "Update Failed"]);
}

$conn->close();
?>
