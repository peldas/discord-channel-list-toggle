// ==UserScript==
// @name        Discord Channel List Toggle
// @namespace   Violentmonkey Scripts
// @match       *://discord.com/channels/*
// @grant       none
// @version     1.0
// @author      peldas
// @description 2024/11/24 11:07:00
// @inject-into auto
// ==/UserScript==
var svg;
function toggleMessageList() {
  console.log('trying to toggle...;')
  messageList = document.querySelector('div[class^="sidebar_"]');

  if (messageList.style.display === 'none') {
    messageList.style.display = 'revert';
    svg.style.transform = 'rotate(90deg)';
  } else {
    messageList.style.display = 'none';
    svg.style.transform = 'rotate(270deg)';
  }
}

function injectSVG() {
  var div = document.createElement('div');
  div.onclick = function() { toggleMessageList(); };
  div.setAttribute('style', 'display:block;padding:5px 5px 0px 5px;cursor:pointer');
  div.setAttribute('role', 'messagelisthide');

  svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('height', '18');
  svg.setAttribute('width', '18');
  svg.setAttribute('style', 'z-index: 2; transform: rotate(90deg); position: relative; transition: transform .2s ease-out,stroke-dasharray.2s ease-out;')

  var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.setAttribute('fill', 'none');
  g.setAttribute('fill-rule', 'evenodd');

  var pathStyle = 'stroke-width: 2px; stroke-dasharray: 7; stroke-dashoffset: 1; transition: stroke-dasharray.2s ease;'
  var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M0 0h18v18H0');
  path.setAttribute('style', pathStyle);
  var path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path2.setAttribute('stroke', 'currentColor');
  path2.setAttribute('d', 'M4.5 4.5l9 9');
  path2.setAttribute('stroke-linecap', 'round');
  path2.setAttribute('style', pathStyle);
  var path3 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path3.setAttribute('stroke', 'currentColor');
  path3.setAttribute('d', 'M13.5 4.5l-9 9');
  path3.setAttribute('stroke-linecap', 'round');
  path3.setAttribute('style', pathStyle);

  g.appendChild(path);
  g.appendChild(path2);
  g.appendChild(path3);
  svg.appendChild(g);
  div.appendChild(svg);

  var headerDiv = document.querySelector('div[class^="upperContainer_"]>div[class^="children_"]')
  headerDiv.insertBefore(div, headerDiv.children[0]);
}

var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    var listHideButton = document.querySelector('div[role="messagelisthide"]');

    if (mutation.type !== 'childList') // only attempt to inject if the page has changed
      return;

    if (listHideButton) // no need to inject if already injected
      return;

    injectSVG();
  });
});

observer.observe(document.body, { subtree: true, childList: true });