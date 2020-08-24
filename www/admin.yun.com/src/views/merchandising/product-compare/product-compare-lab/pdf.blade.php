<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=0">
    <meta content="yes" name="apple-mobile-web-app-capable">
    <meta content="black" name="apple-mobile-web-app-status-bar-style">
    <meta name="format-detection" content="telephone=no">
    <title></title>
    <style>
        @font-face{
            font-family: 'SourceHanSans-Bold';
            src: url({{ resource_path('/fonts/SourceHanSans-Bold.ttc') }});
        }

        @font-face{
            font-family: 'SourceHanSans-Regular';
            src: url({{ resource_path('/fonts/SourceHanSans-Regular.ttc') }});
        }

        @font-face{
            font-family: 'SourceHanSans-Medium';
            src: url({{ resource_path('/fonts/SourceHanSans-Medium.ttc') }});
        }

        * {
            padding: 0;
            margin: 0;
            box-sizing: border-box;
        }
        body {
            width: 1100px;
        }
        .watermark {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url({{ 'http://' . env('CRM_WEB_API_DOMAIN') . '/proposal/images/watermark.png' }});
            background-size: 25%;
            background-position-x: -60%;
            opacity: 1;
            z-index: 99;
        }
        .container {
            position: relative;
            padding: 0 75px;
        }
        .logo {
            width: 300px;
            height: 88px;
            background: url({{ 'http://' . env('CRM_WEB_API_DOMAIN') . '/proposal/images/logo.png' }}) no-repeat;
            background-size: cover;
        }
        .proposal-header {
            margin: 68px 0 56px;
            color: #333;
            font-size: 66px;
            font-weight: 500;
            /*font-family: 'fontRegular';*/
            font-family: 'SourceHanSans-Regular';
        }
        .proposal-base-info .respect {
            font-size: 33px;
            color: #383838;
            font-weight: 500;
            /*font-family: 'fontMedium';*/
            font-family: 'SourceHanSans-Medium';
        }
        .proposal-base-info .respect-section {
            margin-top: 20px;
            color: #606060;
            font-size: 26px;
            line-height: 44px;
            font-weight: 400;
            /*font-family: 'fontRegular';*/
            font-family: 'SourceHanSans-Regular';
        }
        .process {
            margin: 36px auto 0;
            width: 92%;
            height: 120px;
            background: url({{ 'http://' . env('CRM_WEB_API_DOMAIN') . '/proposal/images/process.jpg' }}) no-repeat;
            background-size: contain;
        }
        .proposal-block {
            margin-bottom: 68px;
        }

        .proposal-block p {
            background-color: rgba(0,0,0,0) !important;
        }

        .proposal-title {
            margin: 24px 0;
            color: #383838;
            font-size: 33px;
            font-weight: 500;
            /*font-family: 'fontMedium';*/
            font-family: 'SourceHanSans-Medium';
        }

        .company-introduce-title {
            margin: 24px 0;
            color: #383838;
            font-size: 33px;
            font-weight: 500;
            /*font-family: 'fontMedium';*/
            font-family: 'SourceHanSans-Medium';
        }

        .company-introduce-detail-header {
            color: #383838;
            margin: 10px 0;
            font-size: 30px;
            line-height: 44px;
            /*font-family: 'fontRegular';*/
            font-family: 'SourceHanSans-Regular';
        }

        .company-introduce-detail {
            color: #606060;
            font-size: 26px;
            line-height: 44px;
            margin-bottom: 50px;
            /*font-family: 'fontRegular';*/
            font-family: 'SourceHanSans-Regular';
        }

        .proposal-family-detail {
            color: #606060;
            font-size: 26px;
            line-height: 44px;
            word-wrap: break-word;
            /*font-family: 'fontRegular';*/
            font-family: 'SourceHanSans-Regular';
        }
        .table-header-item-o {
            padding: 15px 15px;
            font-size: 17px;
            text-align: center;
            font-weight: 500;
            color: #fff;
            background-color: #5E93F6;
            border:1px solid #B3CEFF;
            border-top: 0;
        }
        .table-body-item-o {
            padding: 10px 15px;
            font-size: 21px;
            text-align: center;
            color: #5082E0;
            font-weight: 500;
            line-height: 28px;
            vertical-align: middle;
            border:1px solid #B3CEFF;
        }
        .order-1 {
            width: 5%;
        }
        .order-2 {
            width: 10%;
        }
        .order-3 {
            width: 6%;
        }
        .order-4 {
            width: 6%;
        }
        .order-5 {
            width: 6%;
        }
        .order-6 {
            width: 10%;
        }
        .order-7 {
            width: 30%;
        }

        .proposal-header-box {
            padding: 30px 30px 20px;
            background-color: #EEF4FF;
            border-radius: 8px 8px 0px 0px;
            border: 1px solid rgba(190,213,255,1);
        }
        .proposal-header-title {
            color: #2952A0;
            font-size: 38px;
            font-weight: 500;
            font-family: 'fontMedium';
        }
        .proposal-header-family-detail {
            margin-top: 6px;
            color: #2952A0;
            font-size: 30px;
            line-height: 44px;
            font-family: 'fontRegular';
        }

        .tbody tr:nth-child(even) {
            background-color: #EEF4FF;
        }
    </style>
