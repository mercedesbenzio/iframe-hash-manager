window.onload = function () {
  var iFrames = document.getElementsByTagName('iframe');

  for ( var k = 0; k < iFrames.length; k++ ) {
    (function(iframe){
      var doc = null;
          /*displayMessage = function (e) {
            console.log('Got a message from iFrame: ', e.data);
          }*/

      /*if (window.addEventListener) {
        // For standards-compliant web browsers
        window.addEventListener("message", displayMessage, false);
      } else {
        window.attachEvent("onmessage", displayMessage);
      }*/

      if(iframe.contentDocument) doc = iframe.contentDocument;
      else if(iframe.contentWindow) doc = iframe.contentWindow.document;
      else if(iframe.document) doc = iframe.document;

      if(doc == null) throw "Document not initialized";

      doc.open();
      doc.write(document.getElementById( iframe.id + '-tpl' ).innerHTML);
      doc.close();

      /*setTimeout(function(){
        console.log('Sent message to iFrame');
        iframe.contentWindow.postMessage('Hi iFrame!', '*');
      }, 5 * 1000 );*/
    })(iFrames[k]);
  }

  iFrameResize({
    checkOrigin: false,
    heightCalculationMethod: 'lowestElement'
  }, 'iframe');
}
