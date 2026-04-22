<?php
header("Content-Type: application/json");
include "db_connect.php";

$data = json_decode(file_get_contents("php://input"), true);

$user_id = $data["user_id"];
$fileName = $data["fileName"];
$business = $data["business"];
$total = $data["total"];
$totalPoints = $data["points"];
$items = $data["items"];


// SAVE RECEIPT
$stmt = $conn->prepare("
  INSERT INTO receipts
  (user_id,business_name,receipt_img,total_price,pts_earned)
  VALUES (?,?,?,?,?)
");

$stmt->bind_param("issdi",$user_id,$business,$fileName,$total,$totalPoints);
$stmt->execute();

$receipt_id = $stmt->insert_id;


// SAVE ITEMS
foreach($items as $it) {
  $stmt = $conn->prepare("
    INSERT INTO receipt_items
    (receipt_id,item_name,item_price,pts_earned)
    VALUES (?,?,?,?)
  ");

  $stmt->bind_param("isdi",
    $receipt_id,
    $it["name"],
    $it["price"],
    $it["points"]
  );

  $stmt->execute();
}


// UPDATE USER
$stmt = $conn->prepare("
  UPDATE users
  SET eco_pts = eco_pts + ?
  WHERE user_id=?
");

$stmt->bind_param("ii",$totalPoints,$user_id);
$stmt->execute();


echo json_encode(["status"=>"success"]);
?>