</head>
<body>
<div class="watermark"></div>
<div class="container">
    <div class="logo"></div>
    <div class="proposal-header">
        家庭保障方案建议书
    </div>
    <div class="proposal-base-info">
        <div class="respect">{{ $proposal->customer_name }}，您好</div>
        <p class="respect-section">我是您的方案专家{{ $proposal->salesInfo->nickname }}，很荣幸有机会为您提供专业的保障方案。针对你的家庭保障，接下来我将用以下流程为您解析：</p>
        <div class="process"></div>
    </div>

    @if ($proposal->has_pdf_illustration && $proposal->pdf_illustration_str)
        <div class="proposal-block">
            <div class="proposal-title">家庭基本情况</div>
            <div class="proposal-family-detail">
                {!! $proposal->pdf_illustration_str !!}
            </div>
        </div>
    @endif

    @if ($proposal->illustration_str)
        <div class="proposal-block">
            <div class="proposal-title">家庭风险分析</div>
            <div class="proposal-family-detail">
                {!! $proposal->illustration_str !!}
            </div>
        </div>
    @endif

    @foreach($proposal->schemes as $key => $scheme)
        <div class="proposal-block" style="page-break-inside:avoid !important;">
            <div class="proposal-header-box">
{{--                <div class="proposal-header-title">推荐保障方案{{ $key + 1 }}</div>--}}
                <div class="proposal-header-title">推荐保障方案</div>
                <div class="proposal-header-family-detail">
                    {{ $scheme->recognizee_policy_name }} {{ \Carbon\Carbon::createFromFormat('Ymd', $scheme->recognizee_policy_birthday)->format('Y年m月d日') }}
                </div>
            </div>
            <table style="border-collapse: collapse; border-spacing: 0;width: 100%; text-align: center;">
                <tr>
                    <th class="table-header-item-o order-1">险种</th>
{{--                    <th class="table-header-item-o order-2">--}}
{{--                        保险<br/>--}}
{{--                        公司--}}
{{--                    </th>--}}
                    <th class="table-header-item-o order-2">
                        产品<br/>
                        名称
                    </th>
                    <th class="table-header-item-o order-3">保额</th>
                    <th class="table-header-item-o order-4">
                        缴费<br/>期间
                    </th>
                    <th class="table-header-item-o order-5">
                        保障<br/>期限
                    </th>
                    <th class="table-header-item-o order-6">保费/元</th>
                    <th class="table-header-item-o order-7">保障内容</th>
                </tr>
                <tbody class="tbody">
                    @foreach($scheme->products as $product)
                        <tr>
                            <td class="table-body-item-o order-1" style="font-size: 18px;">{!! implode('<br/>', mb_str_split($product->category_name)) !!}</td>
{{--                            <td class="table-body-item-o order-2">{{ $product->company_name }}</td>--}}
                            <td class="table-body-item-o order-2" style="font-size: 18px;">
                                {{ $product->proposal_product_name }}
                                @if(filled($product->company_name))
                                    <br />
                                    ({{ $product->company_name }})
                                @endif
                            </td>
                            <td class="table-body-item-o order-3" style="font-size: 18px;">{{ format_big_decimal($product->guarantee_quota) }}</td>
                            <td class="table-body-item-o order-4" style="font-size: 18px;">
                                {{ App\Modules\Crm\Constant\Proposal\DueTimeUnits::getStrName($product->pay_period_value, $product->pay_period_unit) }}<br/>
                            </td>
                            <td class="table-body-item-o order-5" style="font-size: 18px;">
                                {{ App\Modules\Crm\Constant\Proposal\ProtectionDueTimeUnits::getStrName($product->guarantee_period_value, $product->guarantee_period_unit) }}
                            </td>
                            <td class="table-body-item-o order-6" style="font-size: 18px;">{{ format_decimal($product->premium) }}</td>
                            <td class="table-body-item-o order-7" style="text-align: left; font-size: 18px; line-height: 24px;">
                                @php
                                    $i = 0;
                                @endphp
                                @foreach($product->insurances as $insurance)
                                    @foreach($insurance->pdf_content as $index => $pdfContentItem)
                                        @if($pdfContentItem)
                                            {{ ++$i . '、' . replace_pdf_content($pdfContentItem, $product->guarantee_quota) }}
                                        @endif

                                        @if(($index + 1) != count($insurance->pdf_content))
                                            <br/>
                                        @endif
                                    @endforeach
                                    <br/>
                                @endforeach
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>

        @if ($scheme->has_illustration && $scheme->illustration_str)
            <div class="proposal-block">
                <div class="proposal-title">方案解读</div>
                <div class="proposal-family-detail">
                    {!! $scheme->illustration_str !!}
                </div>
            </div>
        @endif
    @endforeach

    @if ($proposal->is_show_company_profile && filled($proposal->company_profile))
        <div class="company-introduce-title">保险公司介绍</div>
        @foreach($proposal->company_profile as $profile)
            @if (trim_any($profile['company_profile']) && $profile['company_name'])
                <div class="proposal-block">
                    <div class="company-introduce-detail-header">{{ $profile['company_name'] }}</div>
                    <div class="company-introduce-detail">
                        {!! $profile['company_profile'] !!}
                    </div>
                </div>
            @endif
        @endforeach
    @endif
</div>
</body>
</html>