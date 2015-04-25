<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>${title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- In real-world webapps, css is usually minified and
         concatenated. Here, separate normalize from our code, and
         avoid minification for clarity. -->
    <link rel="stylesheet" href="../css/normalize.css">
    <link rel="stylesheet" href="../css/html5bp.css">
    <link rel="stylesheet" href="//code.jquery.com/ui/1.11.3/themes/smoothness/jquery-ui.css">
    <!-- <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap-theme.min.css"> -->
    <link rel="stylesheet" href="../css/flashcard.css">
    <link href='http://fonts.googleapis.com/css?family=Bitter:400,700|Open+Sans:400italic,400,300,600,700,800' rel='stylesheet' type='text/css'>

  </head>
  <body>

     <!-- Again, we're serving up the unminified source for clarity. -->
     <script src="/js/jquery-2.1.1.js"></script>
     <script src="/js/flashcard.js"></script>
     <!-- // <script src="/js/editing.js"></script> -->
     <script src="//code.jquery.com/ui/1.11.3/jquery-ui.js"></script>
     <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>

     <div class="flashcard-container">
         <div class="flashcard_div_front"></div>
         <div class="flashcard_div_back"></div>
     </div><br>
    

     <div id="button-div">
        <div id="next-button">NEXT CARD</div>
        <div id="correct-button">CORRECT ANSWER</div>
        <div id="wrong-button">WRONG ANSWER</div>
     </div>

    <div id="session_div">${session_id}</div>
  </body>
  <!-- See http://html5boilerplate.com/ for a good place to start
       dealing with real world issues like old browsers.  -->
</html>