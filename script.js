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
        // replace ??? geshi adds an NBSP on each empty line. This is an issue
        // with python, perl... when you want to run copied code, you get a
        // syntax error "unexpected \xC2 character" or similar... So remove this
        // crap. And yes it could remove a legitimate NBSP ; chances are low though.
        const text = event.target.parentElement.textContent.replace(/^\u00A0$/gm, "");
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

