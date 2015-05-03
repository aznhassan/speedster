<!-- !DOCTYPE is an instruction to the browser about what version of HTML
the page is written in-->
<!DOCTYPE html>

<html>
  <head>
    <meta charset="utf-8">
    <title id="titletag">${title}</title>
    <link rel="stylesheet" href="../../css/note.css">
    
    <link href='http://fonts.googleapis.com/css?family=Playfair+Display:400,700,400italic,700italic|Bitter:400,700,400italic|Open+Sans:400italic,700italic,400,700|Merriweather:400,400italic,700,700italic' rel='stylesheet' type='text/css'>
    <link href='http://fonts.googleapis.com/css?family=Droid+Sans+Mono' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" href="${customCss}">
    <link rel="shortcut icon" href="../../css/favicon.ico" />
  </head>
  
  <body>
    <script src="../../js/jquery-2.1.1.js"></script>
    <script src="../../js/note.js"></script>
    <div id="alertbox">
      <p id="alerttext">Warning: unsaved changes!</p>
    </div>
    
    <!-- It's important to not have any extra space inside the div, else formatting will be bad :( -->
    <div contenteditable="true" id="noteArea">${note}</div>
  
  </body>

</html>
