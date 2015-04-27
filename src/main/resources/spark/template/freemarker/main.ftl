<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>${title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- In real-world webapps, css is usually minified and
         concatenated. Here, separate normalize from our code, and
         avoid minification for clarity. -->
    <link rel="stylesheet" href="css/normalize.css">
    <link rel="stylesheet" href="css/html5bp.css">
    <link rel="stylesheet" href="//code.jquery.com/ui/1.11.3/themes/smoothness/jquery-ui.css">

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap-theme.min.css">
    <!-- <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap-theme.min.css"> -->
    <link rel="stylesheet" href="../css/main.css">
    <link rel="stylesheet" href="../css/editing.css">
    <link href='http://fonts.googleapis.com/css?family=Bitter:400,700|Open+Sans:400italic,400,300,600,700,800' rel='stylesheet' type='text/css'>

  </head>
  <body>
     <h1>MMTH'S NOTES</h1><br>

		<div class="data" style="display:none">${data}</div>

     <!-- Again, we're serving up the unminified source for clarity. -->
     <script src="/js/jquery-2.1.1.js"></script>
     <script src="/js/main.js"></script>
     <!-- // <script src="/js/editing.js"></script> -->
     <script src="//code.jquery.com/ui/1.11.3/jquery-ui.js"></script>
     <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>

     <div class="example_overlay" id="overlay"></div>
     <div class="example_content">
        <span id="rule-header">STYLE RULES</span><span class="circle close-button">X</span>

     </div>
     <div id="main-div"></div><br>
     <div class="button_div">
        <div id="add_section_button">NEW SECTION</div>
        <div id="edit_style_button">EDIT STYLES</div>
        <div id="save-button">SAVE CHANGES</div>

     </div><br><br><br><br><br><br><br><br><br>
     </body>
  <!-- See http://html5boilerplate.com/ for a good place to start
       dealing with real world issues like old browsers.  -->
</html>
