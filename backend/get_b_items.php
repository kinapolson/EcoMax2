<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include "db_connect.php";

if(isset($_GET['item_id'])){
    $item_id = intval($_GET['item_id']);

    $stmt = $conn->prepare("SELECT * FROM business_items WHERE item_id=?");
    $stmt->bind_param("i",$item_id);
    $stmt->execute();

    $result = $stmt->get_result();

    if($result && $result->num_rows > 0){
        $item = $result->fetch_assoc();

        echo json_encode([
            "status"=>"success",
            "item"=>[
                "id"=>$item["item_id"],
                "name"=>$item["item_name"],
                "price"=>$item["item_price"],
                "description"=>$item["item_descrip"],
                "points"=>$item["pts_req"],
                "image"=>$item["item_img"],
                "b_id"=>$item["b_id"]
            ]
        ]);
    }else{
        echo json_encode([
            "status"=>"error",
            "message"=>"Item not found"
        ]);
    }
} 

else if(isset($_GET['b_id'])) {
    $b_id = intval($_GET['b_id']);

    $stmt = $conn->prepare("SELECT * FROM business_items WHERE b_id=?");
    $stmt->bind_param("i",$b_id);
    $stmt->execute();

    $result = $stmt->get_result();

    $items=[];

    if($result){
        while($row=$result->fetch_assoc()){
            $items[]=[
                "id"=>$row["item_id"],
                "name"=>$row["item_name"],
                "price"=>$row["item_price"],
                "description"=>$row["item_descrip"],
                "points"=>$row["pts_req"],
                "image"=>$row["item_img"]
            ];
        }
    }

    echo json_encode([
        "status"=>"success",
        "items"=>$items
    ]);
}
?>