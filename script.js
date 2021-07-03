/*
 * Copy2clipboard - copy <pre> text to clipboard.
 * Copyright (C) 2020, 2021 Schplurtz le Déboulonné <Schplurtz@laposte.net>
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the CECILL 2.1 free license. See files
 * LICENSE and LICENSE-fr for the details in the distribution directory or
 * http://cecill.info/licences/Licence_CeCILL_V2.1-en.html
 */
jQuery(function() {
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
  var iswin = (navigator.appVersion.indexOf("Win") != -1);
  var response=async function(event) {
    try {
      let text='';
      // when line numbers are on, geshi uses <li> tag for each line
      let lis=event.target.parentElement.getElementsByTagName('li');
      if( lis.length ) {
        for( let li of lis ) {
          text += li.textContent + '\n';
        }
      }
      // no line numbers, whole text is directely in <pre> tag
      else {
        text = event.target.parentElement.textContent;
        text = text.replace( /\r\n/g, '\n' ); // can happen if page files are prepared on win and dropped in doku tree...
      }
      // Why replace \u00A0 ??? geshi adds an NBSP on each empty line. This is an issue
      // with python, perl... when you want to run copied code, you get a
      // syntax error "unexpected \xC2 character" or similar... So remove this
      // crap. And yes it could remove a legitimate NBSP ; chances are low though.
      text = text.replace(/^\u00A0$/gm, "");
      // if you paste \n separated lines with right button in powershell, the lines are
      // fed in reverse order ! Most stupidly funny bug by MS ever. Anyway, just make sure
      // we use \r\n separated lines under windows. It just makes sense.
      // see powershell bugs https://github.com/PowerShell/PowerShell/issues/3816 and
      // https://github.com/PowerShell/PSReadLine/issues/496 or
      // https://github.com/PowerShell/PSReadLine/issues/579 , they're all the same...
      if( iswin ) {
        text=text.replace(/\n/g, '\r\n' );
      }
      await navigator.clipboard.writeText(text);
      // console.log( "copié >>>" + text + "<<<" );
      messageBox('cp2clipok', LANG.plugins.copy2clipboard.copied);
    } catch (err) {
      // console.error('Failed to copy!', err);
      messageBox('cp2clipnok', LANG.plugins.copy2clipboard.error);
    }
  };

  document.querySelectorAll('pre.code,pre.file').forEach(function(elem) {
    elem.classList.add('cp2clip');
    let cp = document.createElement('button');
    cp.setAttribute( 'title', LANG.plugins.copy2clipboard.title);
    //cp.appendChild(document.createTextNode('Copy to clipboard')) ;
    cp.classList.add('cp2clip');
    elem.appendChild(cp); // pre.appendChild
    cp.addEventListener('click', response)
  })
});

