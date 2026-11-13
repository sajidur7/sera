/* Sera docs runtime: icons, helpers, registry, router, live stages, delegated behaviours, theme and sound. */
(function(){
'use strict';
const T = window.T = {pages:[], by:{}, groups:[], live:[], sound:false};
const $ = (s,r=document)=>r.querySelector(s), $$ = (s,r=document)=>[...r.querySelectorAll(s)];
T.$=$; T.$$=$$;

/* ---------- icons (24px grid, 1.8 stroke) ---------- */
const P=d=>`<path d="${d}"/>`, C=(x,y,r)=>`<circle cx="${x}" cy="${y}" r="${r}"/>`, R=(x,y,w,h,r=2)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/>`;
const ICONS = T.icons = {
  plus:P('M12 5v14M5 12h14'), minus:P('M5 12h14'), x:P('M18 6 6 18M6 6l12 12'), check:P('M20 6 9 17l-5-5'),
  'chev-down':P('m6 9 6 6 6-6'), 'chev-up':P('m18 15-6-6-6 6'), 'chev-right':P('m9 18 6-6-6-6'), 'chev-left':P('m15 18-6-6 6-6'), chevs:P('m7 15 5 5 5-5M7 9l5-5 5 5'),
  'arrow-up':P('M12 19V5M5 12l7-7 7 7'), 'arrow-down':P('M12 5v14M19 12l-7 7-7-7'), 'arrow-right':P('M5 12h14M12 5l7 7-7 7'), 'arrow-left':P('M19 12H5M12 19l-7-7 7-7'), 'arrow-ur':P('M7 17 17 7M7 7h10v10'),
  search:C(11,11,7)+P('m20 20-3.5-3.5'), copy:R(9,9,12,12,2.5)+P('M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'),
  more:C(5,12,1)+C(12,12,1)+C(19,12,1), 'more-v':C(12,5,1)+C(12,12,1)+C(12,19,1), grip:C(9,6,1)+C(9,12,1)+C(9,18,1)+C(15,6,1)+C(15,12,1)+C(15,18,1),
  sliders:P('M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6'),
  home:P('m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z')+P('M9 22V12h6v10'), user:C(12,8,4)+P('M4 21a8 8 0 0 1 16 0'),
  users:C(9,8,4)+P('M1 21a8 8 0 0 1 16 0M16 4a4 4 0 0 1 0 8M23 21a8 8 0 0 0-5-7.4'),
  mail:R(2,4,20,16,2.5)+P('m22 7-10 6L2 7'), bell:P('M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0'),
  calendar:R(3,4,18,18,2.5)+P('M16 2v4M8 2v4M3 10h18'), chart:P('M3 3v18h18M7 16v-4M12 16V8M17 16v-7'), trend:P('m22 7-8.5 8.5-5-5L2 17M16 7h6v6'),
  folder:P('M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.7-.9L9.6 3.9A2 2 0 0 0 7.9 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z'),
  file:P('M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6'),
  trash:P('M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'), edit:P('M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z'),
  link:P('M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'),
  info:C(12,12,10)+P('M12 16v-4M12 8h.01'), alert:P('m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3ZM12 9v4M12 17h.01'),
  'check-c':C(12,12,10)+P('m9 12 2 2 4-4'), 'x-c':C(12,12,10)+P('m15 9-6 6M9 9l6 6'), clock:C(12,12,10)+P('M12 6v6l4 2'), circle:C(12,12,9),
  dashed:P('M10.1 2.2a10 10 0 0 1 3.8 0M17.6 3.7a10 10 0 0 1 2.7 2.7M21.8 10.1a10 10 0 0 1 0 3.8M20.3 17.6a10 10 0 0 1-2.7 2.7M13.9 21.8a10 10 0 0 1-3.8 0M6.4 20.3a10 10 0 0 1-2.7-2.7M2.2 13.9a10 10 0 0 1 0-3.8M3.7 6.4a10 10 0 0 1 2.7-2.7'),
  star:P('M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z'),
  filter:P('M22 3H2l8 9.46V19l4 2v-8.54z'), download:P('M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3'), upload:P('M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12'),
  moon:P('M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z'), sun:C(12,12,4)+P('M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41'),
  vol:P('M11 5 6 9H2v6h4l5 4zM15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14'), 'vol-x':P('M11 5 6 9H2v6h4l5 4zM22 9l-6 6M16 9l6 6'),
  menu:P('M4 6h16M4 12h16M4 18h16'), grid:R(3,3,7,7,1.5)+R(14,3,7,7,1.5)+R(14,14,7,7,1.5)+R(3,14,7,7,1.5), list:P('M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01'),
  layers:P('m12 2 10 5-10 5L2 7zM2 17l10 5 10-5M2 12l10 5 10-5'),
  box:P('M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16ZM3.3 7l8.7 5 8.7-5M12 22V12'),
  zap:P('M13 2 3 14h9l-1 8 10-12h-9z'), flow:R(3,3,8,8,2)+R(13,13,8,8,2)+P('M7 11v4a2 2 0 0 0 2 2h4'),
  bot:R(3,11,18,10,2.5)+C(12,5,2)+P('M12 7v4M8 16h.01M16 16h.01'), cpu:R(4,4,16,16,2.5)+R(9,9,6,6,1)+P('M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2'),
  msg:P('M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'), mic:R(9,2,6,12,3)+P('M19 10v2a7 7 0 0 1-14 0v-2M12 19v3'),
  clip:P('m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48'),
  at:C(12,12,4)+P('M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8'), globe:C(12,12,10)+P('M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'),
  refresh:P('M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5'), thumb:P('M7 10v12M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z'),
  eye:P('M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z')+C(12,12,3), lock:R(3,11,18,11,2.5)+P('M7 11V7a5 5 0 0 1 10 0v4'),
  key:C(7.5,15.5,5.5)+P('m21 2-9.6 9.6M15.5 7.5l3 3L22 7l-3-3'), card:R(2,5,20,14,2.5)+P('M2 10h20'),
  tag:P('M12 2H2v10l9.29 9.29a1 1 0 0 0 1.41 0l8.59-8.59a1 1 0 0 0 0-1.41zM7 7h.01'), hash:P('M4 9h16M4 15h16M10 3 8 21M16 3l-2 18'),
  cmd:P('M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3'), shift:P('M9 18v-6H5l7-7 7 7h-4v6z'), opt:P('M3 3h6l6 18h6M14 3h7'),
  ctrl:P('m6 12 6-6 6 6'), enter:P('M9 10l-5 5 5 5M20 4v7a4 4 0 0 1-4 4H4'), back:P('M20 5H9l-7 7 7 7h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2ZM18 9l-6 6M12 9l6 6'),
  tab:P('M21 4v16M3 12h14M13 8l4 4-4 4'), space:P('M4 10v4h16v-4'), caps:P('M9 20h6M9 16v-4H5l7-8 7 8h-4v4z'),
  play:P('m7 4 13 8-13 8z'), pause:P('M7 4h3v16H7zM14 4h3v16h-3z'), image:R(3,3,18,18,2.5)+C(9,9,2)+P('m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21'),
  max:P('M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M16 21h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3'), side:R(3,3,18,18,2.5)+P('M9 3v18'), cols:R(3,3,18,18,2.5)+P('M9 3v18M15 3v18'),
  bold:P('M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8'), italic:P('M19 4h-9M14 20H5M15 4 9 20'), under:P('M6 4v6a6 6 0 0 0 12 0V4M4 20h16'),
  quote:P('M17 6H3M21 12H8M21 18H8M3 12v6'), code:P('m16 18 6-6-6-6M8 6l-6 6 6 6'), term:P('m4 17 6-6-6-6M12 19h8'),
  db:'<ellipse cx="12" cy="5" rx="9" ry="3"/>'+P('M3 5v14a9 3 0 0 0 18 0V5M3 12a9 3 0 0 0 18 0'), branch:P('M6 3v12')+C(18,6,3)+C(6,18,3)+P('M18 9a9 9 0 0 1-9 9'),
  pin:P('M12 17v5M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z'),
  building:R(4,2,16,20,2.5)+P('M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01'),
  dollar:P('M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'), target:C(12,12,10)+C(12,12,6)+C(12,12,2),
  inbox:P('M22 12h-6l-2 3h-4l-2-3H2M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z'),
  archive:R(2,3,20,5,1.5)+P('M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8M10 12h4'), reply:P('M9 17 4 12l5-5M20 18v-2a4 4 0 0 0-4-4H4'),
  logout:P('M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9'), book:P('M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20'),
  palette:P('M12 2a10 10 0 0 0 0 20c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2h2.3A5.6 5.6 0 0 0 22 9.8C22 5.5 17.5 2 12 2z')+C(7.5,10.5,1)+C(12,7,1)+C(16.5,10.5,1),
  type:P('M4 7V4h16v3M9 20h6M12 4v16'), ext:P('M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'),
  flag:P('M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7'),
  shield:P('M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z'),
  map:P('M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z')+C(12,10,3),
  phone:P('M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z'),
  bookmark:P('m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z'), send:P('M22 2 11 13M22 2l-7 20-4-9-9-4z'), undo:P('M3 7v6h6M21 17a9 9 0 0 0-15-6.7L3 13'),
  web:R(2,4,20,16,2.5)+P('M2 9h20M6 6.5h.01M9 6.5h.01'), sheet:R(3,3,18,18,2.5)+P('M3 9h18M3 15h18M9 3v18'), pulse:P('M22 12h-4l-3 9L9 3l-3 9H2'),
  bolt:P('M4 14 14 3l-2 8h8L10 21l2-7z'), gift:R(3,8,18,4,1)+P('M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5'),
  move:P('M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20'), split:R(3,3,18,18,2.5)+P('M12 3v18'),
  eye2:P('M9.88 9.88a3 3 0 1 0 4.24 4.24M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61A13.53 13.53 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61M2 2l20 20'),
  rows:R(3,3,18,18,2.5)+P('M3 12h18'), compass:C(12,12,10)+P('m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36z'), layout:R(3,3,18,18,2.5)+P('M3 9h18M9 21V9'),
};
const I = T.I = (n,s=16,c='')=>`<svg class="ic${c?' '+c:''}" data-i="${n}" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n]||''}</svg>`;
T.mark = (i='layers',c='var(--accent)')=>`<span class="bmark" style="background:${c}">${I(i,16)}</span>`;
T.ws = (n='Lumen',h='@halden')=>`<button class="wsw">${T.mark()}<span class="grow"><b>${n}</b><small>${h}</small></span><span class="chev">${I('chevs',14)}</span></button>`;
T.logo = (s=28)=>`<svg class="ic" height="${Math.round(s*.66)}" width="${Math.round(s*.66*3.74)}" viewBox="0 0 748 200" fill="none" role="img" aria-label="Sera"><path d="M543 29.8386C533.318 29.8386 524.182 31.7211 515.582 35.484C506.982 38.9788 499.455 43.9522 493 50.4033C486.818 56.5862 481.851 63.9786 478.087 72.5803C474.586 81.1832 472.836 90.3224 472.836 100V200H443V100C443 86.2902 445.56 73.387 450.659 61.2904C456.041 49.1939 463.295 38.575 472.442 29.4358C481.577 20.2955 492.191 13.1724 504.291 8.06437C516.391 2.68813 529.291 0 543 0V29.8386Z" fill="var(--fg)"/><path d="M318 200C304.129 200 291.07 197.467 278.795 192.4C266.801 187.066 256.262 179.867 247.198 170.8C238.134 161.733 230.928 151.2 225.598 139.2C220.529 126.933 218 113.867 218 99.9995C218 86.4003 220.529 73.6003 225.598 61.5995C230.928 49.3336 238.134 38.6661 247.198 29.6C256.262 20.5328 266.801 13.3331 278.795 7.99988C291.07 2.66663 304.129 0 318 0C331.6 0 344.398 2.66663 356.402 7.99988C368.667 13.3331 379.337 20.5328 388.4 29.6C397.474 38.6661 404.671 49.3336 410 61.5995C415.34 73.6003 418 86.4003 418 99.9995V119.2H318V89.1995H387.999C387.999 81.1996 386.132 73.6003 382.408 66.3996C378.935 59.1999 374.007 52.9329 367.603 47.5997C361.2 42.2664 353.732 37.9994 345.201 34.7997C336.669 31.5999 327.606 29.9996 318 29.9996C308.133 29.9996 298.929 31.867 290.398 35.5999C281.866 39.0667 274.399 44.0003 267.995 50.3998C261.862 56.8004 256.934 64.2661 253.2 72.8001C249.727 81.3331 248.001 90.4002 248.001 99.9995C248.001 109.867 249.727 119.066 253.2 127.599C256.934 136.133 261.862 143.6 267.995 150C274.399 156.133 281.866 161.067 290.398 164.8C298.929 168.267 308.133 170 318 170V200Z" fill="var(--fg)"/><path d="M648.197 0C661.879 0 674.763 2.54939 686.83 7.64616C698.906 12.7439 709.498 19.8527 718.627 28.9746C727.745 37.8278 734.853 48.4243 739.952 60.7652C745.314 72.8375 748 85.8491 748 99.799V200H718.223V99.799C718.223 90.1408 716.345 81.02 712.588 72.4355C709.095 63.8499 704.137 56.4725 697.695 50.302C691.525 43.8639 684.154 38.9004 675.561 35.4127C666.978 31.6573 657.86 29.7796 648.197 29.7796C638.544 29.7796 629.416 31.6573 620.833 35.4127C612.523 38.9004 605.141 43.8639 598.699 50.302C592.53 56.4725 587.572 63.8499 583.816 72.4355C580.059 81.02 578.181 90.1408 578.181 99.799C578.181 109.457 580.059 118.579 583.816 127.164C587.572 135.48 592.53 142.858 598.699 149.296C605.141 155.466 612.523 160.43 620.833 164.185C629.416 167.942 638.544 169.819 648.197 169.819V200C634.515 200 621.509 197.452 609.17 192.355C597.094 186.989 586.491 179.745 577.373 170.624C568.255 161.503 561.005 150.906 555.644 138.834C550.545 126.493 548 113.481 548 99.799C548 86.1167 550.545 73.2395 555.644 61.1672C561.005 49.095 568.255 38.4984 577.373 29.3766C586.491 20.2557 597.094 13.1459 609.17 8.04916C621.509 2.68271 634.515 0 648.197 0Z" fill="var(--fg)"/><path d="M29.1425 55.0895C29.1425 64.6706 33.0009 71.1905 40.7188 74.6504C48.7031 78.1103 58.284 79.973 69.4616 80.2396H99.4015C104.191 80.2396 110.047 80.3728 116.967 80.6384C123.886 80.9049 131.071 81.7035 138.523 83.0341C145.975 84.0982 153.293 85.8287 160.479 88.2235C167.931 90.6182 174.584 94.0781 180.439 98.6031C186.294 103.127 190.952 108.849 194.412 115.768C198.137 122.422 200 130.672 200 140.519C200 150.1 198.137 158.217 194.412 164.87C190.952 171.523 186.294 177.112 180.439 181.636C174.85 185.895 168.463 189.355 161.278 192.016C154.092 194.411 146.773 196.274 139.322 197.604C131.87 198.669 124.685 199.335 117.765 199.6C111.111 199.867 105.389 200 100.599 200V170.858C104.858 170.858 110.846 170.991 118.563 171.258C126.281 171.523 133.866 170.858 141.317 169.262C149.035 167.665 155.688 164.737 161.278 160.479C166.866 156.221 169.66 149.568 169.66 140.519C169.66 133.865 168.064 128.543 164.87 124.551C161.676 120.559 157.551 117.498 152.495 115.369C147.705 113.24 142.382 111.91 136.527 111.378C130.938 110.844 125.615 110.579 120.559 110.579H69.4616C59.0823 110.579 49.6346 109.248 41.1185 106.587C32.6023 103.926 25.2831 100.199 19.1619 95.4088C13.0407 90.3527 8.2507 84.3648 4.79094 77.445C1.59762 70.5252 0 62.8078 0 54.2909C0 43.9122 2.52921 35.263 7.58563 28.3432C12.642 21.4235 19.1619 15.9676 27.1462 11.9756C35.1304 7.71816 43.9131 4.65707 53.4931 2.79436C63.3405 0.93165 72.9214 0 82.2359 0H200V30.3392L69.4616 31.1378C67.0656 31.4043 63.6069 31.9364 59.0823 32.735C54.5578 33.267 50.0333 34.3312 45.5097 35.9283C41.2516 37.5245 37.3922 39.9203 33.9325 43.1136C30.7392 46.0415 29.1425 50.0334 29.1425 55.0895Z" fill="var(--fg)"/></svg>`;

/* ---------- small builders shared by every page ---------- */
let seed = 7;
T.rnd = (s)=>{ if(s!=null) seed=s; seed=(seed*16807)%2147483647; return (seed-1)/2147483646; };
T.people = [['Maya Okafor','MO',1],['Leo Brandt','LB',2],['Sana Iqbal','SI',6],['Theo Marsh','TM',4],['Ines Duarte','ID',5],['Kai Nakamura','KN',3],['Ruth Adeyemi','RA',1],['Omar Haddad','OH',2]];
const H = T.H = {
  btn:(l,c='',i,ia,attrs='')=>{const s=/\b(sm|xs)\b/.test(c)?14:/\blg\b/.test(c)?18:16;return `<button class="btn ${c}" ${attrs}>${i?I(i,s):''}${l?`<span>${l}</span>`:''}${ia?I(ia,s-2):''}</button>`},
  ib:(i,c='ghost',tip,attrs='')=>`<button class="btn icon ${c}" aria-label="${tip||i}" ${tip?`data-tip="${tip}"`:''} ${attrs}>${I(i,/\b(sm|xs)\b/.test(c)?14:16)}</button>`,
  seg:(o,on=0,c='',a='')=>`<div class="seg ${c}" role="group" ${a}>${o.map((x,k)=>`<button aria-pressed="${k===on}">${x}</button>`).join('')}</div>`,
  sw:(on,c='',a='')=>`<button class="switch ${c}" role="switch" aria-checked="${!!on}" aria-label="Toggle" ${a}></button>`,
  chk:(l,on=false,sub='')=>`<span class="chk-row" role="checkbox" tabindex="0" aria-checked="${on}"><span class="box">${I(on==='mixed'?'minus':'check',12)}</span>${l?`<span>${l}${sub?`<span class="sub">${sub}</span>`:''}</span>`:''}</span>`,
  rad:(l,on=false,sub='')=>`<span class="chk-row" role="radio" tabindex="0" aria-checked="${on}"><span class="dot-radio"></span><span>${l}${sub?`<span class="sub">${sub}</span>`:''}</span></span>`,
  av:(k=0,c='',st='')=>{const p=T.people[k%8];return `<span class="av ${c}" style="--t:var(--c${p[2]})" title="${p[0]}">${p[1]}${st?`<span class="st ${st==='on'?'':st}"></span>`:''}</span>`},
  avs:(n=4,c='sm',more=0)=>`<span class="avs">${Array.from({length:n},(_,k)=>H.av(k,c)).join('')}${more?`<span class="av ${c} more">+${more}</span>`:''}</span>`,
  tag:(t,c='')=>`<span class="tag ${c}">${t}</span>`,
  kbd:(...k)=>`<span class="kbds">${k.map(x=>`<kbd class="kbd">${x}</kbd>`).join('')}</span>`,
  spill:(t,c='')=>`<span class="spill ${c}"><span class="sdot ${c}"></span>${t}</span>`,
  pix:(v='drive',c='')=>`<span class="pix ${v} ${c}" aria-label="Loading">${'<i></i>'.repeat(9)}</span>`,
  delta:(v)=>`<span class="delta ${v>0?'up':v<0?'down':'flat'}">${v>0?I('arrow-up',11):v<0?I('arrow-down',11):''}${Math.abs(v)}%</span>`,
  field:(l,ctl,hint='',extra='')=>`<label class="field"><span class="label">${l}${extra}</span>${ctl}${hint?`<span class="hint">${hint}</span>`:''}</label>`,
  input:(ph='',v='',c='',a='')=>`<input class="input ${c}" placeholder="${ph}" value="${v}" ${a}>`,
  ig:(i,ph,v='',end='',c='')=>`<div class="ig ${c}">${i?I(i,16):''}<input placeholder="${ph}" value="${v}">${end}</div>`,
  sel:(v,ph)=>`<button class="select-btn">${v?`<span>${v}</span>`:`<span class="ph">${ph}</span>`}${I('chevs',14)}</button>`,
  menu:(items)=>items.map(x=>x==='-'?'<div class="msep"></div>':x[0]==='#'?`<div class="mlabel">${x.slice(1)}</div>`:`<button class="mi ${x[3]||''}" role="menuitem">${x[1]?I(x[1],16):''}<span>${x[0]}</span>${x[2]?`<span class="end">${x[2]}</span>`:''}</button>`).join(''),
  card:(h,b,f='',c='')=>`<div class="card ${c}">${h?`<div class="card-h">${h}</div>`:''}<div class="card-b">${b}</div>${f?`<div class="card-f">${f}</div>`:''}</div>`,
  sk:(w,h=12,r=8)=>`<span class="sk" style="width:${w};height:${h}px;border-radius:${r}px"></span>`,
  toast:(t,b,i='check-c')=>`<div class="toast">${I(i,18,'ok')}<div class="grow"><b>${t}</b>${b?`<p>${b}</p>`:''}</div>${H.ib('x','ghost xs','Dismiss','data-close')}</div>`,
  bar:(v,c='')=>`<div class="bar ${c}"><i style="width:${v}%"></i></div>`,
  copy:(text,c='ghost sm')=>`<button class="btn icon ${c}" aria-label="Copy" data-tip="Copy" data-copy="${String(text).replace(/"/g,'&quot;')}">${I('copy',14)}</button>`,
  meter:(pct,n=17,tone='auto',w=100)=>{ const f=Math.round(pct/100*n), red=Math.floor(f/3), amb=Math.ceil(f/3); return `<span class="segmeter" role="meter" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" style="--w:${w}px">${Array.from({length:n},(_,i)=>`<i class="${i<f?(tone==='auto'?(i<red?'r':i<red+amb?'a':'g'):tone):''}"></i>`).join('')}</span>`; },
  ov:(name,inner,c='')=>`<div class="ov ${c}" data-name="${name}" hidden>${inner}</div>`,
  esc:s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'),
};

