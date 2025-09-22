<?php
require_once "conn.php";

$sql = "Select id, ip_address, created_at FROM visit_logs";

$res = $conn->query($sql);

$data = [];
if ($res && $res->num_rows > 0) {
    while ($row = $res->fetch_assoc()) {
        $data[]  = $row;
    }
}


echo json_encode($data);

$conn->close();
