<?php
/**
 * @param base64 image
 */

header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Headers: X-Requested-With,X_Requested_With');
header('Content-type: application/json');

/**
 * Get access token.
 *
 * @param string $url
 * @param string $cache_file
 *
 * @return bool|string
 */
function access_token($url = 'https://openapi.baidu.com/oauth/2.0/token?grant_type=client_credentials&client_id=MINv8aFVfr8ghhKU9u0GouxPRNTcvNbM&client_secret=3G6yXLKqMUtPoUb2wbLGAzmR8uytInI9&b=1&b=1', $cache_file = './access_token.json') {
    if (file_exists($cache_file) && (filemtime($cache_file) > (time() - 60 * 60 * 1.5))) {
        // Cache file is less than five minutes old.
        // Don't bother refreshing, just use the file as-is.
        $file = file_get_contents($cache_file);
    } else {
        // Our cache is out-of-date, so load the data from our remote server,
        // and also save it over our cache for next time.
        $file   = file_get_contents($url);
        $result = json_decode($file, true);
        if (isset($result['access_token'])) {
            file_put_contents($cache_file, $result['access_token'], LOCK_EX);
        }
    }
    return $file;
}

/**
 * Curl request.
 *
 * @param string $url
 * @param string $post
 * @param string $cookie
 * @param int $returnCookie
 *
 * @return mixed|string
 */
function curl_request($url, $post = '', $cookie = '', $returnCookie = 0) {
    $curl   = curl_init();
    $header = array('Content-Type: application/x-www-form-urlencoded');
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_USERAGENT, 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)');
    curl_setopt($curl, CURLOPT_FOLLOWLOCATION, 1);
    curl_setopt($curl, CURLOPT_AUTOREFERER, 1);
    curl_setopt($curl, CURLOPT_REFERER, "https://h5.xhangjia.com/");
    if ($post) {
        curl_setopt($curl, CURLOPT_POST, 1);
        curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($post));
        curl_setopt($curl, CURLOPT_HTTPHEADER, $header);
    }
    if ($cookie) {
        curl_setopt($curl, CURLOPT_COOKIE, $cookie);
    }
    curl_setopt($curl, CURLOPT_HEADER, $returnCookie);
    curl_setopt($curl, CURLOPT_TIMEOUT, 10);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    $data = curl_exec($curl);
    if (curl_errno($curl)) {
        return curl_error($curl);
    }
    curl_close($curl);
    if ($returnCookie) {
        list($header, $body) = explode("\r\n\r\n", $data, 2);
        preg_match_all("/Set\-Cookie:([^;]*);/", $header, $matches);
        $info['cookie']  = substr($matches[1][0], 1);
        $info['content'] = $body;
        return $info;
    } else {
        return $data;
    }
}

if (isset($_POST['image'])) {
    $response = curl_request('https://openapi.baidu.com/rest/2.0/mms/v1/o/group', [
        'access_token' => access_token(),
        'image'        => $_POST['image'],
        'flist'        => 'v1_faceCount,v1_antiInfo,v1_faceGeneral',
    ]);
    echo $response;
}


