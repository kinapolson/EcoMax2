<?php
//returns JSON data
header("Content-Type: application/json");
//allows requests from devices
header("Access-Control-Allow-Origin: *");
//allsows content-type header when data is being sent
header("Access-Control-Allow-Headers: Content-Type");
//allows POST reqs
header("Access-Control-Allow-Methods: POST, OPTIONS");

//handles req from browser
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include "db_connect.php";

//grabs JSOn data being sent from app
$data = json_decode(file_get_contents("php://input"), true);

//checks if data was received from app
if (!$data) {
    echo json_encode([
        "status" => "error",
        "message" => "No Data Received"
    ]);
    exit();
}

//stores e+p from app
$email = $data["email"] ?? "";
$password = $data["password"] ?? "";

//checks if e or p fields is missing
if (!$email || !$password) {
    echo json_encode([
        "status" => "error",
        "message" => "Missing Email or Password"
    ]);
    exit();
}

//searches database for user email
$stmt = $conn->prepare("SELECT * FROM users WHERE email=?");
$stmt->bind_param("s",$email);
$stmt->execute();
$result = $stmt->get_result();

//if user not in database
if (!$result || $result->num_rows == 0) {
    echo json_encode([
        "status" => "error",
        "message" => "User not Found"
    ]);
} else {
    $user = $result->fetch_assoc();
    //checks if pass matches the database pass
    if (password_verify($password, $user["password"])) {
        echo json_encode([
            "status" => "Success",
            "message" => "Login Successful",
            "user" => [
                "id" => $user["user_id"],
                "first_name" => $user["first_name"],
                "last_name" => $user["last_name"],
                "email" => $user["email"],
                "eco_pts" => $user["eco_pts"]
            ]
        ]);
    } else {
        //incorrect pass
        echo json_encode([
            "status" => "error",
            "message" => "Incorrect Password"
        ]);
    }
}

$conn->close();
?>