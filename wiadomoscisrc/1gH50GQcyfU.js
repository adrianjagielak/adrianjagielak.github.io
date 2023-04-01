;/*FB_PKG_DELIM*/

__d("FbtNumberTypeNew",["IntlNumberTypeProps"],(function(a,b,c,d,e,f,g){g["default"]=c("IntlNumberTypeProps").module}),98);
__d("IntlCLDRNumberType01",["IntlVariations"],(function(a,b,c,d,e,f,g){"use strict";a={getVariation:function(a){return c("IntlVariations").NUMBER_OTHER}};b=a;g["default"]=b}),98);
__d("IntlCLDRNumberType05",["IntlVariations"],(function(a,b,c,d,e,f,g){"use strict";a={getVariation:function(a){if(a===1)return c("IntlVariations").NUMBER_ONE;else return c("IntlVariations").NUMBER_OTHER}};b=a;g["default"]=b}),98);
__d("FalcoUtils",[],(function(a,b,c,d,e,f){"use strict";function a(a){if(a){var b=a.fbIdentity,c=a.appScopedIdentity;a=a.claim;var d="";if(b){var e=b.accountId;b=b.actorId;d=e+"^#"+b+"^#"}else c!==void 0&&(d="^#^#"+c);return d+"^#"+a}return""}f.identityToString=a}),66);