<?php

header('Content-type: application/json');
header('Access-Control-Allow-Origin:*');
header('Access-Control-Allow-Methods:POST,GET,OPTIONS');

if (!isset($_GET['id'])) {
    print_r(json_encode([
        'status'  => false,
        'code'    => 10001,
        'message' => 'ID不能为空'
    ]));
    exit();
}

include('./DBPDO.php');
$db = new DBPDO();

$result = $db->fetch("SELECT `id`, `name`, `level`, `place`, `nlp`, `copywriting`, `poem` FROM `records` WHERE id = ?", [$_GET['id']]);

if ($result) {
    print_r(json_encode([
        'status'  => true,
        'code'    => 0,
        'message' => '查询成功',
        'data'    => $result,
    ]));
    exit();
} else {
    print_r(json_encode([
        'status'  => false,
        'code'    => 10002,
        'message' => '查询失败，无数据或数据已被删除',
    ]));
    exit();
}