<!DOCTYPE html>
  <head>
    <title>Edit Styles</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- In real-world webapps, css is usually minified and
         concatenated. Here, separate normalize from our code, and
         avoid minification for clarity. -->
    <link rel="stylesheet" href="normalize.css">
    <!-- <link rel="stylesheet" href="css/html5bp.css"> -->
    <link rel="stylesheet" href="../css/editing.css">
  </head>
  <body>

     <!-- Again, we're serving up the unminified source for clarity. -->
     <script src="jquery-2.1.1.js"></script>
     <script src="/js/editing.js"></script>

     <h1>STYLE RULES</h1>

     <h2>Styles for "Note:" header</h2>
     <div class="style-toolbar">
        <div class="bold-italic-underline-toolbar">
            <div class="boldButton" value="off"><span>B</span></div>
            <div class="italicButton" value = "off"><span>i</span></div>
            <select class="font-family">
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Sans Serif">Sans Serif</option>
              <option value="Times New Roman">Times New Roman</option>
            </select>
            <input type="checkbox" value="text-after" class="text-after-style"></input><span>  Style for text after</span>
        </div>
     </div>
     <div class="main-text-style-toolbar">
        <div class="bold-italic-underline-toolbar">
            <div class="boldButton" value="off"><span>B</span></div>
            <div class="italicButton" value = "off"><span>i</span></div>
            <select class="font-family">
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Sans Serif">Sans Serif</option>
              <option value="Times New Roman">Times New Roman</option>
            </select>
        </div>
     </div>
     <div id="save-button">Save</div>
    </body>
</html>
