<?php

header('Content-type: application/json');
header('Access-Control-Allow-Origin:*');
header('Access-Control-Allow-Methods:POST,GET,OPTIONS');

if (!isset($_POST['name']) || mb_strlen($_POST['name']) >= 255) {
    print_r(json_encode([
        'status'  => false,
        'code'    => 10001,
        'message' => '名字不能为空或长度不符合'
    ]));
    exit();
}

if (!isset($_POST['level']) || !in_array($_POST['level'], [
        1000, //皇贵妃
        2000, //贵妃
        3000, //妃
        4000, //嫔
        5000, //贵人
        6000, //常在
        7000, //答应
        8000, //宫女
    ])
) {
    print_r(json_encode([
        'status'  => false,
        'code'    => 10002,
        'message' => '品阶不能为空或输入值错误'
    ]));
    exit();
}

if (!isset($_POST['place']) || mb_strlen($_POST['place']) >= 255) {
    print_r(json_encode([
        'status'  => false,
        'code'    => 10003,
        'message' => '宫殿不能为空或长度不符合'
    ]));
    exit();
}

if (!isset($_POST['nlp']) || mb_strlen($_POST['nlp']) >= 255) {
    print_r(json_encode([
        'status'  => false,
        'code'    => 10004,
        'message' => '词不能为空或长度不符合'
    ]));
    exit();
}

if (!isset($_POST['copywriting']) || mb_strlen($_POST['copywriting']) >= 255) {
    print_r(json_encode([
        'status'  => false,
        'code'    => 10005,
        'message' => '文案不能为空或长度不符合'
    ]));
    exit();
}

if (!isset($_POST['poem']) || mb_strlen($_POST['poem']) >= 255) {
    print_r(json_encode([
        'status'  => false,
        'code'    => 10006,
        'message' => '诗文不能为空或长度不符合'
    ]));
    exit();
}

include('./DBPDO.php');
$db = new DBPDO();

$result = $db->execute("INSERT INTO `records` (`name`, `level`, `place`, `nlp`, `copywriting`, `poem`, `created_at`, `updated_at`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [
    $_POST['name'],
    $_POST['level'],
    $_POST['place'],
    $_POST['nlp'],
    $_POST['copywriting'],
    $_POST['poem'],
    date('Y-m-d H:i:s'),
    date('Y-m-d H:i:s'),
]);

$id = $db->lastInsertId();

if ($id) {
    print_r(json_encode([
        'status'  => true,
        'code'    => 0,
        'message' => '保存成功',
        'data'    => [
            'id' => $id,
        ],
    ]));
    exit();
}