/* ---------- registry ---------- */
const add = (g,p,kind)=>{ p.kind=kind; p.group=g.name; g.pages.push(p); T.pages.push(p); T.by[p.s]=p; };
T.reg = (name,pages,kind='c',sec='Components')=>{ const g={name,pages:[],kind,sec}; T.groups.push(g); pages.forEach(p=>add(g,p,kind)); return g; };

/* ---------- code view ---------- */
function fmtHTML(html){
  html = html.replace(/<svg class="ic[^"]*" data-i="([^"]+)"[\s\S]*?<\/svg>/g,'<Icon name="$1"/>')
             .replace(/<svg class="chart[\s\S]*?<\/svg>/g,'<svg class="chart"><!-- drawn by T.chart --></svg>')
             .replace(/<svg class="ic" width[\s\S]*?<\/svg>/g,'<Logo/>')
             .replace(/ (title|tabindex|aria-hidden)="[^"]*"/g,'');
  const toks = html.replace(/>\s+</g,'><').split(/(<[^>]+>)/).filter(s=>s.trim());
  const voids=/^<(input|br|hr|img|Icon|Logo|meta|link)\b/;
  let ind=0; const out=[];
  toks.forEach(tk=>{
    if(tk.startsWith('</')){ ind=Math.max(0,ind-1); out.push([ind,tk,'c']); }
    else if(tk.startsWith('<!--')) out.push([ind,tk,'x']);
    else if(tk.startsWith('<')){ out.push([ind,tk,'o']); if(!voids.test(tk)&&!tk.endsWith('/>')) ind++; }
    else out.push([ind,tk.trim().replace(/\s+/g,' '),'t']);
  });
  const lines=[];
  for(let i=0;i<out.length;i++){
    const [d,tk,k]=out[i];
    if(k==='o'&&out[i+1]&&out[i+1][2]==='t'&&out[i+2]&&out[i+2][2]==='c'&&(tk.length+out[i+1][1].length)<110){ lines.push('  '.repeat(d)+tk+out[i+1][1]+out[i+2][1]); i+=2; continue; }
    if(k==='o'&&out[i+1]&&out[i+1][2]==='c'){ lines.push('  '.repeat(d)+tk+out[i+1][1]); i++; continue; }
    lines.push('  '.repeat(d)+tk);
  }
  return lines.slice(0,400).join('\n');
}
function hlHTML(src){
  return H.esc(src).replace(/(&lt;!--[\s\S]*?--&gt;)|(&lt;\/?)([\w-]+)|\s([\w:-]+)="([^"]*)"/g,(m,c,lt,tag,an,av)=>
    c?`<span class="c">${c}</span>`: tag?`${lt}<span class="k">${tag}</span>`:` <span class="a">${an}</span>=<span class="s">"${av}"</span>`);
}
function hlJS(src){
  return H.esc(src).replace(/(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|('[^'\n]*'|"[^"\n]*"|`[^`]*`)|\b(const|let|new|return|import|export|from|function|await|async|type|if|else|default)\b|(&lt;\/?)([A-Za-z][\w.]*)/g,(m,c,s,k,lt,tag)=>
    c?`<span class="c">${c}</span>`: s?`<span class="s">${s}</span>`: k?`<span class="k">${k}</span>`:`${lt}<span class="a">${tag}</span>`);
}
T.hlJS=hlJS;
function codeFor(i){
  const L=T.live[i]; if(!L) return '';
  if(L.d.jsx) return {src: typeof L.d.jsx==='function'?L.d.jsx(L.state):L.d.jsx, js:true};
  const U=T.use&&T.use[L.slug];
  if(U) return {src:`import { ${U.imports} } from "./sera";\n\n${U.jsx}`, js:true};
  if(L.d.code) return {src: typeof L.d.code==='function'?L.d.code(L.state):L.d.code, js:true};
  return {src: fmtHTML(L.body.innerHTML), js:false};
}

/* ---------- page builders ---------- */
const demoHTML = (d,st)=> typeof d.h==='function'? d.h(st) : d.h;
function knobsHTML(d,i,st){
  return `<aside class="knobs" data-for="${i}"><h4>Controls</h4>${d.k.map(k=>{
    const v=st[k.id];
    if(k.t==='seg') return `<div class="knob${k.o.join('').length>18?' stack':''}"><span>${k.l}</span>${H.seg(k.o,k.o.indexOf(v),'sm',`data-knob="${k.id}"`)}</div>`;
    if(k.t==='sw') return `<div class="knob"><span>${k.l}</span>${H.sw(v,'',`data-knob="${k.id}"`)}</div>`;
    if(k.t==='range') return `<div class="slidebar" style="--v:${(v-k.min)/(k.max-k.min)*100}%"><span class="fill"></span><span class="lab">${k.l}</span><span class="val">${v}${k.u||''}</span><input type="range" min="${k.min}" max="${k.max}" step="${k.step||1}" value="${v}" data-knob="${k.id}" data-u="${k.u||''}" aria-label="${k.l}"></div>`;
    if(k.t==='text') return `<label class="field"><span class="label">${k.l}</span><input class="input sm" value="${v}" data-knob="${k.id}"></label>`;
    return '';
  }).join('')}</aside>`;
}
let curSlug='';
function demoBlock(d,n){
  const i=T.live.length, st={}; (d.k||[]).forEach(k=>st[k.id]=k.v);
  T.live.push({d,state:st,slug:curSlug});
  return `<section class="demo"><div class="demo-h"><span class="demo-n">${String(n+1).padStart(2,'0')}</span><h3>${d.t}</h3>${d.d?`<p>${d.d}</p>`:''}</div>
  <div class="stagewrap${d.k?' has-knobs':''}"><div class="stage" data-di="${i}"><div class="stage-bar"><span></span><button class="btn sm" data-codemodal>${I('code',14)}<span>Code</span></button></div>
  <div class="stage-body ${d.c||''}" data-body="${i}">${demoHTML(d,st)}</div><pre class="stage-code" hidden></pre></div>${d.k?knobsHTML(d,i,st):''}</div></section>`;
}
function propsHTML(p){
  if(!p.p) return '';
  const rows=p.p.split(';').map(r=>r.split('|'));
  return `<section class="props"><h2>API</h2><div class="tablewrap"><table class="ptable"><thead><tr><th>Name</th><th>Values</th><th>Default</th><th>Notes</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${r[0].trim()}</td><td><code>${r[1]||'—'}</code></td><td><code>${r[2]||'—'}</code></td><td>${r[3]||''}</td></tr>`).join('')}</tbody></table></div></section>`;
}
function pager(p){
  const L=T.pages.filter(x=>x.kind===p.kind&&(p.kind!=='doc'||T.secOf(x)===T.secOf(p))), k=L.indexOf(p), a=L[k-1], b=L[k+1];
  return `<nav class="pager">${a?`<a href="#${a.s}"><small>Previous</small><b>${a.n}</b></a>`:'<span></span>'}${b?`<a class="next" href="#${b.s}"><small>Next</small><b>${b.n}</b></a>`:''}</nav>`;
}
function sourceHTML(p){
  const U=T.use&&T.use[p.s]; if(!U||!T.src) return '';
  const regs=U.regions.map(r=>[r,T.src[r]]).filter(x=>x[1]);
  const usage=`import { ${U.imports} } from "./sera";\n\n${U.jsx}`;
  const block=(file,label,code,id)=>`<div class="codeblock src"><header><span>${file}${label?` <em>· ${label}</em>`:''}</span><span class="row" style="gap:2px">${id?`<button class="btn ghost xs" data-copy="${H.esc(T.files[file]||'').replace(/"/g,'&quot;')}">${I('file',13)}<span>Copy file</span></button>`:''}${H.copy(code,'ghost xs')}</span></header><pre>${hlJS(code)}</pre></div>`;
  return `<section class="props" id="source"><h2>Usage</h2>${block('App.tsx','',usage)}
  <h2 style="margin-top:28px">Source <span class="t-small" style="font-weight:400">· React + StyleX — copy into <code class="code">src/sera/</code></span></h2>
  <div class="vstack" style="gap:12px">${regs.map(([r,o])=>block(o.file,r,o.code,1)).join('')}</div>
  <p class="t-small" style="margin-top:12px">Every file imports <code class="code">tokens.stylex.ts</code>, <code class="code">icons.tsx</code> and <code class="code">lib.ts</code>. Easiest path: download the starter from <a class="lnk" href="#installation">Installation</a>, which has all of them.</p></section>`;
}
function compPage(p){
  const g=T.groups.find(x=>x.name===p.group); curSlug=p.s;
  const U=T.use&&T.use[p.s], imp=U?`import { ${U.imports} } from "./sera";`:'';
  const file=U&&T.src&&T.src[U.regions[0]]?T.src[U.regions[0]].file:'';
  return `<header class="ph"><h1>${p.n}</h1><div class="pmeta">${file?`src/sera/${file}`:'sera'} · ${p.group}</div></header>
  <p class="lede">${p.d}</p>${imp?`<div class="import"><b>${hlJS(imp)}</b>${H.copy(imp,'ghost xs')}</div>`:''}
  ${p.demos.map(demoBlock).join('')}${pager(p)}`;
}
T.frame = (html,id='')=>`<div class="frame" ${id}><div class="inner">${html}</div></div>`;
function screenPage(p){
  return `<header class="ph"><div class="eyebrow">Screens<span>·</span>${p.tag||'App'}</div><h1>${p.n}</h1><p>${p.d}</p></header>
  <section class="demo">${T.frame(p.html())}</section>${p.notes?`<section class="props"><h2>What it uses</h2><div class="row wrap" style="gap:6px">${p.notes.split(',').map(s=>{const q=T.by[s.trim()];return q?`<a class="chip" href="#${q.s}">${q.n}</a>`:''}).join('')}</div></section>`:''}${pager(p)}`;
}
T.tile = (p)=>`<a class="tile" href="#${p.s}"><div class="tile-prev" data-tile="${p.s}"><div></div></div><div class="tile-name">${p.n}<small>${p.kind==='c'?p.demos.length+' ex':''}</small></div></a>`;

/* ---------- router ---------- */
function render(){
  const slug=(location.hash||'#').slice(1)||'overview';
  const p=T.by[slug]||T.by.overview;
  const col=$('#col'); col.className='col'+(p.wide?' wide':'');
  T.live=[];
  col.innerHTML = p.kind==='c'?compPage(p): p.kind==='screen'?screenPage(p): p.render();
  hydrate(col); p.after&&p.after(col);
  $$('.nav-a').forEach(a=>{ if(a.getAttribute('href')==='#'+p.s) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current'); });
  const sec=T.secOf(p), rs=sec==='themes'?'docs':sec;
  $$('.nav-group').forEach(g=>g.classList.toggle('offsec',g.dataset.sec!==rs));
  $$('#dlinks a').forEach(a=>{ if(a.dataset.sec===sec) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current'); });
  const cur=$('.nav-a[aria-current]'); if(cur){ const g=cur.closest('.nav-group'); if(g.classList.contains('shut')){ g.classList.remove('shut'); g.firstElementChild.setAttribute('aria-expanded','true'); } } if(cur){ const r=$('#rail'); const y=cur.offsetTop; if(y<r.scrollTop||y>r.scrollTop+r.clientHeight-80) r.scrollTop=y-r.clientHeight/2; }
  window.scrollTo(0,0); rail(false);
}
T.render=render;
const secKey=sec=>sec==='Components'?'comp':sec==='Screens'?'screens':'docs';
function buildNav(){
  let h='';
  T.groups.forEach(g=>{
    const col=(g.kind==='c'||g.kind==='screen')&&g.pages.length>1;
    h+=`<div class="nav-group${col?' shut':''}" data-g="${col?1:0}" data-sec="${secKey(g.sec)}"><div class="nav-label" ${col?'role="button" tabindex="0" aria-expanded="false"':''}><span>${g.name}</span>${col?`<span class="chev">${I('chev-down',14)}</span>`:''}</div>${g.pages.map(p=>`<a class="nav-a" href="#${p.s}"><span>${p.n}</span></a>`).join('')}</div>`;
  });
  $('#nav').innerHTML=h;
}
T.secOf=p=>p.s==='themes'?'themes':secKey(p.kind==='c'?'Components':p.kind==='screen'?'Screens':(T.groups.find(g=>g.name===p.group)||{}).sec);
/* ---------- hydrate ---------- */
const io = 'IntersectionObserver' in window ? new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ fillTile(e.target); io.unobserve(e.target);} }),{rootMargin:'200px'}) : null;
function fillTile(el){
  const p=T.by[el.dataset.tile]; if(!p) return;
  const box=el.firstElementChild;
  if(p.kind==='screen'){ box.style.cssText='left:0;top:0;width:1280px;transform:scale('+(el.clientWidth/1280)+');transform-origin:0 0;display:block'; box.innerHTML=p.html(); return; }
  if(p.tile){ box.innerHTML=p.tile; hydrate(box); return; }
  const d=p.demos&&p.demos[0]; if(!d) return; const st={}; (d.k||[]).forEach(k=>st[k.id]=k.v);
  box.innerHTML=demoHTML(d,st); hydrate(box);
}
function setRange(r){ const v=(r.value-r.min)/(r.max-r.min)*100; r.style.setProperty('--v',v+'%'); const sb=r.closest('.slidebar'); if(sb){ sb.style.setProperty('--v',v+'%'); const o=sb.querySelector('.val'); if(o) o.textContent=r.value+(r.dataset.u||''); } }
function stream(el){
  const full=el.dataset.full||el.textContent; el.dataset.full=full; const w=full.split(/(\s+)/); let k=0; el.textContent='';
  const caret=document.createElement('span'); caret.className='caret'; caret.style.cssText='display:inline-block;width:7px;height:1em;vertical-align:-2px;margin-left:2px;border-radius:2px;background:var(--accent);animation:pixA 1s infinite';
  el.appendChild(caret);
  clearInterval(el._t); el._t=setInterval(()=>{ if(!el.isConnected||k>=w.length){ clearInterval(el._t); if(el.isConnected) caret.remove(); return; } caret.before(document.createTextNode(w[k++])); }, +(el.dataset.speed||38));
}
const fitters=[]; let ro=null;
function fit(f){ const inner=f.firstElementChild; const s=Math.max(.5,f.clientWidth/1280); inner.style.width='1280px'; f.style.overflowX=s*1280>f.clientWidth+1?'auto':'hidden'; inner.style.transform=`scale(${s})`; f.style.height=(inner.offsetHeight*s)+'px'; }
if('ResizeObserver' in window) ro=new ResizeObserver(es=>es.forEach(e=>fit(e.target)));
function hydrate(root){
  $$('input[type=range]',root).forEach(setRange);
  $$('[data-stream]',root).forEach(stream);
  $$('.frame',root).forEach(f=>{ fit(f); ro&&ro.observe(f); });
  $$('[data-tile]',root).forEach(t=>io?io.observe(t):fillTile(t));
  $$('[data-hydrate]',root).forEach(el=>{ const fn=T.hyd[el.dataset.hydrate]; fn&&fn(el); });
}
T.hydrate=hydrate; T.hyd={};

/* ---------- theme + sound ---------- */
const store={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
const mq=window.matchMedia?matchMedia('(prefers-color-scheme: light)'):null;
T.theme=()=>document.documentElement.dataset.theme||(mq&&mq.matches?'light':'dark');
T.setTheme=t=>{ document.documentElement.dataset.theme=t; store.set('sera-theme',t); syncTheme(); };
function syncTheme(){ const t=T.theme(); $$('[data-theme-seg]').forEach(s=>[...s.children].forEach(b=>b.setAttribute('aria-pressed',b.dataset.v===t))); }
const saved=store.get('sera-theme'); document.documentElement.dataset.theme=saved||'dark';
T.presets=[['violet','Violet','#a988ee'],['ember','Ember','#f2915f'],['moss','Moss','#93d36b'],['ocean','Ocean','#66b6ec'],['graphite','Graphite','#e6e6ea']];
T.preset=()=>document.documentElement.dataset.preset||'violet';
T.setPreset=v=>{ if(v==='violet') delete document.documentElement.dataset.preset; else document.documentElement.dataset.preset=v; store.set('sera-preset',v); $$('[data-preset-btn]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.presetBtn===v)); };
const sp=store.get('sera-preset'); if(sp&&sp!=='violet') document.documentElement.dataset.preset=sp;
let ac=null;
function tick(f=1){
  if(!T.sound) return;
  try{ ac=ac||new (window.AudioContext||window.webkitAudioContext)(); const o=ac.createOscillator(), g=ac.createGain(), t=ac.currentTime;
    o.type='triangle'; o.frequency.setValueAtTime(820*f,t); o.frequency.exponentialRampToValueAtTime(420*f,t+.05);
    g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(.09,t+.005); g.gain.exponentialRampToValueAtTime(.0001,t+.07);
    o.connect(g).connect(ac.destination); o.start(t); o.stop(t+.08);}catch(e){}
}
T.tick=tick;

/* ---------- behaviours ---------- */
function rail(open){ const r=$('#rail'); const o=open==null?!r.classList.contains('open'):open; r.classList.toggle('open',o); $('#navscrim').hidden=!o; }
function copyText(txt,btn){
  const done=()=>{ if(!btn) return; const old=btn.innerHTML; btn.innerHTML=I('check',14); btn.style.color='var(--ok)'; setTimeout(()=>{btn.innerHTML=old;btn.style.color='';},1200); };
  try{ navigator.clipboard.writeText(txt).then(done,()=>{fallback();done();}); }catch(e){ fallback(); done(); }
  function fallback(){ const t=document.createElement('textarea'); t.value=txt; t.style.position='fixed'; t.style.opacity='0'; document.body.appendChild(t); t.select(); try{document.execCommand('copy')}catch(e){} t.remove(); }
}
function rerender(i){
  const L=T.live[i]; const body=$(`[data-body="${i}"]`); if(!L||!body) return;
  body.innerHTML=demoHTML(L.d,L.state); hydrate(body);
  const stage=body.closest('.stage'), pre=stage.querySelector('.stage-code'); if(!pre.hidden) showCode(stage);
}
function showCode(stage){ const i=+stage.dataset.di; T.live[i].body=stage.querySelector('[data-body]'); const c=codeFor(i); stage.querySelector('.stage-code').innerHTML=c.js?hlJS(c.src):hlHTML(c.src); }
function setKnob(el,v){ const box=el.closest('.knobs'); if(!box) return; const i=+box.dataset.for; T.live[i].state[el.dataset.knob]=v; rerender(i); }
function toast(stage,txt){
  let box=stage.querySelector(':scope>.toasts'); if(!box){ box=document.createElement('div'); box.className='toasts'; stage.appendChild(box); }
  const [t,b]=txt.split('|'); box.insertAdjacentHTML('beforeend',H.toast(t,b)); const el=box.lastElementChild;
  while(box.children.length>3) box.firstElementChild.remove();
  setTimeout(()=>{ el.style.transition='opacity .25s, transform .25s'; el.style.opacity='0'; el.style.transform='translateY(6px)'; setTimeout(()=>el.remove(),260); },3200);
}
function selSync(scope){
  const rows=$$('tbody [role=checkbox]',scope), on=rows.filter(r=>r.getAttribute('aria-checked')==='true');
  rows.forEach(r=>{ const tr=r.closest('tr'); tr&&tr.setAttribute('aria-selected',r.getAttribute('aria-checked')==='true'); });
  const all=$('thead [role=checkbox]',scope); if(all){ all.setAttribute('aria-checked',on.length===0?'false':on.length===rows.length?'true':'mixed'); all.querySelector('.box').innerHTML=I(on.length&&on.length<rows.length?'minus':'check',12); }
  $$('[data-selcount]',scope).forEach(e=>e.textContent=on.length);
  $$('[data-selbar]',scope).forEach(e=>e.hidden=on.length===0);
}
document.addEventListener('pointerdown',e=>{ if(e.target.closest('.btn,.seg>button,.switch,[role=checkbox],[role=radio],.chip,.mi,.tabs>button,.pg button')) tick(e.target.closest('.switch,[role=checkbox]')?1.25:1); });
document.addEventListener('click',e=>{
  const t=e.target; let el;
  $$('.anchor>.pop:not([hidden])').forEach(p=>{ if(!p.parentElement.contains(t)) p.hidden=true; });
  if(el=t.closest('[data-nav-toggle]')) return rail();
  if(el=t.closest('.nav-group[data-g="1"]>.nav-label')){ const g=el.parentElement; g.classList.toggle('shut'); el.setAttribute('aria-expanded',!g.classList.contains('shut')); return; }
  if(el=t.closest('[data-preset-btn]')){ T.setPreset(el.dataset.presetBtn); return; }
  if(t.id==='navscrim') return rail(false);
  if(el=t.closest('a.nav-a,.pager a,.tile,a.chip')){ return; }
  if(el=t.closest('.seg>button')){
    const s=el.parentElement; [...s.children].forEach(b=>b.setAttribute('aria-pressed',b===el));
    if(s.hasAttribute('data-view')){ const st=s.closest('.stage'), code=el===s.children[1]; st.querySelector('.stage-body').hidden=code; st.querySelector('.stage-code').hidden=!code; if(code) showCode(st); }
    if(s.dataset.knob) setKnob(s,el.textContent);
    if(s.hasAttribute('data-theme-seg')) T.setTheme(el.dataset.v);
    if(s.dataset.panels){ const host=s.closest(s.dataset.panels)||document; const k=[...s.children].indexOf(el); $$('[data-panel]',host).forEach((p,j)=>p.hidden=j!==k); }
    return;
  }
  if(el=t.closest('[role=tab]')){ const l=el.parentElement; [...l.children].forEach(b=>b.setAttribute('aria-selected',b===el)); const host=el.closest('[data-tabhost]'); if(host){ const k=[...l.children].indexOf(el); $$(':scope>[data-panel]',host).forEach((p,j)=>p.hidden=j!==k); } return; }
  if(el=t.closest('.switch')){ const v=el.getAttribute('aria-checked')!=='true'; el.setAttribute('aria-checked',v); if(el.dataset.knob) setKnob(el,v); if(el.id==='soundsw') T.sound=v; return; }
  if(el=t.closest('[role=radio]')){ const g=el.closest('[role=radiogroup]')||el.parentElement; $$('[role=radio]',g).forEach(r=>r.setAttribute('aria-checked',r===el)); return; }
  if(el=t.closest('[role=checkbox]')){
    const v=el.getAttribute('aria-checked')!=='true';
    const tbl=el.closest('table');
    if(tbl&&el.closest('thead')){ $$('tbody [role=checkbox]',tbl).forEach(c=>c.setAttribute('aria-checked',v)); }
    else el.setAttribute('aria-checked',v);
    if(tbl) selSync(el.closest('.stage-body')||tbl);
    return;
  }
  if(el=t.closest('[role=menuitemcheckbox]')){ el.setAttribute('aria-checked',el.getAttribute('aria-checked')!=='true'); return; }
  if(el=t.closest('.mi[role=option]')){ const p=el.closest('.pop'); $$('.mi[role=option]',p).forEach(m=>m.setAttribute('aria-checked',m===el)); const a=p.parentElement; const trg=a.classList.contains('anchor')&&a.querySelector('[data-pop]'); if(trg){ const s=trg.querySelector('span'); if(s) s.textContent=(el.querySelector('.grow>span')||el).textContent; p.hidden=true; } return; }
  if(el=t.closest('[data-pop]')){ const p=el.parentElement.querySelector(':scope>.pop'); if(p){ $$('.anchor>.pop:not([hidden])').forEach(o=>{ if(o!==p) o.hidden=true; }); p.hidden=!p.hidden; } return; }
  if(el=t.closest('[data-ov]')){ const sc=el.closest('.stage,.frame,.stage-body,.tile-prev')||document; const o=$(`.ov[data-name="${el.dataset.ov}"]`,sc.closest('.stage')||sc); if(o) o.hidden=false; return; }
  if(t.classList.contains('ov')&&!t.hasAttribute('data-static')){ if(t.dataset.fixed){ t.remove(); t._res&&t._res(false); } else t.hidden=true; return; }
  if(el=t.closest('[data-dialog]')){ T.dialog({title:'Rename pipeline',body:'Everyone in the workspace will see the new name.',confirm:'Rename'}).then(ok=>{ const o=el.parentElement.querySelector('[data-dlgout]'); if(o) o.textContent=ok?'Confirmed':'Cancelled'; }); return; }
  if(el=t.closest('[data-close]')){ const o=el.closest('.ov,.toast,.banner,.alert,.pop,.coach,[data-closable]'); if(o){ if(o.classList.contains('toast')||o.hasAttribute('data-closable')||o.classList.contains('banner')||o.classList.contains('alert')) o.remove(); else o.hidden=true; } return; }
  if(el=t.closest('[data-toast]')){ toast(el.closest('.stage')||el.closest('.frame')||document.body,el.dataset.toast); return; }
  if(el=t.closest('[data-copy-installer]')){ const go=txt=>copyText(txt,el); if(T.installer) go(T.installer); else fetch('create-sera.mjs').then(r=>r.text()).then(x=>{T.installer=x;go(x);}).catch(()=>{ el.querySelector('span').textContent='Open the file instead'; }); return; }
  if(el=t.closest('[data-codemodal]')){ T.codeModal(curSlug); return; }
  if(el=t.closest('[data-copycode]')){ const st=el.closest('.stage'); const i=+st.dataset.di; T.live[i].body=st.querySelector('[data-body]'); copyText(codeFor(i).src,el); return; }
  if(el=t.closest('[data-copy]')){ copyText(el.dataset.copy,el); return; }
  if(el=t.closest('.pg button[data-p]')){ const g=el.parentElement, bs=$$('button[data-p]',g); let k=bs.findIndex(b=>b.getAttribute('aria-current')); const v=el.dataset.p; k = v==='prev'?Math.max(0,k):v==='next'?k:+v; return pgSet(g,v,bs); }
  if(el=t.closest('.stars button')){ const bs=[...el.parentElement.children], k=bs.indexOf(el); bs.forEach((b,j)=>b.classList.toggle('on',j<=k)); const o=el.closest('.stage-body,.field'); const out=o&&o.querySelector('[data-rating]'); if(out) out.textContent=(k+1)+'.0'; return; }
  if(el=t.closest('.tag .x')){ el.closest('.tag').remove(); return; }
  if(el=t.closest('.cal .g button')){ const g=el.closest('.cal'); if(g.dataset.range!=null) return calRange(g,el); $$('.g button',g).forEach(b=>b.setAttribute('aria-selected',b===el)); const out=g.closest('.stage-body')&&g.closest('.stage-body').querySelector('[data-date]'); if(out) out.textContent=`Nov ${el.textContent}, 2026`; return; }
  if(el=t.closest('.tree .node')){ const ex=el.getAttribute('aria-expanded'); if(ex!=null){ el.setAttribute('aria-expanded',ex!=='true'); const k=el.nextElementSibling; if(k&&k.classList.contains('kids')) k.hidden=ex==='true'; } $$('.node',el.closest('.tree')).forEach(n=>n.classList.toggle('sel',n===el)); return; }
  if(el=t.closest('[data-car]')){ const tr=el.closest('.carousel').querySelector('.car-track'); tr.scrollBy({left:(el.dataset.car==='next'?1:-1)*tr.clientWidth*.8,behavior:'smooth'}); return; }
  if(el=t.closest('.swatches button')){ [...el.parentElement.children].forEach(b=>b.setAttribute('aria-pressed',b===el)); const host=el.closest('.stage-body,.pop'); const o=host&&host.querySelector('[data-hex]'); if(o){ o.textContent=el.dataset.hex; const sw=host.querySelector('[data-hexsw]'); if(sw) sw.style.background=el.dataset.hex; } return; }
  if(el=t.closest('.diff tbody tr')){ el.classList.toggle('off'); const d=el.closest('.diff'); const n=$$('tbody tr:not(.off)',d).length; const o=d.querySelector('[data-diffn]'); if(o) o.textContent=n; return; }
  if(el=t.closest('.card.select')){ const g=el.closest('[data-single]'); if(g) $$('.card.select',g).forEach(c=>c.setAttribute('aria-checked',c===el)); else el.setAttribute('aria-checked',el.getAttribute('aria-checked')!=='true'); return; }
  if(el=t.closest('[data-press]')){ el.setAttribute('aria-pressed',el.getAttribute('aria-pressed')!=='true'); return; }
  if(el=t.closest('[data-step]')){ const w=el.closest('.stepper-in'), inp=w.querySelector('input'); const st=+(w.dataset.step||1), mn=+(w.dataset.min??-1e9), mx=+(w.dataset.max??1e9); inp.value=Math.min(mx,Math.max(mn,(+inp.value||0)+(el.dataset.step==='+'?st:-st))); return; }
  if(el=t.closest('[data-edit]')){ if(el.querySelector('input')) return; const v=el.textContent.trim(); el.innerHTML=`<input class="input sm" value="${v}" style="width:${Math.max(120,v.length*9)}px">`; const i=el.querySelector('input'); i.focus(); i.select(); const done=()=>{ el.textContent=i.value||v; }; i.addEventListener('blur',done,{once:true}); i.addEventListener('keydown',ev=>{ if(ev.key==='Enter') i.blur(); if(ev.key==='Escape'){ i.value=v; i.blur(); } }); return; }
  if(el=t.closest('[data-transfer]')){ const root=el.closest('.transfer'); const [a,b]=$$('.tlist',root); const from=el.dataset.transfer==='>'?a:b, to=from===a?b:a; $$('[aria-checked="true"]',from).forEach(r=>{ r.setAttribute('aria-checked','false'); to.querySelector('.tl-items').appendChild(r); }); $$('.tl-count',root).forEach((c,j)=>c.textContent=[a,b][j].querySelectorAll('[role=checkbox]').length); return; }
  if(el=t.closest('[data-restream]')){ $$('[data-stream]',el.closest('.stage-body')||el.closest('.stage')).forEach(stream); return; }
  if(el=t.closest('[data-expand]')){ const w=el.closest('.stage-body'); const pill=w.querySelector('.promptpill'), bar=w.querySelector('.promptbar'); if(pill&&bar){ pill.hidden=true; bar.hidden=false; const ta=bar.querySelector('textarea'); ta&&ta.focus(); } return; }
  if(el=t.closest('[data-collapse]')){ const w=el.closest('.stage-body'); const pill=w.querySelector('.promptpill'), bar=w.querySelector('.promptbar'); if(pill&&bar){ pill.hidden=false; bar.hidden=true; } return; }
  if(el=t.closest('[data-rail-search-clear]')) return;
  if(el=t.closest('[data-accordion-single] summary')){ const d=el.parentElement; if(!d.open) $$('details',d.parentElement).forEach(x=>{ if(x!==d) x.open=false; }); return; }
});
function pgSet(g,v,bs){
  let k=bs.findIndex(b=>b.getAttribute('aria-current')==='page');
  const nums=bs.filter(b=>/^\d+$/.test(b.dataset.p));
  const ci=nums.findIndex(b=>b.getAttribute('aria-current')==='page');
  let ni = v==='prev'?Math.max(0,ci-1): v==='next'?Math.min(nums.length-1,ci+1): nums.findIndex(b=>b.dataset.p===v);
  nums.forEach((b,j)=>{ if(j===ni) b.setAttribute('aria-current','page'); else b.removeAttribute('aria-current'); });
  const o=g.closest('.stage-body')&&g.closest('.stage-body').querySelector('[data-pgout]'); if(o) o.textContent=nums[ni].dataset.p;
}
function calRange(g,el){
  const bs=$$('.g button:not(.out)',g); const sel=bs.filter(b=>b.getAttribute('aria-selected')==='true');
  if(sel.length!==1){ bs.forEach(b=>{ b.setAttribute('aria-selected',b===el); b.classList.remove('inr'); }); return; }
  const a=bs.indexOf(sel[0]), b=bs.indexOf(el), lo=Math.min(a,b), hi=Math.max(a,b);
  bs.forEach((x,j)=>{ x.setAttribute('aria-selected',j===lo||j===hi); x.classList.toggle('inr',j>lo&&j<hi); });
}
document.addEventListener('input',e=>{
  const t=e.target;
  if(t.type==='range'){ setRange(t); if(t.dataset.knob) setKnob(t,+t.value); const o=t.closest('.stage-body')&&t.closest('.stage-body').querySelector('[data-rangeout]'); if(o) o.textContent=t.value+(t.dataset.u||''); return; }
  if(t.dataset.knob&&t.tagName==='INPUT') return setKnob(t,t.value);
  if(t.id==='railq'){ const q=t.value.trim().toLowerCase(); $('#rail').classList.toggle('searching',!!q); $('#rail').classList.toggle('allsec',!!q); $$('.nav-group').forEach(g=>{ let any=false; $$('.nav-a',g).forEach(a=>{ const m=!q||a.textContent.toLowerCase().includes(q); a.hidden=!m; any=any||m; }); g.hidden=!any; }); return; }
  if(t.matches('[data-filter]')){ const host=(t.dataset.filter&&$(t.dataset.filter))||t.closest('[data-filterhost]')||t.closest('.pop,.cmdk,.stage-body,.card'); if(!host) return; const q=t.value.trim().toLowerCase(); let n=0; $$('[data-item]',host).forEach(m=>{ const ok=!q||m.textContent.toLowerCase().includes(q); m.hidden=!ok; if(ok)n++; }); const em=host.querySelector('[data-noresults]'); if(em) em.hidden=n>0; return; }
  if(t.closest('.otp')&&t.value){ t.value=t.value.slice(-1); let n=t.nextElementSibling; while(n&&n.tagName!=='INPUT') n=n.nextElementSibling; n&&n.focus(); return; }
  if(t.closest('.promptbar')&&t.tagName==='TEXTAREA'){ t.style.height='auto'; t.style.height=Math.min(180,t.scrollHeight)+'px'; const s=t.closest('.promptbar').querySelector('.send'); if(s){ const has=!!t.value.trim(); s.innerHTML=I(has?'arrow-up':'mic',16); s.classList.toggle('primary',has); s.classList.toggle('ghost',!has);} return; }
  if(t.closest('.rte')) return;
});
document.addEventListener('keydown',e=>{
  const t=e.target;
  if((e.key==='Enter'||e.key===' ')&&t.matches('[role=checkbox],[role=radio]')){ e.preventDefault(); t.click(); return; }
  if(e.key==='Escape'){ $$('.ov[data-fixed]').forEach(o=>o.remove()); $$('.ov:not([hidden])').forEach(o=>o.hidden=true); $$('.anchor>.pop:not([hidden])').forEach(p=>p.hidden=true); rail(false); return; }
  if(e.key==='Enter'&&t.matches('[data-tokenize]')){ e.preventDefault(); const v=t.value.trim(); if(!v) return; const c=['violet','blue','mint','sand','coral','sky'][Math.floor(Math.random()*6)]; t.insertAdjacentHTML('beforebegin',`<span class="tag ${c}">${H.esc(v)}<button class="x" aria-label="Remove">${I('x',10)}</button></span>`); t.value=''; return; }
  if(e.key==='Backspace'&&t.matches('[data-tokenize]')&&!t.value){ const p=t.previousElementSibling; if(p&&p.classList.contains('tag')) p.remove(); return; }
  if(e.key==='Backspace'&&t.closest('.otp')&&!t.value){ let p=t.previousElementSibling; while(p&&p.tagName!=='INPUT') p=p.previousElementSibling; p&&p.focus(); return; }
  if(e.key==='/'&&!/INPUT|TEXTAREA/.test(t.tagName)&&!t.isContentEditable){ e.preventDefault(); $('#railq').focus(); }
});
/* split pane drag */
document.addEventListener('pointerdown',e=>{
  const h=e.target.closest('.split>.handle'); if(!h) return; e.preventDefault();
  const s=h.parentElement, a=h.previousElementSibling, r=s.getBoundingClientRect(); h.classList.add('drag');
  const mv=ev=>{ const x=Math.min(r.width-90,Math.max(90,ev.clientX-r.left)); a.style.flex=`0 0 ${x}px`; const o=s.querySelector('[data-splitout]'); if(o) o.textContent=Math.round(x/r.width*100)+'%'; };
  const up=()=>{ h.classList.remove('drag'); removeEventListener('pointermove',mv); removeEventListener('pointerup',up); };
  addEventListener('pointermove',mv); addEventListener('pointerup',up);
});
/* global 1s clock for timers */
setInterval(()=>$$('[data-timer]').forEach(el=>{ if(el.dataset.paused==='true') return; const s=(+el.dataset.timer||0)+(el.dataset.down?-1:1); if(s<0) return; el.dataset.timer=s; el.textContent=`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`; }),1000);

/* code modal: title, file, requires, install line, tabs for usage + each source region, copy */
T.codeModal=slug=>{
  const p=T.by[slug], U=T.use&&T.use[slug]; if(!p||!U) return;
  const regs=U.regions.map(r=>[r,T.src[r]]).filter(x=>x[1]);
  const usage=`import { ${U.imports} } from "./sera";\n\n${U.jsx}`;
  const tabs=[['Usage','App.tsx',usage],...regs.map(([r,o])=>[r,'src/sera/'+o.file,o.code])];
  const file=regs[0]?regs[0][1].file:'';
  const others=[...new Set(regs.slice(1).map(x=>x[0]))];
  const ov=document.createElement('div'); ov.className='ov at-main'; ov.dataset.fixed='1'; ov.style.zIndex='70';
  ov.innerHTML=`<div class="codemodal" role="dialog" aria-label="${p.n} code"><header><div class="cm-head"><b>${p.n}</b><span class="mono cm-path">src/sera/${file}</span>
  <span class="cm-req"><b>Requires</b> · ${others.length?'also copy '+others.join(', ')+' · ':''}tokens.stylex.ts, icons.tsx, lib.ts</span>
  <span class="mono cm-cmd">$ node create-sera.mjs --only-src</span></div><div class="row" style="gap:6px;align-self:center"><button class="btn primary" data-cmcopy>Copy</button><button class="btn icon ghost" data-cmclose aria-label="Close">${I('x',16)}</button></div></header>
  <div class="cm-tabs">${H.seg(tabs.map(t=>t[0]),0,'sm')}<span class="mono cm-file"></span></div><pre class="cm-code"></pre>
  <footer>${I('info',14)}<span>Foundation required — the starter has every file. </span><a class="lnk" href="#installation" data-cmclose>Installation ${I('arrow-ur',12)}</a></footer></div>`;
  let cur=0; const pre=ov.querySelector('.cm-code'), fl=ov.querySelector('.cm-file');
  const show=i=>{ cur=i; pre.innerHTML=hlJS(tabs[i][2]); pre.scrollTop=0; fl.textContent=tabs[i][1]; };
  ov.addEventListener('click',e=>{
    const sb=e.target.closest('.cm-tabs .seg>button'); if(sb){ show([...sb.parentElement.children].indexOf(sb)); return; }
    const c=e.target.closest('[data-cmcopy]'); if(c){ e.stopPropagation(); copyText(tabs[cur][2]); c.textContent='Copied'; setTimeout(()=>c.textContent='Copy',1200); return; }
    if(e.target.closest('[data-cmclose]')){ ov.remove(); }
  });
  document.body.appendChild(ov); show(0);
};

/* imperative dialog */
T.dialog=o=>new Promise(res=>{
  const ov=document.createElement('div'); ov.className='ov'; ov.dataset.fixed='1'; ov.style.position='fixed'; ov.style.zIndex='60'; ov._res=res;
  ov.innerHTML=`<div class="dialog" role="dialog" aria-label="${o.title}"><div class="dh"><div><h4>${o.title}</h4><p>${o.body||''}</p></div></div><div class="df"><button class="btn ghost" data-r="0">Cancel</button><button class="btn primary" data-r="1">${o.confirm||'OK'}</button></div></div>`;
  ov.addEventListener('click',e=>{ const b=e.target.closest('[data-r]'); if(b){ e.stopPropagation(); ov.remove(); res(b.dataset.r==='1'); } });
  document.body.appendChild(ov); ov.querySelector('[data-r="1"]').focus();
});

/* ---------- tooltips ---------- */
/* One floating tip on <body>, placed from the control's position. Screens, toolbars and stages clip their contents,
   so a tip drawn inside them gets cut off; this one sits above everything, flips below when there is no room, and stays in the viewport. */
let tipEl=null, tipFor=null;
function tipHide(){ tipFor=null; if(tipEl) tipEl.hidden=true; }
function tipShow(el){
  if(!el.dataset.tip||!el.offsetWidth) return tipHide();
  if(!tipEl){ tipEl=document.createElement('div'); tipEl.className='tipfloat'; tipEl.setAttribute('role','tooltip'); document.body.appendChild(tipEl); }
  tipFor=el; tipEl.textContent=el.dataset.tip; tipEl.hidden=false;
  const r=el.getBoundingClientRect(), w=tipEl.offsetWidth, h=tipEl.offsetHeight;
  let y=r.top-h-8; if(y<6) y=r.bottom+8;
  tipEl.style.left=Math.round(Math.max(8,Math.min(innerWidth-w-8,r.left+r.width/2-w/2)))+'px'; tipEl.style.top=Math.round(y)+'px';
}
document.addEventListener('pointerover',e=>{ if(e.pointerType==='touch') return; const el=e.target.closest&&e.target.closest('[data-tip]'); if(el!==tipFor){ el?tipShow(el):tipHide(); } });
document.addEventListener('focusin',e=>{ const el=e.target.closest&&e.target.closest('[data-tip]'); if(el&&el.matches(':focus-visible')) tipShow(el); });
document.addEventListener('focusout',tipHide); document.addEventListener('pointerdown',tipHide); document.addEventListener('scroll',tipHide,true); addEventListener('hashchange',tipHide);
document.documentElement.addEventListener('pointerleave',tipHide);

/* ---------- boot ---------- */
T.boot=()=>{
  try{ fetch('create-sera.mjs').then(r=>r.ok?r.text():null).then(x=>{ if(x) T.installer=x; }).catch(()=>{}); }catch(e){}
  buildNav(); syncTheme(); T.setPreset(T.preset());
  mq&&mq.addEventListener&&mq.addEventListener('change',syncTheme);
  addEventListener('hashchange',render); render();
};
})();
