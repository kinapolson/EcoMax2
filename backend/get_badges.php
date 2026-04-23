<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include "db_connect.php";

$user_id = intval($_GET["user_id"] ?? 0);

/* prepare SQL query */
$stmt = $conn->prepare("SELECT b.badge_id, b.badge_name, b.badge_descrip, b.badge_icon,
  CASE WHEN ub.badge_id IS NOT NULL THEN 1 ELSE 0 END AS earned
  FROM badges b LEFT JOIN user_badges ub ON b.badge_id = ub.badge_id AND ub.user_id = ?");

/* check if SQL prepared correctly */
if(!$stmt){
  echo json_encode([
    "status" => "error",
    "message" => $conn->error
  ]);
  exit;
}

/* bind user id */
$stmt->bind_param("i", $user_id);

/* execute query */
$stmt->execute();

$result = $stmt->get_result();

$badges = [];

/* collect badge rows */
while($row = $result->fetch_assoc()){
  $badges[] = $row;
}

/* return JSON */
echo json_encode([
  "status" => "success",
  "badges" => $badges
]);
?>