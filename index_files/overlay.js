google.maps.__gjsload__('overlay', function(_){var Fx=_.oa("i"),Gx=_.n(),Hx=function(a){a.eh=a.eh||new Gx;return a.eh},Ix=function(a){this.Na=new _.xi(function(){var b=a.eh;if(a.getPanes()){if(a.getProjection()){if(!b.kg&&a.onAdd)a.onAdd();b.kg=!0;a.draw()}}else{if(b.kg)if(a.onRemove)a.onRemove();else a.remove();b.kg=!1}},0)},Jx=function(a,b){function c(){return _.yi(e.Na)}var d=Hx(a),e=d.Of;e||(e=d.Of=new Ix(a));_.B(d.Ga||[],_.L.removeListener);var f=d.Sa=d.Sa||new _.vo,g=b.__gm;f.bindTo("zoom",g);f.bindTo("offset",g);f.bindTo("center",g,"projectionCenterQ");
f.bindTo("projection",b);f.bindTo("projectionTopLeft",g);f=d.Zi=d.Zi||new Fx(f);f.bindTo("zoom",g);f.bindTo("offset",g);f.bindTo("projection",b);f.bindTo("projectionTopLeft",g);a.bindTo("projection",f,"outProjection");a.bindTo("panes",g);d.Ga=[_.L.addListener(a,"panes_changed",c),_.L.addListener(g,"zoom_changed",c),_.L.addListener(g,"offset_changed",c),_.L.addListener(b,"projection_changed",c),_.L.addListener(g,"projectioncenterq_changed",c)];c();b instanceof _.Eg&&(_.Cj(b,"Ox"),_.Xo("Ox","-p",a))},
Mx=function(a){if(a){var b=a.getMap(),c=a.__gmop;if(c){if(c.map==b)return;a.__gmop=null;_.Yo("Ox","-p",c.nb);c.nb.unbindAll();c.nb.set("panes",null);c.nb.set("projection",null);_.kb(c.$m.j,c);c.Bf&&(c.Bf=!1,c.nb.onRemove?c.nb.onRemove():c.nb.remove())}if(b&&b instanceof _.Eg){var d=b.__gm;d.overlayLayer?a.__gmop=new Kx(b,a,d.overlayLayer):d.i.then(function(e){e=e.rb;var f=new Lx(b,e);e.yc(f);d.overlayLayer=f;Mx(a)})}}},Kx=function(a,b,c){this.map=a;this.nb=b;this.$m=c;this.Bf=!1;_.Cj(this.map,"Ox");
_.Xo("Ox","-p",this.nb);c.j.push(this);c.i&&Nx(this,c.i);c.o.Ng()},Nx=function(a,b){a.nb.get("projection")!=b&&(a.nb.bindTo("panes",a.map.__gm),a.nb.set("projection",b))},Lx=function(a,b){this.H=a;this.o=b;this.i=null;this.j=[]};_.A(Fx,_.M);Fx.prototype.changed=function(a){"outProjection"!=a&&(a=!!(this.get("offset")&&this.get("projectionTopLeft")&&this.get("projection")&&_.le(this.get("zoom"))),a==!this.get("outProjection")&&this.set("outProjection",a?this.i:null))};_.A(Ix,_.M);Kx.prototype.draw=function(){this.Bf||(this.Bf=!0,this.nb.onAdd&&this.nb.onAdd());this.nb.draw&&this.nb.draw()};Lx.prototype.dispose=_.n();Lx.prototype.Qb=function(a,b,c,d,e,f,g,h){var k=this.i=this.i||new _.qp(this.H,this.o,_.n());k.Qb(a,b,c,d,e,f,g,h);a=_.Aa(this.j);for(b=a.next();!b.done;b=a.next())b=b.value,Nx(b,k),b.draw()};_.cf("overlay",{Mh:function(a){if(a){var b=a.getMap();if(b&&b instanceof _.Eg||a.__gmop)Mx(a);else{b=a.getMap();var c=Hx(a),d=c.sm;c.sm=b;d&&(c=Hx(a),(d=c.Sa)&&d.unbindAll(),(d=c.Zi)&&d.unbindAll(),a.unbindAll(),a.set("panes",null),a.set("projection",null),_.B(c.Ga,_.L.removeListener),c.Ga=null,c.Of&&(c.Of.Na.Ob(),c.Of=null),_.Yo("Ox","-p",a));b&&Jx(a,b)}}},preventMapHitsFrom:function(a){_.fq(a,{onClick:function(b){return _.yp(b.event)},Ib:function(b){return _.vp(b)},yd:function(b){return _.wp(b)},
Xb:function(b){return _.wp(b)},Nb:function(b){return _.xp(b)}}).Rd(!0)},preventMapHitsAndGesturesFrom:function(a){a.addEventListener("click",_.gf);a.addEventListener("contextmenu",_.gf);a.addEventListener("dblclick",_.gf);a.addEventListener("mousedown",_.gf);a.addEventListener("mousemove",_.gf);a.addEventListener("MSPointerDown",_.gf);a.addEventListener("pointerdown",_.gf);a.addEventListener("touchstart",_.gf);a.addEventListener("wheel",_.gf)}});});
