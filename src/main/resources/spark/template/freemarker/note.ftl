<!-- !DOCTYPE is an instruction to the browser about what version of HTML
the page is written in-->
<!DOCTYPE html>

<html>
  <head>
    <meta charset="utf-8">
    <title>${title}</title>
    <link rel="stylesheet" href="../../css/note.css">
    
    <link href='http://fonts.googleapis.com/css?family=Bitter:400,700|Open+Sans:400italic,400,300,600,700,800' rel='stylesheet' type='text/css'>
    <link href='http://fonts.googleapis.com/css?family=Playfair+Display:400,700italic,900italic' rel='stylesheet' type='text/css'>
    <link href='http://fonts.googleapis.com/css?family=Droid+Sans+Mono' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" href="${customCss}">
  </head>
  
  <body>
    <script src="../../js/jquery-2.1.1.js"></script>
    <script src="../../js/note.js"></script>
    
    <div contenteditable="true" id="noteArea">
    	${note}
    </div>
    
  
  </body>

</html>
