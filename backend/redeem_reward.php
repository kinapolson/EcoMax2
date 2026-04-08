<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include "db_connect.php";

$data = json_decode(file_get_contents("php://input"), true);

$user_id = $data["user_id"];
$reward_id = $data["reward_id"];

/* grabs reward info */
$stmt = $conn->prepare("SELECT pts_required FROM rewards WHERE reward_id=?");
$stmt->bind_param("i",$reward_id);
$stmt->execute();

$result = $stmt->get_result();
$reward = $result->fetch_assoc();

$points_required = $reward["pts_required"];

/* grabs user pts */
$stmt = $conn->prepare("SELECT eco_pts FROM users WHERE user_id=?");
$stmt->bind_param("i",$user_id);
$stmt->execute();

$result = $stmt->get_result();
$user = $result->fetch_assoc();

$current_pts = $user["eco_pts"];

/* check if enough pts */
if($current_pts < $points_required){
    echo json_encode([
        "status"=>"error",
        "message"=>"Not Enough Eco Points"
    ]);
    exit;
}

/* subtract pts */
$new_pts = $current_pts - $points_required;

$stmt = $conn->prepare("UPDATE users SET eco_pts=? WHERE user_id=?");
$stmt->bind_param("ii",$new_pts,$user_id);
$stmt->execute();

/* save redeemed reward */
$stmt = $conn->prepare("INSERT INTO redeemed_rewards(user_id,reward_id,points_spent) VALUES(?,?,?)");
$stmt->bind_param("iii",$user_id,$reward_id,$points_required);
$stmt->execute();

echo json_encode([
    "status"=>"success",
    "new_points"=>$new_pts
]);
?>