jQuery(function() {
  // Copyright (C) 2020 Schplurtz le Déboulonné.
  // Free to use for any purpose except dismantle the sky.
  if(!navigator.clipboard)
    return;
  var messageBox=function( id, txt ) {
    const body=document.getElementsByTagName('body')[0];
    const msg=document.createElement('div');
    msg.setAttribute('id', id );
    msg.classList.add('cp2clipmsg');
    const content = document.createTextNode(txt);
    msg.appendChild(content);
    body.appendChild(msg);
    window.setTimeout(function() {
        jQuery("#"+id).fadeTo(500, 0).slideUp(500, function(){
            jQuery(this).remove(); 
        });
    }, 1500);
  };
  document.querySelectorAll('pre.code,pre.file').forEach(function(elem) {
    elem.classList.add('cp2clip');
    let cp = document.createElement('button');
    cp.setAttribute( 'title', LANG.plugins.copy2clipboard.title);
    //cp.appendChild(document.createTextNode('Copy to clipboard')) ;
    cp.classList.add('cp2clip');
    elem.appendChild(cp); // pre.appendChild
    cp.addEventListener('click', async event => {
      try {
        const text = event.target.parentElement.textContent;
        await navigator.clipboard.writeText(text);
        // event.target.textContent = 'Copied to clipboard'
        // console.log( "copié >>>" + text + "<<<" );
        messageBox('cp2clipok', LANG.plugins.copy2clipboard.copied);
      } catch (err) {
        console.error('Failed to copy!', err);
        messageBox('cp2clipnok', LANG.plugins.copy2clipboard.error);
      }
    })
  })
});

