import { dayToNumber, getGroups, getInstitutes, getTimetable } from '../utils/parser';

beforeAll(() => {
    const text = `<html lang="uk" dir="ltr" class="js"><head>
    <link rel="profile" href="http://www.w3.org/1999/xhtml/vocab">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta name="Generator" content="Drupal 7 (http://drupal.org)">
    <title>Розклад занять для студентів | Студент Львівської політехніки</title>
    <link type="text/css" rel="stylesheet" href="http://student.lpnu.ua/sites/default/files/css/css_lQaZfjVpwP_oGNqdtWCSpJT1EMqXdMiU84ekLLxQnc4.css" media="all">
  <link type="text/css" rel="stylesheet" href="http://student.lpnu.ua/sites/default/files/css/css_Kg4VuSu_sk2mykRK8Di0DJWFLLkQ1sGPa8zzBh1R3OQ.css" media="all">
  <link type="text/css" rel="stylesheet" href="http://student.lpnu.ua/sites/default/files/css/css_Ad_DpJfA8sKjLo9AuLZUM24JZQw22Zxo3cDgNooJky0.css" media="all">
  <link type="text/css" rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@3.3.5/dist/css/bootstrap.min.css" media="all">
  <link type="text/css" rel="stylesheet" href="http://student.lpnu.ua/sites/default/files/css/css_wr5FAEZiAmfNz4wdnGn9upAJ96JYUV8nQTn7QO7kv0Q.css" media="all">
    <!-- HTML5 element support for IE6-8 -->
    <!--[if lt IE 9]>
      <script src="https://cdn.jsdelivr.net/html5shiv/3.7.3/html5shiv-printshiv.min.js"></script>
    <![endif]-->
    <script async="" src="https://www.google-analytics.com/analytics.js"></script><script src="http://student.lpnu.ua/sites/default/files/js/js_kqEryAXu5uQAGzWroj9vfx4dYSyMZN9roBaAU8UbVb8.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@3.3.5/dist/js/bootstrap.min.js"></script>
  <script src="http://student.lpnu.ua/sites/default/files/js/js_jIaDdnmYli_nzz-Ghw_cQ1CSYuCQ4z0KnyOQB3TM1Fw.js"></script>
  <script src="http://student.lpnu.ua/sites/default/files/js/js_6KYa0diPCr0gLgC0dehXlK_mkcyV8qOVrX9LCexIub0.js"></script>
  <script>(function(i,s,o,g,r,a,m){i["GoogleAnalyticsObject"]=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,"script","https://www.google-analytics.com/analytics.js","ga");ga("create", "UA-126358908-1", {"cookieDomain":"auto"});ga("set", "anonymizeIp", true);ga("send", "pageview");</script>
  <script>jQuery.extend(Drupal.settings, {"basePath":"\/","pathPrefix":"","ajaxPageState":{"theme":"bootstrap_cabinet","theme_token":"HOZDIUTZHQ75CDTEVxEqN6I4Hdnwy-eOlFcY2Ed0fY0","js":{"sites\/all\/themes\/bootstrap\/js\/bootstrap.js":1,"sites\/all\/modules\/jquery_update\/replace\/jquery\/1.10\/jquery.min.js":1,"misc\/jquery-extend-3.4.0.js":1,"misc\/jquery-html-prefilter-3.5.0-backport.js":1,"misc\/jquery.once.js":1,"misc\/drupal.js":1,"sites\/all\/libraries\/jquery.formprefill\/jquery.formprefill.min.js":1,"https:\/\/cdn.jsdelivr.net\/npm\/bootstrap@3.3.5\/dist\/js\/bootstrap.min.js":1,"sites\/all\/modules\/webform_prefill\/webform_prefill.js":1,"public:\/\/languages\/uk_VZE98TmLWKxtuwDbrLAmd9hUlBBtoS0GVDa9ntWX9dk.js":1,"sites\/all\/modules\/views_selective_filters\/js\/attachBehaviours.js":1,"sites\/all\/modules\/ctools\/js\/auto-submit.js":1,"sites\/all\/modules\/google_analytics\/googleanalytics.js":1,"0":1},"css":{"modules\/system\/system.base.css":1,"sites\/all\/modules\/ldap\/ldap_user\/ldap_user.css":1,"sites\/all\/modules\/date\/date_api\/date.css":1,"sites\/all\/modules\/date\/date_popup\/themes\/datepicker.1.7.css":1,"modules\/field\/theme\/field.css":1,"modules\/node\/node.css":1,"sites\/all\/modules\/views\/css\/views.css":1,"sites\/all\/modules\/ckeditor\/css\/ckeditor.css":1,"sites\/all\/modules\/ctools\/css\/ctools.css":1,"sites\/all\/modules\/ldap\/ldap_servers\/ldap_servers.admin.css":1,"sites\/all\/modules\/panels\/css\/panels.css":1,"sites\/all\/modules\/panels\/plugins\/layouts\/threecol_33_34_33\/threecol_33_34_33.css":1,"https:\/\/cdn.jsdelivr.net\/npm\/bootstrap@3.3.5\/dist\/css\/bootstrap.min.css":1,"sites\/all\/themes\/bootstrap_cabinet\/css\/style.css":1,"sites\/all\/themes\/bootstrap_cabinet\/css\/schedule_new.css":1}},"urlIsAjaxTrusted":{"\/students_schedule":true,"\/students_schedule?destination=students_schedule%3Fdepartmentparent_abbrname_selective%3DAll%26studygroup_abbrname_selective%3D%25D0%259F%25D0%2597-46%26semestrduration%3D1":true},"map":{"first_name":["first_name","firstname","fname"],"last_name":["last_name","lastname","lname"],"email":["email","email_address"]},"cookieDomain":"","cookieMaxAge":-1,"storage":["sessionStorage"],"webform_prefill":{"map":{"first_name":["first_name","firstname","fname"],"last_name":["last_name","lastname","lname"],"email":["email","email_address"]},"cookieDomain":"","cookieMaxAge":-1,"storage":["sessionStorage"]},"googleanalytics":{"trackOutbound":1,"trackMailto":1,"trackDownload":1,"trackDownloadExtensions":"7z|aac|arc|arj|asf|asx|avi|bin|csv|doc(x|m)?|dot(x|m)?|exe|flv|gif|gz|gzip|hqx|jar|jpe?g|js|mp(2|3|4|e?g)|mov(ie)?|msi|msp|pdf|phps|png|ppt(x|m)?|pot(x|m)?|pps(x|m)?|ppam|sld(x|m)?|thmx|qtm?|ra(m|r)?|sea|sit|tar|tgz|torrent|txt|wav|wma|wmv|wpd|xls(x|m|b)?|xlt(x|m)|xlam|xml|z|zip"},"bootstrap":{"anchorsFix":"0","anchorsSmoothScrolling":"0","formHasError":1,"popoverEnabled":1,"popoverOptions":{"animation":1,"html":0,"placement":"right","selector":"","trigger":"click","triggerAutoclose":1,"title":"","content":"","delay":0,"container":"body"},"tooltipEnabled":1,"tooltipOptions":{"animation":1,"html":0,"placement":"auto left","selector":"","trigger":"hover focus","delay":0,"container":"body"}}});</script>
  </head>
  <body class="html not-front not-logged-in one-sidebar sidebar-second page-students-schedule" style="">
    <div id="skip-link">
      <a href="#main-content" class="element-invisible element-focusable">Перейти до основного матеріалу</a>
    </div>
      <header id="navbar" role="banner" class="navbar container navbar-default">
    <div class="container">
      <div class="navbar-header">
        
                <a class="name navbar-brand" href="/" title="Головна">Студент Львівської політехніки</a>
        
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#navbar-collapse">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
            </div>
  
            <div class="navbar-collapse collapse" id="navbar-collapse">
          <nav role="navigation">
                        <ul class="menu nav navbar-nav"><li class="first leaf"><a href="/" title="">Головна</a></li>
  <li class="leaf"><a href="/news">Новини</a></li>
  <li class="last expanded active-trail active dropdown"><a href="/students_schedule" title="" class="active-trail dropdown-toggle active" data-toggle="dropdown">Розклад <span class="caret"></span></a><ul class="dropdown-menu"><li class="first leaf active-trail active"><a href="/students_schedule" title="" class="active-trail active">Розклад занять для студентів</a></li>
  <li class="leaf"><a href="/postgraduate_schedule" title="">Розклад занять для аспірантів</a></li>
  <li class="leaf"><a href="/schedule_selective" title="">Розклад занять з вибіркових дисциплін</a></li>
  <li class="leaf"><a href="/parttime_schedule" title="">Розклад для студентів-заочників</a></li>
  <li class="leaf"><a href="/postgraduate_parttime" title="">Розклад для аспірантів-заочників</a></li>
  <li class="leaf"><a href="/schedule_explanation" title="">Пояснення до розкладу</a></li>
  <li class="leaf"><a href="/students_exam" title="">Розклад екзаменів</a></li>
  <li class="leaf"><a href="/students_selective_exam" title="">Розклад екзаменів: групи за вибором</a></li>
  <li class="last leaf"><a href="/students_qualification" title="">Розклад захистів кваліфікаційних робіт та екзаменів</a></li>
  </ul></li>
  </ul>                                      </nav>
        </div>
        </div>
  </header>
  
  <div class="main-container container">
  
    <header role="banner" id="page-header">
      
        </header> <!-- /#page-header -->
  
    <div class="row">
  
      
      <section class="col-sm-9">
              <ol class="breadcrumb"><li><a href="/students_schedule" title="" class="active">Розклад</a></li>
  <li class="active">Розклад занять для студентів</li>
  </ol>      <a id="main-content"></a>
                      <h1 class="page-header">Розклад занять для студентів</h1>
                                                            <div class="region region-content">
      <section id="block-system-main" class="block block-system clearfix">
  
        
    <div class="view view-students-schedule view-id-students_schedule view-display-id-new_students_schedule view-dom-id-c2beefa9a9178b56fbd99ad9d2467305">
              <div class="view-header">
        <div class="student_schedule _header">
  <p>2022/2023 навчальний рік</p>
  <p>осінній семестр</p>
  </div>
      </div>
    
        <div class="view-filters">
        <form class="ctools-auto-submit-full-form ctools-auto-submit-processed" action="/students_schedule" method="get" id="views-exposed-form-students-schedule-new-students-schedule" accept-charset="UTF-8"><div><div class="views-exposed-form">
    <div class="views-exposed-widgets clearfix">
            <div id="edit-departmentparent-abbrname-selective-wrapper" class="views-exposed-widget views-widget-filter-departmentparent_abbrname_selective">
                    <label for="edit-departmentparent-abbrname-selective">
              Інститут          </label>
                          <div class="views-widget">
            <div class="form-item form-item-departmentparent-abbrname-selective form-type-select form-group"><select class="form-control form-select" id="edit-departmentparent-abbrname-selective" name="departmentparent_abbrname_selective"><option value="All" selected="selected">- Усі -</option><option value="ІКНІ">ІКНІ</option></select></div>        </div>
                </div>
            <div id="edit-studygroup-abbrname-selective-wrapper" class="views-exposed-widget views-widget-filter-studygroup_abbrname_selective">
                    <label for="edit-studygroup-abbrname-selective">
              Група          </label>
                          <div class="views-widget">
            <div class="form-item form-item-studygroup-abbrname-selective form-type-select form-group"><select class="form-control form-select" id="edit-studygroup-abbrname-selective" name="studygroup_abbrname_selective"><option value="All">- Усі -</option><option value="ІК-11">ІК-11</option><option value="ІК-12">ІК-12</option><option value="ІК-21">ІК-21</option><option value="ІК-22">ІК-22</option><option value="ІК-31">ІК-31</option><option value="ІК-32">ІК-32</option><option value="ІК-41">ІК-41</option><option value="ІР-11">ІР-11</option><option value="ІР-12">ІР-12</option><option value="ІР-13">ІР-13</option><option value="ІР-14">ІР-14</option><option value="ІР-15">ІР-15</option><option value="ІР-21">ІР-21</option><option value="ІР-22">ІР-22</option><option value="ІР-23">ІР-23</option><option value="ІР-24">ІР-24</option><option value="ІР-31">ІР-31</option><option value="ІР-32">ІР-32</option><option value="ІР-33">ІР-33</option><option value="ІР-41">ІР-41</option><option value="ІР-42">ІР-42</option><option value="ІР-43">ІР-43</option><option value="ІТ-11сп">ІТ-11сп</option><option value="ІТ-21">ІТ-21</option><option value="ІТ-22">ІТ-22</option><option value="ІТ-23">ІТ-23</option><option value="ІТ-31">ІТ-31</option><option value="ІТ-32">ІТ-32</option><option value="ІТ-33">ІТ-33</option><option value="ІТ-41">ІТ-41</option><option value="ІТ-42">ІТ-42</option><option value="ІТІС-11">ІТІС-11</option><option value="ІТІС-12">ІТІС-12</option><option value="ІТМ-11">ІТМ-11</option><option value="ІТМ-21">ІТМ-21</option><option value="ІТПА-11">ІТПА-11</option><option value="ІТУП-11">ІТУП-11</option><option value="ІТУП-12">ІТУП-12</option><option value="ІТУП-13">ІТУП-13</option><option value="АВ-11">АВ-11</option><option value="АВ-11сп">АВ-11сп</option><option value="АВ-12">АВ-12</option><option value="АВ-13">АВ-13</option><option value="АВ-21">АВ-21</option><option value="АВ-22">АВ-22</option><option value="АВ-23">АВ-23</option><option value="АВ-24">АВ-24</option><option value="АВ-31">АВ-31</option><option value="АВ-32">АВ-32</option><option value="АВ-33">АВ-33</option><option value="АВ-34">АВ-34</option><option value="АВ-41">АВ-41</option><option value="АВ-42">АВ-42</option><option value="АВКВ-11">АВКВ-11</option><option value="АВКС-11">АВКС-11</option><option value="АВКС-12">АВКС-12</option><option value="АВМ-11">АВМ-11</option><option value="АВМ-21">АВМ-21</option><option value="АВМ-22">АВМ-22</option><option value="АЕ-11">АЕ-11</option><option value="АЕ-21">АЕ-21</option><option value="АЕ-31">АЕ-31</option><option value="АЕ-41">АЕ-41</option><option value="АЕАЕ-11">АЕАЕ-11</option><option value="АН-11">АН-11</option><option value="АН-21">АН-21</option><option value="АН-31">АН-31</option><option value="АН-41">АН-41</option><option value="АНАІ-11">АНАІ-11</option><option value="АР-11">АР-11</option><option value="АР-12">АР-12</option><option value="АР-13">АР-13</option><option value="АР-14">АР-14</option><option value="АР-15">АР-15</option><option value="АР-16">АР-16</option><option value="АР-17">АР-17</option><option value="АР-18">АР-18</option><option value="АР-19">АР-19</option><option value="АР-21">АР-21</option><option value="АР-22">АР-22</option><option value="АР-23">АР-23</option><option value="АР-24">АР-24</option><option value="АР-25">АР-25</option><option value="АР-26">АР-26</option><option value="АР-27">АР-27</option><option value="АР-28">АР-28</option><option value="АР-29">АР-29</option><option value="АР-31">АР-31</option><option value="АР-32">АР-32</option><option value="АР-33">АР-33</option><option value="АР-34">АР-34</option><option value="АР-35">АР-35</option><option value="АР-36">АР-36</option><option value="АР-37">АР-37</option><option value="АР-38">АР-38</option><option value="АР-39">АР-39</option><option value="АР-41">АР-41</option><option value="АР-42">АР-42</option><option value="АР-43">АР-43</option><option value="АР-44">АР-44</option><option value="АР-45">АР-45</option><option value="АР-46">АР-46</option><option value="АР-47">АР-47</option><option value="АР-48">АР-48</option><option value="АР-49">АР-49</option><option value="АРБС-11">АРБС-11</option><option value="АРБС-12">АРБС-12</option><option value="АРБС-13">АРБС-13</option><option value="АРБС-21">АРБС-21</option><option value="АРБС-21f">АРБС-21f</option><option value="АРБС-22">АРБС-22</option><option value="АРДА-11">АРДА-11</option><option value="АРДА-21">АРДА-21</option><option value="АРМ-21">АРМ-21</option><option value="АРМ-22">АРМ-22</option><option value="АРМ-23">АРМ-23</option><option value="АРМ-24">АРМ-24</option><option value="АРМ-25">АРМ-25</option><option value="АРМБ-11">АРМБ-11</option><option value="АРМБ-21">АРМБ-21</option><option value="АРРП-11">АРРП-11</option><option value="АРРП-21">АРРП-21</option><option value="АТ-11">АТ-11</option><option value="АТ-11сп">АТ-11сп</option><option value="АТ-12">АТ-12</option><option value="АТ-13">АТ-13</option><option value="АТ-21">АТ-21</option><option value="АТ-22">АТ-22</option><option value="АТ-23">АТ-23</option><option value="АТ-24">АТ-24</option><option value="АТ-31">АТ-31</option><option value="АТ-32">АТ-32</option><option value="АТ-33">АТ-33</option><option value="АТ-34">АТ-34</option><option value="АТ-41">АТ-41</option><option value="АТ-42">АТ-42</option><option value="АТ-43">АТ-43</option><option value="АТСМ-11">АТСМ-11</option><option value="АТСМ-12">АТСМ-12</option><option value="АТСМ-13">АТСМ-13</option><option value="БІ-11">БІ-11</option><option value="БІ-21">БІ-21</option><option value="БІ-31">БІ-31</option><option value="БІ-41">БІ-41</option><option value="БІІР-11">БІІР-11</option><option value="БД-11">БД-11</option><option value="БД-11сп">БД-11сп</option><option value="БД-12">БД-12</option><option value="БД-13">БД-13</option><option value="БД-14">БД-14</option><option value="БД-15">БД-15</option><option value="БД-16">БД-16</option><option value="БД-17">БД-17</option><option value="БД-18">БД-18</option><option value="БД-19">БД-19</option><option value="БД-21">БД-21</option><option value="БД-22">БД-22</option><option value="БД-23">БД-23</option><option value="БД-24">БД-24</option><option value="БД-25">БД-25</option><option value="БД-26">БД-26</option><option value="БД-27">БД-27</option><option value="БД-28">БД-28</option><option value="БД-29">БД-29</option><option value="БД-31">БД-31</option><option value="БД-310">БД-310</option><option value="БД-31f">БД-31f</option><option value="БД-32">БД-32</option><option value="БД-33">БД-33</option><option value="БД-338">БД-338</option><option value="БД-34">БД-34</option><option value="БД-35">БД-35</option><option value="БД-36">БД-36</option><option value="БД-37">БД-37</option><option value="БД-38">БД-38</option><option value="БД-39">БД-39</option><option value="БД-41">БД-41</option><option value="БД-41f">БД-41f</option><option value="БД-42">БД-42</option><option value="БД-43">БД-43</option><option value="БД-44">БД-44</option><option value="БД-45">БД-45</option><option value="БД-46">БД-46</option><option value="БД-47">БД-47</option><option value="БД-48">БД-48</option><option value="БДАД-11">БДАД-11</option><option value="БДАД-12">БДАД-12</option><option value="БДВВ-11">БДВВ-11</option><option value="БДВВ-12">БДВВ-12</option><option value="БДМ-21">БДМ-21</option><option value="БДМ-22">БДМ-22</option><option value="БДМ-23">БДМ-23</option><option value="БДМ-24">БДМ-24</option><option value="БДМ-25">БДМ-25</option><option value="БДМБ-11">БДМБ-11</option><option value="БДМБ-12">БДМБ-12</option><option value="БДМТ-11">БДМТ-11</option><option value="БДМТ-12">БДМТ-12</option><option value="БДПЦ-11">БДПЦ-11</option><option value="БДПЦ-11f">БДПЦ-11f</option><option value="БДПЦ-12">БДПЦ-12</option><option value="БДПЦ-13">БДПЦ-13</option><option value="БДТГ-11">БДТГ-11</option><option value="БДТГ-12">БДТГ-12</option><option value="БДТК-11">БДТК-11</option><option value="БТ-11">БТ-11</option><option value="БТ-12">БТ-12</option><option value="БТ-21">БТ-21</option><option value="БТ-22">БТ-22</option><option value="БТ-31">БТ-31</option><option value="БТ-32">БТ-32</option><option value="БТ-41">БТ-41</option><option value="БТ-42">БТ-42</option><option value="БТБТ-11">БТБТ-11</option><option value="БТМ-11">БТМ-11</option><option value="БТМ-21">БТМ-21</option><option value="ВП-11">ВП-11</option><option value="ВП-12">ВП-12</option><option value="ВП-13">ВП-13</option><option value="ВП-21">ВП-21</option><option value="ВП-22">ВП-22</option><option value="ВП-31">ВП-31</option><option value="ВП-32">ВП-32</option><option value="ВП-41">ВП-41</option><option value="ВП-42">ВП-42</option><option value="ВПКТ-11">ВПКТ-11</option><option value="ВПКТ-12">ВПКТ-12</option><option value="ГБ-11">ГБ-11</option><option value="ГБ-21">ГБ-21</option><option value="ГБ-31">ГБ-31</option><option value="ГБ-41">ГБ-41</option><option value="ГБВІ-11">ГБВІ-11</option><option value="ГД-11">ГД-11</option><option value="ГД-11сп">ГД-11сп</option><option value="ГД-12">ГД-12</option><option value="ГД-13">ГД-13</option><option value="ГД-21">ГД-21</option><option value="ГД-22">ГД-22</option><option value="ГД-23">ГД-23</option><option value="ГД-31">ГД-31</option><option value="ГД-32">ГД-32</option><option value="ГД-33">ГД-33</option><option value="ГД-34">ГД-34</option><option value="ГД-41">ГД-41</option><option value="ГД-42">ГД-42</option><option value="ГДІГ-11">ГДІГ-11</option><option value="ГДГТ-11">ГДГТ-11</option><option value="ГДЗК-11">ГДЗК-11</option><option value="ГДКГ-11">ГДКГ-11</option><option value="ГДКГ-12">ГДКГ-12</option><option value="ГДОЗ-11">ГДОЗ-11</option><option value="ГДФД-11">ГДФД-11</option><option value="ГО-11">ГО-11</option><option value="ДЗЗВ-11">ДЗЗВ-11</option><option value="ДЗЗВ-21">ДЗЗВ-21</option><option value="ДЗМ-21">ДЗМ-21</option><option value="ДК-41">ДК-41</option><option value="ДК-42">ДК-42</option><option value="ДКІБ-11">ДКІБ-11</option><option value="ДКІБ-11f">ДКІБ-11f</option><option value="ДКІБ-12">ДКІБ-12</option><option value="ДС-11">ДС-11</option><option value="ДС-12">ДС-12</option><option value="ДС-13">ДС-13</option><option value="ДС-14">ДС-14</option><option value="ДС-15">ДС-15</option><option value="ДС-21">ДС-21</option><option value="ДС-22">ДС-22</option><option value="ДС-23">ДС-23</option><option value="ДС-24">ДС-24</option><option value="ДС-31">ДС-31</option><option value="ДС-32">ДС-32</option><option value="ДС-33">ДС-33</option><option value="ДС-34">ДС-34</option><option value="ДС-41">ДС-41</option><option value="ДС-42">ДС-42</option><option value="ДС-43">ДС-43</option><option value="ДС-44">ДС-44</option><option value="ЕБ-11">ЕБ-11</option><option value="ЕБ-12">ЕБ-12</option><option value="ЕБ-21">ЕБ-21</option><option value="ЕБ-22">ЕБ-22</option><option value="ЕБ-23">ЕБ-23</option><option value="ЕВ-11">ЕВ-11</option><option value="ЕВ-12">ЕВ-12</option><option value="ЕВ-13">ЕВ-13</option><option value="ЕВ-21">ЕВ-21</option><option value="ЕВ-21f">ЕВ-21f</option><option value="ЕВ-22">ЕВ-22</option><option value="ЕВ-31">ЕВ-31</option><option value="ЕВ-32">ЕВ-32</option><option value="ЕВ-33">ЕВ-33</option><option value="ЕВ-34">ЕВ-34</option><option value="ЕВ-41">ЕВ-41</option><option value="ЕВ-42">ЕВ-42</option><option value="ЕВ-43">ЕВ-43</option><option value="ЕВ-44">ЕВ-44</option><option value="ЕВМЕ-11">ЕВМЕ-11</option><option value="ЕВМЕ-11f">ЕВМЕ-11f</option><option value="ЕВМЕ-12">ЕВМЕ-12</option><option value="ЕЕ-11">ЕЕ-11</option><option value="ЕЕ-11сп">ЕЕ-11сп</option><option value="ЕЕ-12">ЕЕ-12</option><option value="ЕЕ-13">ЕЕ-13</option><option value="ЕЕ-21">ЕЕ-21</option><option value="ЕЕ-22">ЕЕ-22</option><option value="ЕЕ-23">ЕЕ-23</option><option value="ЕЕ-24">ЕЕ-24</option><option value="ЕЕ-25">ЕЕ-25</option><option value="ЕЕ-31">ЕЕ-31</option><option value="ЕЕ-32">ЕЕ-32</option><option value="ЕЕ-33">ЕЕ-33</option><option value="ЕЕ-34">ЕЕ-34</option><option value="ЕЕ-35">ЕЕ-35</option><option value="ЕЕ-41">ЕЕ-41</option><option value="ЕЕ-42">ЕЕ-42</option><option value="ЕЕ-43">ЕЕ-43</option><option value="ЕЕЕБ-11">ЕЕЕБ-11</option><option value="ЕЕЕЕ-11">ЕЕЕЕ-11</option><option value="ЕЕЕЕ-12">ЕЕЕЕ-12</option><option value="ЕЕЕЕ-13">ЕЕЕЕ-13</option><option value="ЕЕМ-11">ЕЕМ-11</option><option value="ЕК-31">ЕК-31</option><option value="ЕК-32">ЕК-32</option><option value="ЕК-33">ЕК-33</option><option value="ЕК-41">ЕК-41</option><option value="ЕКЕБ-11">ЕКЕБ-11</option><option value="ЕКЕБ-12">ЕКЕБ-12</option><option value="ЕКЕБ-13">ЕКЕБ-13</option><option value="ЕКЕБ-14">ЕКЕБ-14</option><option value="ЕКСЕі-11">ЕКСЕі-11</option><option value="ЕКУБ-11">ЕКУБ-11</option><option value="ЕКУП-11">ЕКУП-11</option><option value="ЕЛ-11">ЕЛ-11</option><option value="ЕЛ-21">ЕЛ-21</option><option value="ЕЛ-31">ЕЛ-31</option><option value="ЕЛ-41">ЕЛ-41</option><option value="ЕЛЕА-11">ЕЛЕА-11</option><option value="ЕО-11">ЕО-11</option><option value="ЕО-21">ЕО-21</option><option value="ЕО-31">ЕО-31</option><option value="ЕО-32">ЕО-32</option><option value="ЕО-41">ЕО-41</option><option value="ЕОЕК-11">ЕОЕК-11</option><option value="ЕОЕС-11">ЕОЕС-11</option><option value="ЕОМ-11">ЕОМ-11</option><option value="ЖР-11">ЖР-11</option><option value="ЖР-12">ЖР-12</option><option value="ЖР-13">ЖР-13</option><option value="ЖР-21">ЖР-21</option><option value="ЖР-22">ЖР-22</option><option value="ЖР-23">ЖР-23</option><option value="ЖР-31">ЖР-31</option><option value="ЖР-32">ЖР-32</option><option value="ЖР-33">ЖР-33</option><option value="ЖР-41">ЖР-41</option><option value="ЖР-42">ЖР-42</option><option value="ЖР-43">ЖР-43</option><option value="ЖРЗВ-11">ЖРЗВ-11</option><option value="КІ-11">КІ-11</option><option value="КІ-110">КІ-110</option><option value="КІ-12">КІ-12</option><option value="КІ-13">КІ-13</option><option value="КІ-14">КІ-14</option><option value="КІ-15">КІ-15</option><option value="КІ-16">КІ-16</option><option value="КІ-17">КІ-17</option><option value="КІ-18">КІ-18</option><option value="КІ-19">КІ-19</option><option value="КІ-201">КІ-201</option><option value="КІ-202">КІ-202</option><option value="КІ-203">КІ-203</option><option value="КІ-204">КІ-204</option><option value="КІ-205">КІ-205</option><option value="КІ-206">КІ-206</option><option value="КІ-207">КІ-207</option><option value="КІ-208">КІ-208</option><option value="КІ-209">КІ-209</option><option value="КІ-210">КІ-210</option><option value="КІ-211">КІ-211</option><option value="КІ-31">КІ-31</option><option value="КІ-32">КІ-32</option><option value="КІ-33">КІ-33</option><option value="КІ-34">КІ-34</option><option value="КІ-35">КІ-35</option><option value="КІ-36">КІ-36</option><option value="КІ-37">КІ-37</option><option value="КІ-38">КІ-38</option><option value="КІ-39">КІ-39</option><option value="КІ-41">КІ-41</option><option value="КІ-42">КІ-42</option><option value="КІ-43">КІ-43</option><option value="КІ-44">КІ-44</option><option value="КІ-45">КІ-45</option><option value="КІ-46">КІ-46</option><option value="КІ-47">КІ-47</option><option value="КІ-48">КІ-48</option><option value="КІКС-11">КІКС-11</option><option value="КІКС-12">КІКС-12</option><option value="КІСК-11">КІСК-11</option><option value="КІСК-12">КІСК-12</option><option value="КІСП-11">КІСП-11</option><option value="КІСП-12">КІСП-12</option><option value="КБ-11">КБ-11</option><option value="КБ-110">КБ-110</option><option value="КБ-12">КБ-12</option><option value="КБ-13">КБ-13</option><option value="КБ-14">КБ-14</option><option value="КБ-15">КБ-15</option><option value="КБ-16">КБ-16</option><option value="КБ-17">КБ-17</option><option value="КБ-18">КБ-18</option><option value="КБ-19">КБ-19</option><option value="КБ-201">КБ-201</option><option value="КБ-202">КБ-202</option><option value="КБ-203">КБ-203</option><option value="КБ-204">КБ-204</option><option value="КБ-205">КБ-205</option><option value="КБ-206">КБ-206</option><option value="КБ-207">КБ-207</option><option value="КБ-208">КБ-208</option><option value="КБ-209">КБ-209</option><option value="КБ-210">КБ-210</option><option value="КБ-31">КБ-31</option><option value="КБ-32">КБ-32</option><option value="КБ-33">КБ-33</option><option value="КБ-34">КБ-34</option><option value="КБ-35">КБ-35</option><option value="КБ-36">КБ-36</option><option value="КБ-37">КБ-37</option><option value="КБ-38">КБ-38</option><option value="КБ-39">КБ-39</option><option value="КБ-41">КБ-41</option><option value="КБ-42">КБ-42</option><option value="КБ-43">КБ-43</option><option value="КБ-44">КБ-44</option><option value="КБ-45">КБ-45</option><option value="КБ-46">КБ-46</option><option value="КБ-47">КБ-47</option><option value="КБ-48">КБ-48</option><option value="КБАС-11">КБАС-11</option><option value="КББІ-11">КББІ-11</option><option value="КББІ-12">КББІ-12</option><option value="КБСТ-11">КБСТ-11</option><option value="КБСТ-12">КБСТ-12</option><option value="КБУІ-11">КБУІ-11</option><option value="КН-11сп">КН-11сп</option><option value="КН-201">КН-201</option><option value="КН-202">КН-202</option><option value="КН-203">КН-203</option><option value="КН-204">КН-204</option><option value="КН-205">КН-205</option><option value="КН-206">КН-206</option><option value="КН-207">КН-207</option><option value="КН-208">КН-208</option><option value="КН-209">КН-209</option><option value="КН-210">КН-210</option><option value="КН-211">КН-211</option><option value="КН-212">КН-212</option><option value="КН-213">КН-213</option><option value="КН-214">КН-214</option><option value="КН-215">КН-215</option><option value="КН-216">КН-216</option><option value="КН-217">КН-217</option><option value="КН-218">КН-218</option><option value="КН-219f">КН-219f</option><option value="КН-301">КН-301</option><option value="КН-302">КН-302</option><option value="КН-303">КН-303</option><option value="КН-304">КН-304</option><option value="КН-305">КН-305</option><option value="КН-306">КН-306</option><option value="КН-307">КН-307</option><option value="КН-308">КН-308</option><option value="КН-309">КН-309</option><option value="КН-310">КН-310</option><option value="КН-311">КН-311</option><option value="КН-312">КН-312</option><option value="КН-313">КН-313</option><option value="КН-314">КН-314</option><option value="КН-315">КН-315</option><option value="КН-316">КН-316</option><option value="КН-317f">КН-317f</option><option value="КН-401">КН-401</option><option value="КН-402">КН-402</option><option value="КН-403">КН-403</option><option value="КН-404">КН-404</option><option value="КН-405">КН-405</option><option value="КН-406">КН-406</option><option value="КН-407">КН-407</option><option value="КН-408">КН-408</option><option value="КН-409">КН-409</option><option value="КН-410">КН-410</option><option value="КН-411">КН-411</option><option value="КН-412">КН-412</option><option value="КН-413">КН-413</option><option value="КН-414">КН-414</option><option value="КН-417f">КН-417f</option><option value="КНІК-11">КНІК-11</option><option value="КНІТ-11">КНІТ-11</option><option value="КНІТ-12">КНІТ-12</option><option value="КНМ-11">КНМ-11</option><option value="КНМ-21">КНМ-21</option><option value="КНСП-11">КНСП-11</option><option value="КНСП-12">КНСП-12</option><option value="КНСШ-11">КНСШ-11</option><option value="КНСШ-12">КНСШ-12</option><option value="КНСШ-13">КНСШ-13</option><option value="КНСШ-14">КНСШ-14</option><option value="КНУО-11">КНУО-11</option><option value="КНУС-11">КНУС-11</option><option value="КНУС-12">КНУС-12</option><option value="КНУС-13">КНУС-13</option><option value="КНУС-14">КНУС-14</option><option value="ЛА-11">ЛА-11</option><option value="ЛА-12">ЛА-12</option><option value="МІ-11">МІ-11</option><option value="МІ-21">МІ-21</option><option value="МІ-22">МІ-22</option><option value="МІ-31">МІ-31</option><option value="МІ-41">МІ-41</option><option value="МІМ-21">МІМ-21</option><option value="МБ-11">МБ-11</option><option value="МБ-11сп">МБ-11сп</option><option value="МБ-12">МБ-12</option><option value="МБ-21">МБ-21</option><option value="МБ-22">МБ-22</option><option value="МБ-23">МБ-23</option><option value="МБ-31">МБ-31</option><option value="МБ-32">МБ-32</option><option value="МБ-33">МБ-33</option><option value="МБ-41">МБ-41</option><option value="МБ-41f">МБ-41f</option><option value="МБ-42">МБ-42</option><option value="МБКІ-11">МБКІ-11</option><option value="МБКІ-12">МБКІ-12</option><option value="МБКГ-11">МБКГ-11</option><option value="МВ-11">МВ-11</option><option value="МВ-12">МВ-12</option><option value="МВ-13">МВ-13</option><option value="МВ-14">МВ-14</option><option value="МВ-21">МВ-21</option><option value="МВ-22">МВ-22</option><option value="МВ-23">МВ-23</option><option value="МВ-24">МВ-24</option><option value="МВ-31">МВ-31</option><option value="МВ-32">МВ-32</option><option value="МВ-33">МВ-33</option><option value="МВ-34">МВ-34</option><option value="МВ-35">МВ-35</option><option value="МВ-36">МВ-36</option><option value="МВ-41">МВ-41</option><option value="МВ-42">МВ-42</option><option value="МВ-43">МВ-43</option><option value="МВ-44">МВ-44</option><option value="МВ-45">МВ-45</option><option value="МВ-46">МВ-46</option><option value="МВ-47">МВ-47</option><option value="МВМВ-11">МВМВ-11</option><option value="МВМВ-12">МВМВ-12</option><option value="МЕ-11">МЕ-11</option><option value="МЕ-12">МЕ-12</option><option value="МЕ-13">МЕ-13</option><option value="МЕ-14">МЕ-14</option><option value="МЕ-15">МЕ-15</option><option value="МЕ-16">МЕ-16</option><option value="МЕ-17">МЕ-17</option><option value="МЕ-18">МЕ-18</option><option value="МЕ-19">МЕ-19</option><option value="МЕ-21">МЕ-21</option><option value="МЕ-21f">МЕ-21f</option><option value="МЕ-22">МЕ-22</option><option value="МЕ-23">МЕ-23</option><option value="МЕ-24">МЕ-24</option><option value="МЕ-25">МЕ-25</option><option value="МЕ-26">МЕ-26</option><option value="МЕ-27">МЕ-27</option><option value="МЕ-31">МЕ-31</option><option value="МЕ-310">МЕ-310</option><option value="МЕ-311">МЕ-311</option><option value="МЕ-312">МЕ-312</option><option value="МЕ-31f">МЕ-31f</option><option value="МЕ-32">МЕ-32</option><option value="МЕ-33">МЕ-33</option><option value="МЕ-34">МЕ-34</option><option value="МЕ-35">МЕ-35</option><option value="МЕ-36">МЕ-36</option><option value="МЕ-37">МЕ-37</option><option value="МЕ-38">МЕ-38</option><option value="МЕ-39">МЕ-39</option><option value="МЕ-41">МЕ-41</option><option value="МЕ-42">МЕ-42</option><option value="МЕ-43">МЕ-43</option><option value="МЕ-44">МЕ-44</option><option value="МЕ-45">МЕ-45</option><option value="МЕ-46">МЕ-46</option><option value="МЕ-47">МЕ-47</option><option value="МЕ-48">МЕ-48</option><option value="МЕ-49">МЕ-49</option><option value="МЕІД-11">МЕІД-11</option><option value="МЕБА-11">МЕБА-11</option><option value="МЕБА-12">МЕБА-12</option><option value="МЕЗД-11">МЕЗД-11</option><option value="МЕЗД-12">МЕЗД-12</option><option value="МЕЛГ-11">МЕЛГ-11</option><option value="МЕМ-11">МЕМ-11</option><option value="МЕМ-21">МЕМ-21</option><option value="МЕМ-22">МЕМ-22</option><option value="МЕМ-23">МЕМ-23</option><option value="МЕМД-11">МЕМД-11</option><option value="МЕНД-11">МЕНД-11</option><option value="МЕОА-11">МЕОА-11</option><option value="МЕОА-11f">МЕОА-11f</option><option value="МЕРІі-11">МЕРІі-11</option><option value="МЕРІі-12">МЕРІі-12</option><option value="МЕУІ-11">МЕУІ-11</option><option value="МЕУПі-11">МЕУПі-11</option><option value="МЕУПі-12">МЕУПі-12</option><option value="МЕФБі-11">МЕФБі-11</option><option value="МЗ-11">МЗ-11</option><option value="МЗ-21">МЗ-21</option><option value="МЗ-22">МЗ-22</option><option value="МЗ-31">МЗ-31</option><option value="МЗ-32">МЗ-32</option><option value="МЗ-41">МЗ-41</option><option value="МК-11">МК-11</option><option value="МК-12">МК-12</option><option value="МК-13">МК-13</option><option value="МК-14">МК-14</option><option value="МК-15">МК-15</option><option value="МК-21">МК-21</option><option value="МК-22">МК-22</option><option value="МК-23">МК-23</option><option value="МК-24">МК-24</option><option value="МК-25">МК-25</option><option value="МК-31">МК-31</option><option value="МК-32">МК-32</option><option value="МК-33">МК-33</option><option value="МК-34">МК-34</option><option value="МК-41">МК-41</option><option value="МК-42">МК-42</option><option value="МК-43">МК-43</option><option value="МК-44">МК-44</option><option value="МКІМ-11">МКІМ-11</option><option value="МКМ-11">МКМ-11</option><option value="МКМ-21">МКМ-21</option><option value="МКМА-11">МКМА-11</option><option value="МЛ-31">МЛ-31</option><option value="МЛ-32">МЛ-32</option><option value="МН-11">МН-11</option><option value="МН-21">МН-21</option><option value="МН-22">МН-22</option><option value="МН-31">МН-31</option><option value="МН-41">МН-41</option><option value="МНМ-11">МНМ-11</option><option value="МНМ-12">МНМ-12</option><option value="МНМ-21">МНМ-21</option><option value="МП-11">МП-11</option><option value="МП-11сп">МП-11сп</option><option value="МП-12">МП-12</option><option value="МП-21">МП-21</option><option value="МП-21f">МП-21f</option><option value="МП-22">МП-22</option><option value="МП-24">МП-24</option><option value="МП-31">МП-31</option><option value="МП-31f">МП-31f</option><option value="МП-32">МП-32</option><option value="МП-33">МП-33</option><option value="МП-41">МП-41</option><option value="МП-41f">МП-41f</option><option value="МП-42">МП-42</option><option value="МПРС-11">МПРС-11</option><option value="МПТЗ-11">МПТЗ-11</option><option value="МПТМ-11">МПТМ-11</option><option value="МПТП-11">МПТП-11</option><option value="МТ-11">МТ-11</option><option value="МТ-12">МТ-12</option><option value="МТ-21">МТ-21</option><option value="МТ-22">МТ-22</option><option value="МТ-23">МТ-23</option><option value="МТ-31">МТ-31</option><option value="МТ-32">МТ-32</option><option value="МТ-33">МТ-33</option><option value="МТ-41">МТ-41</option><option value="МТ-42">МТ-42</option><option value="МТІТ-11">МТІТ-11</option><option value="МТМВ-11">МТМВ-11</option><option value="МТТВ-11">МТТВ-11</option><option value="МТЯС-11">МТЯС-11</option><option value="НГ-11">НГ-11</option><option value="НГ-21">НГ-21</option><option value="НГ-31">НГ-31</option><option value="НГ-32">НГ-32</option><option value="НГ-41">НГ-41</option><option value="НЗ-11">НЗ-11</option><option value="НЗ-21">НЗ-21</option><option value="НЗ-31">НЗ-31</option><option value="НЗ-41">НЗ-41</option><option value="НЗГІ-11">НЗГІ-11</option><option value="НЗКА-11">НЗКА-11</option><option value="НЗКМ-11">НЗКМ-11</option><option value="НОПН-11">НОПН-11</option><option value="НОПН-11f">НОПН-11f</option><option value="НОПН-12">НОПН-12</option><option value="НОПН-13">НОПН-13</option><option value="НОПН-14">НОПН-14</option><option value="ОІ-11">ОІ-11</option><option value="ОІ-12">ОІ-12</option><option value="ОІ-13">ОІ-13</option><option value="ОІ-14">ОІ-14</option><option value="ОІ-15">ОІ-15</option><option value="ОІ-16">ОІ-16</option><option value="ОП-11">ОП-11</option><option value="ОП-21">ОП-21</option><option value="ОП-22">ОП-22</option><option value="ОП-31">ОП-31</option><option value="ОП-32">ОП-32</option><option value="ОП-33">ОП-33</option><option value="ОП-41">ОП-41</option><option value="ОП-42">ОП-42</option><option value="ОПАГ-11">ОПАГ-11</option><option value="ОПМ-11">ОПМ-11</option><option value="ОПМ-21">ОПМ-21</option><option value="ПІ-11">ПІ-11</option><option value="ПБ-11">ПБ-11</option><option value="ПБ-21">ПБ-21</option><option value="ПБ-31">ПБ-31</option><option value="ПБ-41">ПБ-41</option><option value="ПБПБ-11">ПБПБ-11</option><option value="ПВ-11">ПВ-11</option><option value="ПВ-110">ПВ-110</option><option value="ПВ-12">ПВ-12</option><option value="ПВ-13">ПВ-13</option><option value="ПВ-14">ПВ-14</option><option value="ПВ-15">ПВ-15</option><option value="ПВ-16">ПВ-16</option><option value="ПВ-17">ПВ-17</option><option value="ПВ-18">ПВ-18</option><option value="ПВ-19">ПВ-19</option><option value="ПВ-21">ПВ-21</option><option value="ПВ-22">ПВ-22</option><option value="ПВ-23">ПВ-23</option><option value="ПВ-24">ПВ-24</option><option value="ПВ-25">ПВ-25</option><option value="ПВ-26">ПВ-26</option><option value="ПВ-27">ПВ-27</option><option value="ПВ-31">ПВ-31</option><option value="ПВ-310">ПВ-310</option><option value="ПВ-32">ПВ-32</option><option value="ПВ-33">ПВ-33</option><option value="ПВ-34">ПВ-34</option><option value="ПВ-35">ПВ-35</option><option value="ПВ-36">ПВ-36</option><option value="ПВ-37">ПВ-37</option><option value="ПВ-38">ПВ-38</option><option value="ПВ-39">ПВ-39</option><option value="ПВ-41">ПВ-41</option><option value="ПВ-410">ПВ-410</option><option value="ПВ-411">ПВ-411</option><option value="ПВ-42">ПВ-42</option><option value="ПВ-43">ПВ-43</option><option value="ПВ-44">ПВ-44</option><option value="ПВ-45">ПВ-45</option><option value="ПВ-46">ПВ-46</option><option value="ПВ-47">ПВ-47</option><option value="ПВ-48">ПВ-48</option><option value="ПВ-49">ПВ-49</option><option value="ПВПР-11">ПВПР-11</option><option value="ПВПР-11f">ПВПР-11f</option><option value="ПВПР-12">ПВПР-12</option><option value="ПВПР-13">ПВПР-13</option><option value="ПВПР-14">ПВПР-14</option><option value="ПВПР-15">ПВПР-15</option><option value="ПВПР-16">ПВПР-16</option><option value="ПВПР-17">ПВПР-17</option><option value="ПВПР-21">ПВПР-21</option><option value="ПВПР-22">ПВПР-22</option><option value="ПВПР-23">ПВПР-23</option><option value="ПВПР-24">ПВПР-24</option><option value="ПВПР-25">ПВПР-25</option><option value="ПД-31">ПД-31</option><option value="ПЗ-11">ПЗ-11</option><option value="ПЗ-12">ПЗ-12</option><option value="ПЗ-13">ПЗ-13</option><option value="ПЗ-14">ПЗ-14</option><option value="ПЗ-15">ПЗ-15</option><option value="ПЗ-16">ПЗ-16</option><option value="ПЗ-17">ПЗ-17</option><option value="ПЗ-18">ПЗ-18</option><option value="ПЗ-21">ПЗ-21</option><option value="ПЗ-22">ПЗ-22</option><option value="ПЗ-23">ПЗ-23</option><option value="ПЗ-24">ПЗ-24</option><option value="ПЗ-25">ПЗ-25</option><option value="ПЗ-26">ПЗ-26</option><option value="ПЗ-31">ПЗ-31</option><option value="ПЗ-32">ПЗ-32</option><option value="ПЗ-33">ПЗ-33</option><option value="ПЗ-34">ПЗ-34</option><option value="ПЗ-35">ПЗ-35</option><option value="ПЗ-36">ПЗ-36</option><option value="ПЗ-41">ПЗ-41</option><option value="ПЗ-42">ПЗ-42</option><option value="ПЗ-43">ПЗ-43</option><option value="ПЗ-44">ПЗ-44</option><option value="ПЗ-45">ПЗ-45</option><option value="ПЗ-46" selected="selected">ПЗ-46</option><option value="ПЗІП-11">ПЗІП-11</option><option value="ПЗІП-12">ПЗІП-12</option><option value="ПЗМ-11">ПЗМ-11</option><option value="ПЗМ-21">ПЗМ-21</option><option value="ПК-41">ПК-41</option><option value="ПМ-11">ПМ-11</option><option value="ПМ-12">ПМ-12</option><option value="ПМ-13">ПМ-13</option><option value="ПМ-14">ПМ-14</option><option value="ПМ-21">ПМ-21</option><option value="ПМ-22">ПМ-22</option><option value="ПМ-23">ПМ-23</option><option value="ПМ-31">ПМ-31</option><option value="ПМ-32">ПМ-32</option><option value="ПМ-33">ПМ-33</option><option value="ПМ-41">ПМ-41</option><option value="ПМ-42">ПМ-42</option><option value="ПМ-43">ПМ-43</option><option value="ПМКМ-11">ПМКМ-11</option><option value="ПММ-21">ПММ-21</option><option value="ПМПМ-11">ПМПМ-11</option><option value="ПП-11">ПП-11</option><option value="ПП-12">ПП-12</option><option value="ПП-13">ПП-13</option><option value="ПП-14">ПП-14</option><option value="ПП-15">ПП-15</option><option value="ПП-16">ПП-16</option><option value="ПП-17">ПП-17</option><option value="ПР-11">ПР-11</option><option value="ПС-11">ПС-11</option><option value="ПС-12">ПС-12</option><option value="ПС-13">ПС-13</option><option value="ПС-14">ПС-14</option><option value="ПС-15">ПС-15</option><option value="ПС-16">ПС-16</option><option value="ПС-17">ПС-17</option><option value="ПС-18">ПС-18</option><option value="ПС-19">ПС-19</option><option value="ПС-21">ПС-21</option><option value="ПС-22">ПС-22</option><option value="ПС-23">ПС-23</option><option value="ПС-24">ПС-24</option><option value="ПС-31">ПС-31</option><option value="ПС-32">ПС-32</option><option value="ПС-33">ПС-33</option><option value="ПС-34">ПС-34</option><option value="ПС-35">ПС-35</option><option value="ПС-41">ПС-41</option><option value="ПС-42">ПС-42</option><option value="ПС-43">ПС-43</option><option value="ПС-44">ПС-44</option><option value="ПС-45">ПС-45</option><option value="ПСПС-11">ПСПС-11</option><option value="ПСПС-12">ПСПС-12</option><option value="ПТ-11">ПТ-11</option><option value="ПТ-12">ПТ-12</option><option value="ПТ-21">ПТ-21</option><option value="ПТ-31">ПТ-31</option><option value="ПТ-41">ПТ-41</option><option value="ПТ-42">ПТ-42</option><option value="ПТПБ-11">ПТПБ-11</option><option value="ПУ-31">ПУ-31</option><option value="ПУ-41">ПУ-41</option><option value="ПФ-11">ПФ-11</option><option value="ПФ-21">ПФ-21</option><option value="ПФ-31">ПФ-31</option><option value="ПФ-41">ПФ-41</option><option value="ПФГВ-11">ПФГВ-11</option><option value="ПЦ-11">ПЦ-11</option><option value="ПЦ-21">ПЦ-21</option><option value="ПЦ-22">ПЦ-22</option><option value="ПЦ-31">ПЦ-31</option><option value="РІ-11">РІ-11</option><option value="РІ-12">РІ-12</option><option value="РМ-11">РМ-11</option><option value="РМ-21">РМ-21</option><option value="РМ-31">РМ-31</option><option value="РМ-41">РМ-41</option><option value="РММ-11">РММ-11</option><option value="РТМ-11">РТМ-11</option><option value="РТМ-12">РТМ-12</option><option value="РТМ-21">РТМ-21</option><option value="СА-11">СА-11</option><option value="СА-12">СА-12</option><option value="СА-21">СА-21</option><option value="СА-22">СА-22</option><option value="СА-23">СА-23</option><option value="СА-31">СА-31</option><option value="СА-32">СА-32</option><option value="СА-33">СА-33</option><option value="СА-41">СА-41</option><option value="СА-42">СА-42</option><option value="СААД-11">СААД-11</option><option value="САМ-11">САМ-11</option><option value="САМ-21">САМ-21</option><option value="САСМ-11">САСМ-11</option><option value="САСМ-12">САСМ-12</option><option value="СЕ-11">СЕ-11</option><option value="СЕ-12">СЕ-12</option><option value="СЕ-21">СЕ-21</option><option value="СЕ-31">СЕ-31</option><option value="СЕ-41">СЕ-41</option><option value="СЕ-42">СЕ-42</option><option value="СЗ-11">СЗ-11</option><option value="СЗ-21">СЗ-21</option><option value="СЗ-22">СЗ-22</option><option value="СЗ-31">СЗ-31</option><option value="СЗ-32">СЗ-32</option><option value="СЗ-41">СЗ-41</option><option value="СЗУУ-11">СЗУУ-11</option><option value="СК-11">СК-11</option><option value="СК-12">СК-12</option><option value="СК-21">СК-21</option><option value="СК-22">СК-22</option><option value="СК-23">СК-23</option><option value="СК-31">СК-31</option><option value="СК-32">СК-32</option><option value="СМ-41">СМ-41</option><option value="СМУС-11">СМУС-11</option><option value="СМУС-12">СМУС-12</option><option value="СО-21">СО-21</option><option value="СО-31">СО-31</option><option value="СО-41">СО-41</option><option value="СР-11">СР-11</option><option value="СР-21">СР-21</option><option value="СР-22">СР-22</option><option value="СР-31">СР-31</option><option value="СР-32">СР-32</option><option value="СР-41">СР-41</option><option value="СРСО-11">СРСО-11</option><option value="СРСО-12">СРСО-12</option><option value="СТ-11">СТ-11</option><option value="СТ-21">СТ-21</option><option value="СТ-31">СТ-31</option><option value="ТЕ-11">ТЕ-11</option><option value="ТЕ-21">ТЕ-21</option><option value="ТЕ-31">ТЕ-31</option><option value="ТЕ-41">ТЕ-41</option><option value="ТЕТЕ-11">ТЕТЕ-11</option><option value="ТЗ-21">ТЗ-21</option><option value="ТЗ-31">ТЗ-31</option><option value="ТЗМ-11">ТЗМ-11</option><option value="ТЗПЕ-11">ТЗПЕ-11</option><option value="ТЛ-11">ТЛ-11</option><option value="ТЛ-21">ТЛ-21</option><option value="ТР-11">ТР-11</option><option value="ТР-12">ТР-12</option><option value="ТР-13">ТР-13</option><option value="ТР-14">ТР-14</option><option value="ТР-15">ТР-15</option><option value="ТР-21">ТР-21</option><option value="ТР-22">ТР-22</option><option value="ТР-23">ТР-23</option><option value="ТР-24">ТР-24</option><option value="ТР-25">ТР-25</option><option value="ТР-31">ТР-31</option><option value="ТР-32">ТР-32</option><option value="ТР-33">ТР-33</option><option value="ТР-34">ТР-34</option><option value="ТР-41">ТР-41</option><option value="ТР-42">ТР-42</option><option value="ТР-43">ТР-43</option><option value="ТР-44">ТР-44</option><option value="ТРІМ-11">ТРІМ-11</option><option value="ТРМ-21">ТРМ-21</option><option value="ТРМ-22">ТРМ-22</option><option value="ТРМ-23">ТРМ-23</option><option value="ТРПА-11">ТРПА-11</option><option value="ТРРП-11">ТРРП-11</option><option value="ТРСА-11">ТРСА-11</option><option value="ТРТЕ-11">ТРТЕ-11</option><option value="ТТ-11">ТТ-11</option><option value="ТТ-11сп">ТТ-11сп</option><option value="ТТ-12">ТТ-12</option><option value="ТТ-13">ТТ-13</option><option value="ТТ-14">ТТ-14</option><option value="ТТ-21">ТТ-21</option><option value="ТТ-22">ТТ-22</option><option value="ТТ-23">ТТ-23</option><option value="ТТ-24">ТТ-24</option><option value="ТТ-31">ТТ-31</option><option value="ТТ-32">ТТ-32</option><option value="ТТ-33">ТТ-33</option><option value="ТТ-34">ТТ-34</option><option value="ТТ-41">ТТ-41</option><option value="ТТ-42">ТТ-42</option><option value="ТТ-43">ТТ-43</option><option value="ТТОП-11">ТТОП-11</option><option value="ТТОП-12">ТТОП-12</option><option value="ТТОП-13">ТТОП-13</option><option value="ТТОР-11">ТТОР-11</option><option value="ТТОР-12">ТТОР-12</option><option value="ТУ-11">ТУ-11</option><option value="ТУ-21">ТУ-21</option><option value="ТУ-22">ТУ-22</option><option value="ТУ-31">ТУ-31</option><option value="ТУ-32">ТУ-32</option><option value="ТУ-41">ТУ-41</option><option value="ТУ-42">ТУ-42</option><option value="ТУ-43">ТУ-43</option><option value="ТУТД-11">ТУТД-11</option><option value="УААМі-11">УААМі-11</option><option value="УААМі-12">УААМі-12</option><option value="УААМі-13">УААМі-13</option><option value="УААМі-14">УААМі-14</option><option value="УАПА-11">УАПА-11</option><option value="УАПА-12">УАПА-12</option><option value="УАПА-13">УАПА-13</option><option value="УАРАі-11">УАРАі-11</option><option value="УАі-11">УАі-11</option><option value="УАі-21">УАі-21</option><option value="УАі-31">УАі-31</option><option value="УАі-31f">УАі-31f</option><option value="УАі-32">УАі-32</option><option value="УАі-41">УАі-41</option><option value="УАі-42">УАі-42</option><option value="УП-11">УП-11</option><option value="УП-21">УП-21</option><option value="ФІ-11">ФІ-11</option><option value="ФІ-21">ФІ-21</option><option value="ФБ-11">ФБ-11</option><option value="ФБ-12">ФБ-12</option><option value="ФБ-13">ФБ-13</option><option value="ФБ-21">ФБ-21</option><option value="ФБ-22">ФБ-22</option><option value="ФБ-31">ФБ-31</option><option value="ФБ-32">ФБ-32</option><option value="ФБ-33">ФБ-33</option><option value="ФБ-34">ФБ-34</option><option value="ФБ-41">ФБ-41</option><option value="ФБ-42">ФБ-42</option><option value="ФБ-43">ФБ-43</option><option value="ФБ-44">ФБ-44</option><option value="ФБМ-11">ФБМ-11</option><option value="ФБМ-21">ФБМ-21</option><option value="ФБСС-11">ФБСС-11</option><option value="ФЛ-11">ФЛ-11</option><option value="ФЛ-12">ФЛ-12</option><option value="ФЛ-13">ФЛ-13</option><option value="ФЛ-14">ФЛ-14</option><option value="ФЛ-15">ФЛ-15</option><option value="ФЛ-16">ФЛ-16</option><option value="ФЛ-21">ФЛ-21</option><option value="ФЛ-22">ФЛ-22</option><option value="ФЛ-23">ФЛ-23</option><option value="ФЛ-24">ФЛ-24</option><option value="ФЛ-25">ФЛ-25</option><option value="ФЛ-26">ФЛ-26</option><option value="ФЛ-31">ФЛ-31</option><option value="ФЛ-32">ФЛ-32</option><option value="ФЛ-33">ФЛ-33</option><option value="ФЛ-34">ФЛ-34</option><option value="ФЛ-35">ФЛ-35</option><option value="ФЛ-36">ФЛ-36</option><option value="ФЛ-37">ФЛ-37</option><option value="ФЛ-38">ФЛ-38</option><option value="ФЛ-41">ФЛ-41</option><option value="ФЛ-42">ФЛ-42</option><option value="ФЛ-43">ФЛ-43</option><option value="ФЛ-44">ФЛ-44</option><option value="ФЛ-45">ФЛ-45</option><option value="ФЛ-46">ФЛ-46</option><option value="ФЛ-47">ФЛ-47</option><option value="ФЛ-48">ФЛ-48</option><option value="ФЛПЛ-11">ФЛПЛ-11</option><option value="ФЛПЛ-12">ФЛПЛ-12</option><option value="ФР-11">ФР-11</option><option value="ФР-21">ФР-21</option><option value="ФР-31">ФР-31</option><option value="ФР-32">ФР-32</option><option value="ФР-41">ФР-41</option><option value="ФР-42">ФР-42</option><option value="ФРМ-11">ФРМ-11</option><option value="ФРФП-11">ФРФП-11</option><option value="ХР-11">ХР-11</option><option value="ХР-12">ХР-12</option><option value="ХР-21">ХР-21</option><option value="ХР-22">ХР-22</option><option value="ХР-31">ХР-31</option><option value="ХР-41">ХР-41</option><option value="ХР-42">ХР-42</option><option value="ХРБВ-11">ХРБВ-11</option><option value="ХРБВ-12">ХРБВ-12</option><option value="ХТ-11">ХТ-11</option><option value="ХТ-12">ХТ-12</option><option value="ХТ-21">ХТ-21</option><option value="ХТ-22">ХТ-22</option><option value="ХТ-23">ХТ-23</option><option value="ХТ-24">ХТ-24</option><option value="ХТ-31">ХТ-31</option><option value="ХТ-32">ХТ-32</option><option value="ХТ-33">ХТ-33</option><option value="ХТ-34">ХТ-34</option><option value="ХТ-41">ХТ-41</option><option value="ХТ-42">ХТ-42</option><option value="ХТ-43">ХТ-43</option><option value="ХТ-44">ХТ-44</option><option value="ХТ-45">ХТ-45</option><option value="ХТ-46">ХТ-46</option><option value="ХТ-47">ХТ-47</option><option value="ХТВС-11">ХТВС-11</option><option value="ХТКХ-11">ХТКХ-11</option><option value="ХТМ-11">ХТМ-11</option><option value="ХТМ-21">ХТМ-21</option><option value="ХТМ-22">ХТМ-22</option><option value="ХТМ-23">ХТМ-23</option><option value="ХТМ-24">ХТМ-24</option><option value="ХТМ-25">ХТМ-25</option><option value="ХТНР-11">ХТНР-11</option><option value="ХТНР-12">ХТНР-12</option><option value="ХТОР-11">ХТОР-11</option><option value="ХТПВ-11">ХТПВ-11</option><option value="ХТПК-11">ХТПК-11</option><option value="ХТТЕ-11">ХТТЕ-11</option><option value="ХТТС-11">ХТТС-11</option><option value="ХТХВ-11">ХТХВ-11</option><option value="ХТХД-11">ХТХД-11</option><option value="ЦБ-21">ЦБ-21</option><option value="ЦБПБ-11">ЦБПБ-11</option><option value="ШІ-11">ШІ-11</option><option value="ШІ-12">ШІ-12</option><option value="ШІ-13">ШІ-13</option><option value="ШІ-14">ШІ-14</option></select></div>        </div>
                </div>
            <div id="edit-semestrduration-wrapper" class="views-exposed-widget views-widget-filter-semestrduration">
                    <label for="edit-semestrduration">
              Половина семестру          </label>
                          <div class="views-widget">
            <div class="form-item form-item-semestrduration form-type-select form-group"><select class="form-control form-select" id="edit-semestrduration" name="semestrduration"><option value="All">- Усі -</option><option value="1" selected="selected">весь семестр</option><option value="2">перша половина</option><option value="3">друга половина</option></select></div>        </div>
                </div>
                      <div class="views-exposed-widget views-submit-button">
        <button class="ctools-use-ajax ctools-auto-submit-click js-hide btn btn-info form-submit" type="submit" id="edit-submit-students-schedule" name="" value="Застосувати">Застосувати</button>
      </div>
            <div class="views-exposed-widget views-reset-button">
          <button type="submit" id="edit-reset" name="op" value="Відмінити" class="btn btn-default form-submit">Відмінити</button>
        </div>
        </div>
  </div>
  </div></form>    </div>
    
    
        <div class="view-content">
        <div class="view-grouping">
    <div class="view-grouping-header">Пн</div>
    <div class="view-grouping-content">
        <h3>3</h3>
  <div class="stud_schedule">
  
  
  
  
          
            <div id="group_full" class="week_color"><div class="group_content">Безпека програм та даних<br>Сенів М.М., 217 I н.к., <br>&nbsp;Лекція<br><span style="background:#FFF; width:200px;"><a href="https://teams.microsoft.com/l/channel/19%3a4a74c2dd61e14312aff44ad20e42c6b2%40thread.tacv2/%25D0%2597%25D0%25B0%25D0%25B3%25D0%25B0%25D0%25BB%25D1%258C%25D0%25BD%25D0%25B5?groupId=3018bff4-3bd9-4fb4-9983-285733387658&amp;tenantId=7631cd62-5187-4e15-8b8e-ef653e366e7a" title="https://teams.microsoft.com/l/channel/19%3a4a74c2dd61e14312aff44ad20e42c6b2%40thread.tacv2/%25D0%2597%25D0%25B0%25D0%25B3%25D0%25B0%25D0%25BB%25D1%258C%25D0%25BD%25D0%25B5?groupId=3018bff4-3bd9-4fb4-9983-285733387658&amp;tenantId=7631cd62-5187-4e15-8b8e-ef653e366e7a">URL онлайн заняття</a></span></div></div>    
                
                
                
                
                
                
                
                
                
                
                
                
                
                  </div>
      <h3>4</h3>
  <div class="stud_schedule">
  
  
  
  
          
            <div id="group_full" class="week_color"><div class="group_content">Якість програмного забезпечення та тестування<br>Фоменко А.В., 321 I н.к., <br>&nbsp;Лекція<br><span style="background:#FFF; width:200px;"><a href="https://teams.microsoft.com/l/meetup-join/19:c844c87c202848a5b27c110f404ee396@thread.tacv2/1632129868490?context=%7B%22Tid%22:%227631cd62-5187-4e15-8b8e-ef653e366e7a%22,%22Oid%22:%2254c3ff66-3ec0-420e-afea-315ac14cda7c%22%7D" title="https://teams.microsoft.com/l/meetup-join/19:c844c87c202848a5b27c110f404ee396@thread.tacv2/1632129868490?context=%7B%22Tid%22:%227631cd62-5187-4e15-8b8e-ef653e366e7a%22,%22Oid%22:%2254c3ff66-3ec0-420e-afea-315ac14cda7c%22%7D">URL онлайн заняття</a></span></div></div>    
                
                
                
                
                
                
                
                
                
                
                
                
                
                  </div>
      <h3>6</h3>
  <div class="stud_schedule">
  
  
  
  
          
            <div id="group_full" class="week_color"><div class="group_content">Нейронні мережі<br>Романишин Ю.М., 411 V н.к., <br>&nbsp;Лекція<br><span style="background:#FFF; width:200px;"><a href="https://teams.microsoft.com/l/channel/19%3armOPOvOjiU39N785TxZTUH69ni59Pj5nP5XeMlKwnDU1%40thread.tacv2/%25D0%2597%25D0%25B0%25D0%25B3%25D0%25B0%25D0%25BB%25D1%258C%25D0%25BD%25D0%25B5?groupId=32d4cad8-1792-4a07-a7bd-f5893ec74e34&amp;tenantId=7631cd62-5187-4e15-8b8e-ef653e366e7a" title="https://teams.microsoft.com/l/channel/19%3armOPOvOjiU39N785TxZTUH69ni59Pj5nP5XeMlKwnDU1%40thread.tacv2/%25D0%2597%25D0%25B0%25D0%25B3%25D0%25B0%25D0%25BB%25D1%258C%25D0%25BD%25D0%25B5?groupId=32d4cad8-1792-4a07-a7bd-f5893ec74e34&amp;tenantId=7631cd62-5187-4e15-8b8e-ef653e366e7a">URL онлайн заняття</a></span></div></div>    
                
                
                
                
                
                
                
                
                
                
                
                
                
                  </div>
      </div>
  </div>
  <div class="view-grouping">
    <div class="view-grouping-header">Вт</div>
    <div class="view-grouping-content">
        <h3>1</h3>
  <div class="stud_schedule">
  
  
  
  
          
                
                
                
                
                
                
                
                
            <div id="sub_2_full" class="week_color"><div class="group_content">Безпека програм та даних<br>Сенів М.М., 810г V н.к., <br>,&nbsp;Лабораторна<br><span style="background:#FFF; width:200px;"><a href="https://us04web.zoom.us/j/78151401410?pwd=UERqTEZMT1FwQ2NRSlduN01VOXlkdz09" title="https://us04web.zoom.us/j/78151401410?pwd=UERqTEZMT1FwQ2NRSlduN01VOXlkdz09">URL онлайн заняття</a></span></div></div>    
                
                
                
                
                
                  </div>
      <h3>4</h3>
  <div class="stud_schedule">
  
  
  
  
          
            <div id="group_full" class="week_color"><div class="group_content">Декларативне програмування<br>Левус Є.В., 321 I н.к., <br>&nbsp;Лекція<br><span style="background:#FFF; width:200px;"><a href="https://us02web.zoom.us/j/3081432086?pwd=WEgxa3RsM21lQzZxRXgyWDdhS2JHZz09" title="https://us02web.zoom.us/j/3081432086?pwd=WEgxa3RsM21lQzZxRXgyWDdhS2JHZz09">URL онлайн заняття</a></span></div></div>    
                
                
                
                
                
                
                
                
                
                
                
                
                
                  </div>
      </div>
  </div>
  <div class="view-grouping">
    <div class="view-grouping-header">Ср</div>
    <div class="view-grouping-content">
        <h3>1</h3>
  <div class="stud_schedule">
  
  
  
  
          
            <div id="group_full" class="week_color"><div class="group_content">Архітектура і проектування програмного забезпечення<br>Фоменко А.В., 411 V н.к., <br>&nbsp;Лекція<br><span style="background:#FFF; width:200px;"><a href="https://teams.microsoft.com/l/meetup-join/19:c844c87c202848a5b27c110f404ee396@thread.tacv2/1632129868490?context=%7B%22Tid%22:%227631cd62-5187-4e15-8b8e-ef653e366e7a%22,%22Oid%22:%2254c3ff66-3ec0-420e-afea-315ac14cda7c%22%7D" title="https://teams.microsoft.com/l/meetup-join/19:c844c87c202848a5b27c110f404ee396@thread.tacv2/1632129868490?context=%7B%22Tid%22:%227631cd62-5187-4e15-8b8e-ef653e366e7a%22,%22Oid%22:%2254c3ff66-3ec0-420e-afea-315ac14cda7c%22%7D">URL онлайн заняття</a></span></div></div>    
                
                
                
                
                
                
                
                
                
                
                
                
                
                  </div>
      </div>
  </div>
  <div class="view-grouping">
    <div class="view-grouping-header">Чт</div>
    <div class="view-grouping-content">
        <h3>2</h3>
  <div class="stud_schedule">
  
  
  
  
          
                
                
                
                
                
            <div id="sub_1_full" class="week_color"><div class="group_content">Безпека програм та даних<br>Сенів М.М., <br>&nbsp;Лабораторна<br><span style="background:#FFF; width:200px;"><a href="https://us04web.zoom.us/j/78151401410?pwd=UERqTEZMT1FwQ2NRSlduN01VOXlkdz09" title="https://us04web.zoom.us/j/78151401410?pwd=UERqTEZMT1FwQ2NRSlduN01VOXlkdz09">URL онлайн заняття</a></span></div></div>    
                
                
                
                
                
                
                
                
                  </div>
      <h3>3</h3>
  <div class="stud_schedule">
  
  
  
  
          
                
                
                
            <div id="sub_1_chys"><div class="group_content">Архітектура і проектування програмного забезпечення<br>Фоменко А.В., 410 V н.к., <br>&nbsp;Лабораторна<br><span style="background:#FFF; width:200px;"><a href="https://teams.microsoft.com/l/meetup-join/19:c844c87c202848a5b27c110f404ee396@thread.tacv2/1632129868490?context=%7B%22Tid%22:%227631cd62-5187-4e15-8b8e-ef653e366e7a%22,%22Oid%22:%2254c3ff66-3ec0-420e-afea-315ac14cda7c%22%7D" title="https://teams.microsoft.com/l/meetup-join/19:c844c87c202848a5b27c110f404ee396@thread.tacv2/1632129868490?context=%7B%22Tid%22:%227631cd62-5187-4e15-8b8e-ef653e366e7a%22,%22Oid%22:%2254c3ff66-3ec0-420e-afea-315ac14cda7c%22%7D">URL онлайн заняття</a></span></div></div>    
                
                
                
                
                
                
                
                
                
                
                        
                
                
                
                
                
                
                
            <div id="sub_2_znam" class="week_color"><div class="group_content">Архітектура і проектування програмного забезпечення<br>Фоменко А.В., 410 V н.к., <br>,&nbsp;Лабораторна<br><span style="background:#FFF; width:200px;"><a href="https://teams.microsoft.com/l/meetup-join/19:c844c87c202848a5b27c110f404ee396@thread.tacv2/1632129868490?context=%7B%22Tid%22:%227631cd62-5187-4e15-8b8e-ef653e366e7a%22,%22Oid%22:%2254c3ff66-3ec0-420e-afea-315ac14cda7c%22%7D" title="https://teams.microsoft.com/l/meetup-join/19:c844c87c202848a5b27c110f404ee396@thread.tacv2/1632129868490?context=%7B%22Tid%22:%227631cd62-5187-4e15-8b8e-ef653e366e7a%22,%22Oid%22:%2254c3ff66-3ec0-420e-afea-315ac14cda7c%22%7D">URL онлайн заняття</a></span></div></div>    
                
                
                
                
                
                
                  </div>
      <h3>4</h3>
  <div class="stud_schedule">
  
  
  
  
          
                
                
                
                
                
            <div id="sub_1_full" class="week_color"><div class="group_content">Якість програмного забезпечення та тестування<br>Ваврук І.Є., 808 V н.к., <br>&nbsp;Лабораторна<br><span style="background:#FFF; width:200px;"><a href="https://us04web.zoom.us/j/4033821085?pwd=OXBKNlVlZlBPbnB0ek91dVYya2crdz09" title="https://us04web.zoom.us/j/4033821085?pwd=OXBKNlVlZlBPbnB0ek91dVYya2crdz09">URL онлайн заняття</a></span></div></div>    
                
                
                
                
                
                
                
                
                  </div>
      <h3>5</h3>
  <div class="stud_schedule">
  
  
  
  
          
                
                
                
                
                
                
                
                
            <div id="sub_2_full" class="week_color"><div class="group_content">Якість програмного забезпечення та тестування<br>Ваврук І.Є., 303 XXIX н.к., <br>,&nbsp;Лабораторна<br><span style="background:#FFF; width:200px;"><a href="https://us04web.zoom.us/j/4033821085?pwd=OXBKNlVlZlBPbnB0ek91dVYya2crdz09" title="https://us04web.zoom.us/j/4033821085?pwd=OXBKNlVlZlBPbnB0ek91dVYya2crdz09">URL онлайн заняття</a></span></div></div>    
                
                
                
                
                
                        
                
                
                
                
                
            <div id="sub_1_full" class="week_color"><div class="group_content">Декларативне програмування<br>Микуляк А.В., 302 XXIX н.к., <br>&nbsp;Лабораторна<br></div></div>    
                
                
                
                
                
                
                
                
                  </div>
      <h3>6</h3>
  <div class="stud_schedule">
  
  
  
  
          
                
                
                
                
                
                
                
                
            <div id="sub_2_full" class="week_color"><div class="group_content">Декларативне програмування<br>Микуляк А.В., 302 XXIX н.к., <br>,&nbsp;Лабораторна<br></div></div>    
                
                
                
                
                
                  </div>
      </div>
  </div>
  <div class="view-grouping">
    <div class="view-grouping-header">Пт</div>
    <div class="view-grouping-content">
        <h3>1</h3>
  <div class="stud_schedule">
  
  
  
  
          
                
            <div id="group_chys"><div class="group_content">Менеджмент проектів з розробки програмного забезпечення<br>Басараб М.Б., <br>&nbsp;Лекція<br></div></div>    
                
                
                
                
                
                
                
                
                
                
                
                
                  </div>
      <h3>2</h3>
  <div class="stud_schedule">
  
  
  
  
          
            <div id="group_full" class="week_color"><div class="group_content">Менеджмент проектів з розробки програмного забезпечення<br>Басараб М.Б., <br>&nbsp;Практична<br></div></div>    
                
                
                
                
                
                
                
                
                
                
                
                
                
                  </div>
      <h3>5</h3>
  <div class="stud_schedule">
  
  
  
  
          
            <div id="group_full" class="week_color"><div class="group_content">Нейронні мережі<br>Романишин Ю.М., 303 XXIX н.к., <br>&nbsp;Лабораторна<br></div></div>    
                
                
                
                
                
                
                
                
                
                
                
                
                
                  </div>
      </div>
  </div>
      </div>
    
    
    
    
        <div class="view-footer">
        <p><strong>У розкладі можливі зміни.</strong></p>
      </div>
    
    
  </div>
  </section>
    </div>
      </section>
  
            <aside class="col-sm-3" role="complementary">
            <div class="region region-sidebar-second">
      <section id="block-user-login" class="block block-user clearfix">
  
          <h2 class="block-title">Вхід</h2>
      
    <form action="/students_schedule?destination=students_schedule%3Fdepartmentparent_abbrname_selective%3DAll%26studygroup_abbrname_selective%3D%25D0%259F%25D0%2597-46%26semestrduration%3D1" method="post" id="user-login-form" accept-charset="UTF-8"><div><div class="form-item form-item-name form-type-textfield form-group"> <label class="control-label" for="edit-name">Ім’я користувача <span class="form-required" title="Це поле - обов’язкове.">*</span></label>
  <input class="form-control form-text required" type="text" id="edit-name" name="name" value="" size="15" maxlength="60"></div><div class="form-item form-item-pass form-type-password form-group"> <label class="control-label" for="edit-pass">Пароль <span class="form-required" title="Це поле - обов’язкове.">*</span></label>
  <input class="form-control form-text required" type="password" id="edit-pass" name="pass" size="15" maxlength="128"></div><input type="hidden" name="form_build_id" value="form-KpZ3xeXH8OTyhRqVr4f5OK97OUAo11KNWU-8sGJoUz8">
  <input type="hidden" name="form_id" value="user_login_block">
  <div class="form-actions form-wrapper form-group" id="edit-actions"><button type="submit" id="edit-submit" name="op" value="Вхід" class="btn btn-primary form-submit">Вхід</button>
  </div></div></form>
  </section>
    </div>
        </aside>  <!-- /#sidebar-second -->
      
    </div>
  </div>
  
    <footer class="footer container">
        <div class="region region-footer">
      <section id="block-panels-mini-footer-navigation" class="block block-panels-mini clearfix">
  
        
    
  <div class="panel-display panel-3col-33 clearfix" id="mini-panel-footer_navigation">
    <div class="panel-panel panel-col-first">
      <div class="inside"><div class="panel-pane pane-custom pane-1">
    
          <h2 class="pane-title">
        Ресурси    </h2>
      
    
    <div class="pane-content">
      <p><a href="/node/874">Зразки заяв студентів</a><br><a href="http://vns.lpnu.ua">Віртуальне навчальне середовище</a><br><a href="http://library.lp.edu.ua">Науково-технічна бібліотека</a><br><a href="http://ena.lp.edu.ua">Електронний науковий архів</a><br><a href="http://vlp.com.ua">Видавництво Львівської політехніки</a></p>
    </div>
  
    
    </div>
  </div>
    </div>
  
    <div class="panel-panel panel-col">
      <div class="inside"><div class="panel-pane pane-custom pane-2">
    
          <h2 class="pane-title">
        Сервіси    </h2>
      
    
    <div class="pane-content">
      <div><a href="https://student.lpnu.ua/node/905">Путівник по ІС для першокурсника</a></div>
  <div><a href="http://mail.lpnu.ua">Електронна пошта LPNU</a></div>
  <div><a href="http://calendar.lpnu.ua">Google календар LPNU</a></div>
  <div><a href="http://docs.lpnu.ua">Google диск LPNU</a> <a href="https://plus.google.com">Google+</a>&nbsp;</div>
    </div>
  
    
    </div>
  </div>
    </div>
  
    <div class="panel-panel panel-col-last">
      <div class="inside"><div class="panel-pane pane-custom pane-3">
    
          <h2 class="pane-title">
        Університет    </h2>
      
    
    <div class="pane-content">
      <p><a href="http://lpnu.ua">Офіційний сайт Львівської політехніки</a><br><a href="http://wiki.lp.edu.ua">Енциклопедія Львівської політехніки</a><br><a href="http://vstup.lpnu.ua">Сайт для вступників</a><br><a href="http://youtube.lpnu.ua">YouTube канал Львівської політехніки</a></p>
    </div>
  
    
    </div>
  </div>
    </div>
  </div>
  
  </section>
    </div>
    </footer>
    <script src="http://student.lpnu.ua/sites/default/files/js/js_MRdvkC2u4oGsp5wVxBG1pGV5NrCPW3mssHxIn6G9tGE.js"></script>
  
  
  </body></html>`;

    global.fetch = jest.fn(() =>
        Promise.resolve({
            text: () => Promise.resolve(text),
            ok: true,
            json: () => Promise.resolve({}),
        })
    );
});

test('timetable', async () => {
    const timetable = await getTimetable();
    expect(timetable.length).toBeGreaterThan(0);
    expect(timetable[0].subject).toBeDefined();
    expect(timetable[0].lecturer).toBeDefined();
    expect(timetable[0].location).toBeDefined();
    expect(timetable[0].day).toBeDefined();
    expect(timetable[0].number).toBeDefined();
});

test('groups', async () => {
    const groups = await getGroups();
    expect(groups.length).toBeGreaterThan(0);
});

test('institutes', async () => {
    const institutes = await getInstitutes();
    expect(institutes.length).toBeGreaterThan(0);
});

test('day to number', () => {
    expect(dayToNumber('пн')).toBe(1);
    expect(dayToNumber('вт')).toBe(2);
    expect(dayToNumber('ср')).toBe(3);
    expect(dayToNumber('чт')).toBe(4);
    expect(dayToNumber('пт')).toBe(5);
    expect(dayToNumber('сб')).toBe(6);
    expect(dayToNumber('нд')).toBe(7);
    expect(dayToNumber('понеділок')).toBe(-1);
});
