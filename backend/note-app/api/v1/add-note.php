<?php
require_once "../config.php";
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error == 0)
{
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);

    if(isset($data['content']) && isset($data['creationTime']) && isset($data['lastModificationTime']) && isset($data['user_id']))
    {
        $user_id = $conn->real_escape_string($data['user_id']);
        $content = $conn->real_escape_string($data['content']);
        $creation_time = $conn->real_escape_string($data['creationTime']);
        $last_modification_time = $conn->real_escape_string($data['lastModificationTime']);

        $sql = "INSERT INTO notes (user_id, content, creationTime, lastModificationTime) VALUES ('$user_id', '$content', '$creation_time', '$last_modification_time')";
        
        if($conn->query($sql))
        {
            $last_id = $conn->insert_id;
            $response = [
                "status" => "success",
                "message" => "Note added successfully",
                "note_id" => $last_id,
            ];
        }
        else
        {
            $response = $responses['db_error'];
        }
    }
    else
    {
        $response = $responses['invalid_input'];
    }

    $conn->close();
}

echo json_encode($response);
?>
