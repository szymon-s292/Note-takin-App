<?php
require_once "../config.php";
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error == 0)
{
    $user_id = $conn->real_escape_string($_GET['user_id']);
    $sql = "SELECT * FROM notes WHERE user_id = '$user_id'";
    
    if($result = $conn->query($sql))
    {
        if($result->num_rows > 0)
        {
            $rows = array();
            while ($row = $result->fetch_assoc())
            {
                $rows[] = $row;
            }
            
            $response = [
                "status" => "success",
                "message" => "User notes found",
                "data" => $rows
            ];
        }
        else
        {
            $response = [
                "status" => "error",
                "message" => "User not notes found",
                "data" => NULL
            ];
        }
    }
    else
    {
        $response = $responses['db_error'];
    }

    $conn->close();
}

echo json_encode($response);
?>
