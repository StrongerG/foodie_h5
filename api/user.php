<?php
ini_set('date.timezone', 'Asia/Shanghai');
header('Content-type: text/json;charset=UTF-8');
header('Cache-Control:no-cache,must-revalidate');
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Pragma: no-cache');

$appid = 'wxd950f35d1f20806a';//'wx2bb536699f3f72b1';
$appsecret = '15c6118ae92260433588ae1102bf4c64';//'712f6214c14760fa27cf46190e8012e7';

//这里改成需要跳转后的地址  
//$redirect_url = urlencode('http://res.xhangjia.com.com/html5/2016/12/zlzg/user.php');
//echo "https://open.weixin.qq.com/connect/oauth2/authorize?appid={$appid}&redirect_uri={$redirect_url}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
//exit;


/**
 * 定义curl方法
 * @param string $url
 * @param array $data
 * @return mix
 */
function https_request($url, $data = null) {
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, FALSE);
    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, FALSE);
    //curl_setopt($curl, CURLOPT_SSLVERSION, CURL_SSLVERSION_TLSv1);
    if (!empty($data)) {
        curl_setopt($curl, CURLOPT_POST, 1);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
    }
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    $output = curl_exec($curl);
    curl_close($curl);
    return $output;
}

$code = isset($_GET['code']) ? $_GET['code'] : '';
$access_token = '';
$openid = '';
if (!$code) {
    echo json_encode(['status' => false, 'code' => 100001, 'message' => 'code不能为空']);
    exit();
}

$access_token_url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid={$appid}&secret={$appsecret}&code={$code}&grant_type=authorization_code";
$result = https_request($access_token_url);
$access_token_data = json_decode($result, true);
if (!isset($access_token_data['access_token']) || !isset($access_token_data['openid'])) {
    echo json_encode(['status' => false, 'code' => 100002, 'message' => '获取失败，请您重新再试']);
    exit();
}
$access_token = $access_token_data['access_token'];
$openid = $access_token_data['openid'];

$user_info_url = "https://api.weixin.qq.com/sns/userinfo?access_token={$access_token}&openid={$openid}&lang=zh_CN";
echo https_request($user_info_url);