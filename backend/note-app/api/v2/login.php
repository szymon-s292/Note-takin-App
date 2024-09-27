<?php
require_once "../config.php";
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error == 0)
{
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);

    if($data && isset($data['email']) && isset($data['password']))
    {
        $email = $conn->real_escape_string($data['email']);
        $password = $conn->real_escape_string($data['password']);
        $sql = "SELECT * FROM users WHERE email = '$email'";
        
        if($result = $conn->query($sql))
        {
            if($result->num_rows == 1)
            {
                $row = $result->fetch_assoc();
                if(password_verify($password, $row['password']))
                {
                    $response = [
                        "status" => "success",
                        "message" => "User found",
                        "id" => $row['id'],
                        "name" => $row['name'],
                        "email" => $row['email']
                    ];
                }
                else
                {
                    $response = $responses['invalid_credentials'];
                }
            }
            else
            {
                $response = $responses['invalid_credentials'];
            }
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
}

echo json_encode($response);
?>