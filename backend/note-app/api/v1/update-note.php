<?php
require_once "../config.php";
$conn = new mysqli($servername, $username, $password, $dbname);

if($conn->connect_error == 0)
{
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);

    if(isset($data['noteId']) && isset($data['newContent']) && isset($data['lastModificationTime']))
    {
        $note_id = $conn->real_escape_string($data['noteId']);
        $new_content = $conn->real_escape_string($data['newContent']);
        $last_modification_time = $conn->real_escape_string($data['lastModificationTime']);

        $sql = "UPDATE notes SET content = '$new_content', lastModificationTime = '$last_modification_time' WHERE id = $note_id;";
        if($conn->query($sql))
        {
            $response = [
                "status" => "success",
                "message" => "Note updated successfully",
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