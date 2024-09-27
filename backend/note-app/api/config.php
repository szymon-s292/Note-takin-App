<?php

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "note-app";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$responses = [
    'db_error' => [
        "status" => "error",
        "message" => "Database error",
    ],
    'invalid_input' => [
        "status" => "error",
        "message" => "Invalid input",
    ],
    'invalid_credentials' => [
        "status" => "error",
        "message" => "Invalid credentials",
    ]
]

?>