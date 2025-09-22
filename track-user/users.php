<?php
require_once "conn.php";

$sql = "Select id, username, old_password, new_password, created_at, updated_at  FROM users";


$res = $conn->query($sql);

$data = [];
if ($res && $res->num_rows > 0) {
    while ($row = $res->fetch_assoc()) {
        $data[]  = $row;
    }
}


echo json_encode($data);

$conn->close();
