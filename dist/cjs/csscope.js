/*! @ryanmorr/csscope v0.1.1 | https://github.com/ryanmorr/csscope */
"use strict";
/*! @ryanmorr/amble v0.1.2 | https://github.com/ryanmorr/amble */const t=/([^{};]*)([;{}])/g,n=/(\r\n|\r|\n)+/g,e=/\t/g,r=/\s{2,}/g,c=/\/\*[\W\w]*?\*\//g,s=/\s*([:;{}])\s*/g,u=/\};+/g,i=/([^:;{}])}/g;const o=/^(?:\\.|[\w\-\u00c0-\uFFFF])+/,l=/^:((?:\\.|[\w\u00c0-\uFFFF-])+)(?:\((['"]?)((?:\([^)]+\)|[^()]*)+)\2\))?/,a=/^\[((?:\\.|[\w\u00c0-\uFFFF-])+)\s*(?:(\S?=)\s*(?:(['"])([^]*?)\3|(#?(?:\\.|[\w\u00c0-\uFFFF-])*)|)|)\s*(i)?\]/,f=/@keyframes\s*((?:\\.|[\w\-\u00c0-\uFFFF])+)/gi,F=/^(animation(?:-name)?)\s*:\s*(.*)$/;module.exports=function(g,h){const m=[];h=function(t,n,e){return t.replace(f,((t,r)=>(e.push(r),"@keyframes "+n+"-"+r)))}(h,g,m);let p="",w=!1,b=0;return function(o,l){o=function(t){return t.replace(n," ").replace(e," ").replace(r," ").replace(c,"").trim().replace(s,"$1").replace(u,"}").replace(i,"$1;}")}(o),t.lastIndex=0;for(let n;null!=(n=t.exec(o));)l(n[1],n[2])}(h,((t,n)=>{"{"==n?(w&&b++,"@"===t.charAt(0)?(t.startsWith("@keyframes")&&(w=!0,b++),p+=t):p+=w?t:function(t,n){const e="["+n+"]";let r=0,c=!1,s=!1,u=!1;function i(t){r+=t}function f(n){t=t.slice(0,n)+e+t.slice(n),i(e.length)}function F(n,e){return n=r+n,t.substring(n,n+e)}function g(n){i(t.substring(r).match(n)[0].length)}function h(){let n=1;for(;m(t.charAt(r+n));)n++;i(n)}function m(t){return" "===t||"\n"===t||"\t"===t||"\f"===t||"\r"===t}function p(){return!s&&!u}for(;r<t.length;){const n=t.charAt(r);m(n)?(c=!0,h()):">"===n||"~"===n||"+"===n?(p()&&f(c?r-1:r),">>>"===F(0,3)?(t=t.slice(0,c?r-1:r)+(c?"":" ")+t.slice(r+3),u=!0):i(1),s=c=!1,h()):","===n?(p()&&f(m(F(-1,1))?r-1:r),s=u=c=!1,h()):(c&&(p()&&f(r-1),c=!1),"*"===n?i(1):"#"===n||"."===n?(i(1),g(o)):"["===n?(p()&&(f(r),s=!0),g(a)):":"===n?(p()&&(f(r),s=!0),"::"===F(0,2)?(i(2),g(o)):g(l)):o.test(t.substring(r))&&g(o))}return p()&&(t+=e),t}(t.trim(),g),p+="{\n"):"}"==n?(p+="}\n",w&&(b--,0===b&&(w=!1))):";"==n&&(t.startsWith("animation")&&m.length>0?p+=function(t,n,e){const r=t.match(F),c=r[1],s=r[2].split(",");for(let t=0,r=s.length;t<r;t++){const r=s[t].trim().split(" "),c=r[0];e.includes(c)&&(r[0]=n+"-"+c),s[t]=r.join(" ")}return c+":"+s.join(",")}(t,g,m)+";\n":p+=t+";\n")})),p};
