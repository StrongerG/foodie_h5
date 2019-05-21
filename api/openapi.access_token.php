<?php

header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Headers: X-Requested-With,X_Requested_With');
header('Content-type: application/json');

$client_id     = "3inXc9q5iMZqsmPz2vxM3g3S";
$client_secret = "OrsAEQuraKgZk2MAtgMiqCa65wgICo1H";

/**
 * Get access token.
 *
 * @param string $url
 * @param string $cache_file
 *
 * @return bool|string
 */
function access_token($url, $cache_file = './yanxi_access_token.json') {
    if (file_exists($cache_file) && (filemtime($cache_file) > (time() - 60 * 60 * 1.5))) {
        // Cache file is less than five minutes old.
        // Don't bother refreshing, just use the file as-is.
        $file   = file_get_contents($cache_file);
        $result = json_decode($file, true);
    } else {
        // Our cache is out-of-date, so load the data from our remote server,
        // and also save it over our cache for next time.
        $file   = file_get_contents($url);
        $result = json_decode($file, true);
        if (isset($result['access_token'])) {
            file_put_contents($cache_file, $file, LOCK_EX);
        }
    }
    return isset($result['access_token']) ? $result['access_token'] : '';
}

$url = "https://openapi.baidu.com/oauth/2.0/token?grant_type=client_credentials&client_id={$client_id}&client_secret={$client_secret}&b=1&b=1";

$access_token = access_token($url);

if ($access_token) {
    echo json_encode([
        'status'  => true,
        'code'    => 0,
        'message' => '获取成功',
        'data'    => [
            'access_token' => $access_token,
        ],
    ]);
} else {
    echo json_encode([
        'status'  => false,
        'code'    => 10001,
        'message' => '获取失败，请您稍后再试',
    ]);
}



