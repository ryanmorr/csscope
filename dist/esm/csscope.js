/*! @ryanmorr/csscope v0.1.2 | https://github.com/ryanmorr/csscope */
/*! @ryanmorr/amble v0.1.2 | https://github.com/ryanmorr/amble */
const n=/([^{};]*)([;{}])/g,t=/(\r\n|\r|\n)+/g,e=/\t/g,r=/\s{2,}/g,c=/\/\*[\W\w]*?\*\//g,s=/\s*([:;{}])\s*/g,u=/\};+/g,i=/([^:;{}])}/g;const l=/^(?:\\.|[\w\-\u00c0-\uFFFF])+/,o=/^:((?:\\.|[\w\u00c0-\uFFFF-])+)(?:\((['"]?)((?:\([^)]+\)|[^()]*)+)\2\))?/,a=/^\[((?:\\.|[\w\u00c0-\uFFFF-])+)\s*(?:(\S?=)\s*(?:(['"])([^]*?)\3|(#?(?:\\.|[\w\u00c0-\uFFFF-])*)|)|)\s*(i)?\]/,f=/@keyframes\s*((?:\\.|[\w\-\u00c0-\uFFFF])+)/gi,F=/^(animation(?:-name)?)\s*:\s*(.*)$/;function g(g,h){const p=[];h=function(n,t,e){return n.replace(f,((n,r)=>(e.push(r),"@keyframes "+t+"-"+r)))}(h,g,p);let m="",w=!1,b=0;return function(l,o){l=function(n){return n.replace(t," ").replace(e," ").replace(r," ").replace(c,"").trim().replace(s,"$1").replace(u,"}").replace(i,"$1;}")}(l),n.lastIndex=0;for(let t;null!=(t=n.exec(l));)o(t[1],t[2])}(h,((n,t)=>{"{"==t?(w&&b++,"@"===n.charAt(0)?(n.startsWith("@keyframes")&&(w=!0,b++),m+=n):m+=w?n:function(n,t){const e="["+t+"]";let r=0,c=!1,s=!1,u=!1;function i(n){r+=n}function f(t){n=n.slice(0,t)+e+n.slice(t),i(e.length)}function F(t,e){return t=r+t,n.substring(t,t+e)}function g(t){i(n.substring(r).match(t)[0].length)}function h(){let t=1;for(;p(n.charAt(r+t));)t++;i(t)}function p(n){return" "===n||"\n"===n||"\t"===n||"\f"===n||"\r"===n}function m(){return!s&&!u}for(;r<n.length;){const t=n.charAt(r);p(t)?(c=!0,h()):">"===t||"~"===t||"+"===t?(m()&&f(c?r-1:r),">>>"===F(0,3)?(n=n.slice(0,c?r-1:r)+(c?"":" ")+n.slice(r+3),u=!0):i(1),s=c=!1,h()):","===t?(m()&&f(p(F(-1,1))?r-1:r),s=u=c=!1,h()):(c&&(m()&&f(r-1),c=!1),"*"===t?i(1):"#"===t||"."===t?(i(1),g(l)):"["===t?(m()&&(f(r),s=!0),g(a)):":"===t?(m()&&(f(r),s=!0),"::"===F(0,2)?(i(2),g(l)):g(o)):l.test(n.substring(r))&&g(l))}return m()&&(n+=e),n}(n.trim(),g),m+="{\n"):"}"==t?(m+="}\n",w&&(b--,0===b&&(w=!1))):";"==t&&(n.startsWith("animation")&&p.length>0?m+=function(n,t,e){const r=n.match(F),c=r[1],s=r[2].split(",");for(let n=0,r=s.length;n<r;n++){const r=s[n].trim().split(" "),c=r[0];e.includes(c)&&(r[0]=t+"-"+c),s[n]=r.join(" ")}return c+":"+s.join(",")}(n,g,p)+";\n":m+=n+";\n")})),m}export{g as default};
