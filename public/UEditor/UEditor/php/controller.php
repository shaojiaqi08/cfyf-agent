<?php
//header('Access-Control-Allow-Origin: http://www.baidu.com'); //设置http://www.baidu.com允许跨域访问
//header('Access-Control-Allow-Headers: X-Requested-With,X_Requested_With'); //设置允许的跨域header
date_default_timezone_set("Asia/chongqing");
error_reporting(E_ERROR);
header("Content-Type: text/html; charset=utf-8");

$CONFIG = json_decode(preg_replace("/\/\*[\s\S]+?\*\//", "", file_get_contents("config.json")), true);
$action = $_GET['action'];

//上传图片至服务器
function uploadImageToServer($upload_api_url , $image_url , $show_image_url){
    //
    $upload_api_url =$upload_api_url.'?url='.$image_url;
    $response = file_get_contents($upload_api_url);
    $response  = (array)json_decode($response,true);

    if(isset($response['code']) && $response['code'] == 0){
        return sprintf($show_image_url,$response['data']['relative_path'],$response['data']['save_file_name']);
    }
    return  '';
}

switch ($action) {
    case 'config':
        $result =  json_encode($CONFIG);
        break;

    /* 上传图片 */
    case 'uploadimage':
        $result = include("action_upload.php");
        $result = json_decode($result, true);

        if ($result['state'] == 'SUCCESS') {
            $origin_url = $result['url'];
            $fullOrigin_url = 'http://'.$_SERVER['HTTP_HOST'].'/'.$result['url'];
            //上传图片至服务器
            $server_image_url = uploadImageToServer($CONFIG['fileUploadApiUrl'], $fullOrigin_url, $CONFIG['showImageUrl']);
            $result['url'] = $server_image_url;
            if (empty($server_image_url)) {
                $result['state'] = '同步图片至服务器失败';
            }

            //删除上传的图片
            $path = $_SERVER['DOCUMENT_ROOT'] . '/' . parse_url($origin_url, PHP_URL_PATH);
            $path = str_replace("//", '/', $path);
            if (file_exists($path)) {
                unlink($path);
            }
        }
        $result = json_encode($result);
        break;
    /* 上传涂鸦 */
    case 'uploadscrawl':
    /* 上传视频 */
    case 'uploadvideo':
    /* 上传文件 */
    case 'uploadfile':
        $result = include("action_upload.php");
        break;

    /* 列出图片 */
    case 'listimage':
        $result = include("action_list.php");
        break;
    /* 列出文件 */
    case 'listfile':
        $result = include("action_list.php");
        break;

    /* 抓取远程文件 */
    case 'catchimage':
        $result = include("action_crawler.php");
        break;

    default:
        $result = json_encode(array(
            'state'=> '请求地址出错'
        ));
        break;
}

/* 输出结果 */
if (isset($_GET["callback"])) {
    if (preg_match("/^[\w_]+$/", $_GET["callback"])) {
        echo htmlspecialchars($_GET["callback"]) . '(' . $result . ')';
    } else {
        echo json_encode(array(
            'state'=> 'callback参数不合法'
        ));
    }
} else {
    echo $result;
}