/*! Created by iart.pl SOL - v1.0.0 - 2016-07-31 */
function deleteCookie(a) {
    getCookie(a) && (document.cookie = a + "=;expires=Thu, 01-Jan-1970 00:00:01 GMT")
}

function setCookie(a, b, c) {
    var d = new Date;
    d.setDate(d.getDate() + c),
        document.cookie = a + "=" + escape(b) + (null === c ? "" : ";expires=" + d.toUTCString())
}

function getCookie(a) {
    return document.cookie.length > 0 && (c_start = document.cookie.indexOf(a + "="), -1 !== c_start) ? (c_start = c_start + a.length + 1, c_end = document.cookie.indexOf(";", c_start), -1 === c_end && (c_end = document.cookie.length), unescape(document.cookie.substring(c_start, c_end))) : ""
}

function checkCookie(a) {
    var b = getCookie(a);
    return null !== b && "" !== b
}

$(document).ready(function() {

$( "a[target='_blank']" ).each(function( ) {
    var rel = $(this).attr('rel');
    if (typeof rel == 'undefined' && rel == null) {        
        $(this).attr('rel','noreferrer');
    } 
});

    $('a[data-mask^="mask"]').click(function(event) {
        var email = $(this).attr('data-email');
        var email = window.atob(email);
        $(this).attr('data-email', email);
        $(this).attr('href', email);
        var email = email.substring(7);
        $(this).attr('title', 'Adres e-mail: ' + email);
        $(this).html(email);
        event.preventDefault();
    });



    var a = $("#godz");
    a.on("focus", function() {
            var b = $(this).val();
            b === formats.hour && a.val("")
        }),
        a.on("blur", function() {
            var b = $(this).val();
            "" === b && a.val(formats.hour)
        })
}), $(document).ready(function() {
    function a() {
        var a = $(window).width();
        t >= a ? (settings.smScreen = 1, w.each(function() {
            var a = $(this),
                b = a.attr("data-menu"),
                c = a.find(".nav"),
                d = {
                    screen: settings.smScreen,
                    pg: b,
                    ids_1: settings.ids_1,
                    ids_2: settings.ids_2,
                    ids_3: settings.ids_3
                };
            c.html(""),
                $.post(x, d, function(a) {
                    c.html(a)
                })
        })) : settings.smScreen = 0
    }

    function b() {
        var a;
        $("a.fancybox").fancybox({
            overlayOpacity: .9,
            overlayColor: settings.overlayColor,
            titlePosition: "outside",
            titleFromAlt: !0,
            titleFormat: function(a, b, c, d) {
                return '<span id="fancybox-title-over">' + texts.image + " " + (c + 1) + " / " + b.length + "</span>" + (a.length ? " &nbsp; " + a.replace(texts.enlargeImage + ": ", "") : "")
            },
            onStart: function(b, c, d) {
                a = b[c]
            },
            onComplete: function() {
                var a = $("#fancybox-outer");
                a.focus().on("keydown", function(b) {
                    d(a, b)
                })
            },
            onClosed: function() {
                a.focus()
            }
        })
    }

    function c() {
        var a;
        $("#popup").fancybox({
            overlayOpacity: .9,
            overlayColor: settings.overlayColor,
            width: settings.popupWidth,
            height: settings.popupHeight,
            autoDimensions: !1,
            autoSize: !1,
            type: "iframe",
            onStart: function(b, c, d) {
                a = b[c]
            },
            onComplete: function() {
                var a = $("#fancybox-outer");
                a.attr("aria-describedby", "fancybox-content").focus().on("keydown", function(b) {
                        d(a, b)
                    }),
                    $(".main-text a").each(function() {
                        var a = $(this),
                            b = a.attr("target");
                        "_blank" === b && a.append('<span class="sr-only">' + texts.openNewWindow + "</span>")
                    })
            },
            onClosed: function() {
                a.focus()
            }
        }).trigger("click")
    }

    function d(a, b) {
        if (9 == b.which) {
            var c = a.find("*"),
                d = c.filter(i).filter(":visible"),
                e = $(":focus"),
                f = d.length,
                g = d.index(e);
            b.shiftKey ? 0 == g && (d.get(f - 1).focus(), b.preventDefault()) : g == f - 1 && (d.get(0).focus(), b.preventDefault())
        }
    }

    function e() {
        var a = $(window).width();
        s >= a ? m.insertAfter(n) : n.insertAfter(m),
            t >= a ? (o.insertBefore(p), r.insertBefore(p)) : (o.insertAfter(q), r.insertAfter(o))
    }

    function f() {
        var a = $(window).width();
        s >= a ? (v.addClass("mobile"), u.parent().hasClass("home-map-btn") || (u.wrap('<a href="#" class="home-map-btn" aria-controls="homeMapMobile" data-target="homeMapMobile" aria-expanded="false"></a>').after('<i class="icon-angle-down icon" aria-hidden="true"></i>'), $(".home-map-btn").unbind("click").on("click", function(a) {
            var b = $(this),
                c = $("#" + b.attr("data-target"));
            a.preventDefault(),
                b.blur(),
                "false" === b.attr("aria-expanded") ? (b.attr("aria-expanded", "true"), b.find(".icon").addClass("rotate"), c.addClass("map-show")) : (b.attr("aria-expanded", "false"), b.find(".icon").removeClass("rotate"), c.removeClass("map-show"))
        }))) : (v.removeClass("mobile"), u.parent().hasClass("home-map-btn") && u.unwrap(".home-map-btn").next().remove())
    }
    var g = $(".search-input"),
        h = $(".unit-btn"),
        i = "a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]",
        j = $(".register-btn"),
        k = $(".register"),
        l = $(".main-text"),
        m = ($(".search-wrapper").parent(), $(".settings-wrapper").parent(), $(".bip-wrapper"), $(".left-column")),
        n = $(".right-column"),
        o = $(".links-wrapper"),
        p = $(".bottom-anchor"),
        q = $(".menu-wrapper"),
        r = $(".ads-left-wrapper"),
        s = 480,
        t = 768,
        u = $(".home-map-header"),
        v = $(".home-map-mobile-wrapper"),
        w = $(".navbar-collapse"),
        x = "load-menu.php";
    $(window).on("resize", function() {
            a()
        }),
        a(),
        "" !== settings.searchWord ? (g.val(settings.searchWord), g.on("focus", function() {
            var a = $(this);
            a.val() === settings.searchWord && a.val("")
        }), g.on("blur", function() {
            var a = $(this);
            "" === a.val() && a.val(settings.searchWord)
        })) : (g.val(texts.searchPhrase), g.on("focus", function() {
            var a = $(this);
            a.val() === texts.searchPhrase && a.val("")
        }), g.on("blur", function() {
            var a = $(this);
            "" === a.val() && a.val(texts.searchPhrase)
        })),
        $(".close-cookie").on("click", function(a) {
            a.preventDefault(),
                setCookie("cookieOK", 1, 365),
                $(".cookie-wrapper").stop().animate({
                    height: 0
                }, 300)
        }),
        0 === settings.highContrast && $("a").on("click", function() {
            var a = $(this);
            a.addClass("no-outline"),
                a.find(".title").addClass("no-outline")
        }),
        h.unbind("click").on("click", function(a) {
            var b = $(this),
                c = $("#" + b.attr("data-target"));
            a.preventDefault(),
                b.blur(),
                "false" === b.attr("aria-expanded") ? (b.attr("aria-expanded", "true"), b.find(".icon").addClass("rotate")) : (b.attr("aria-expanded", "false"), b.find(".icon").removeClass("rotate")),
                c.slideToggle("slow")
        }),
        j.unbind("click").on("click", function(a) {
            var b = $(this),
                c = $("#" + b.attr("data-target"));
            a.preventDefault(),
                b.blur(),
                "false" === b.attr("aria-expanded") ? (b.attr("aria-expanded", "true"), b.find(".icon").addClass("rotate"), b.find(".title").text(texts.collapseChangesRegister)) : (b.attr("aria-expanded", "false"), b.find(".icon").removeClass("rotate"), b.find(".title").text(texts.expandChangesRegister)),
                c.slideToggle("fast")
        }),
        l.find("a").each(function() {
            var a = $(this);
            "_blank" === a.attr("target") && a.append('<span class="sr-only">' + texts.opensInNewWindow + "</span>")
        }),
        l.find(".access-map").attr("aria-hidden", "true"),
        l.find("table").each(function() {
            var a = $(this);
            a.wrap('<div class="table-responsive"></div>')
        }),
        b(),
        1 === settings.popupShow && c(),
        1 === settings.print && (k.slideToggle("fast"), setTimeout(function() {
            print()
        }, 1e3)),
        $(".datepicker").datepicker({
            language: "pl",
            format: "yyyy-mm-dd",
            todayHighlight: !0,
            todayBtn: "linked",
            templates: {
                leftArrow: '<i class="icon-angle-left icon" aria-hidden="true"></i><span class="sr-only">' + texts.prevMonth + "</span>",
                rightArrow: '<i class="icon-angle-right icon" aria-hidden="true"></i><span class="sr-only">' + texts.nextMonnth + "</span>"
            },
            maxViewMode: 1
        }),
        $(window).on("resize", function() {
            e()
        }),
        e(),
        $(window).on("resize", function() {
            f()
        }),
        f()
}), $(window).load(function() {
    $(window).stellar()
}), $(document).on("shown.bs.dropdown", function(a) {
    var b = $(a.target);
    b.find(".dropdown-menu").attr("aria-expanded", !0),
        setTimeout(function() {}, 10)
}), $(document).on("hidden.bs.dropdown", function(a) {
    var b = $(a.target);
    b.find(".dropdown-menu").attr("aria-expanded", !1),
        b.find(".dropdown-toggle").focus()
}), $(document).ready(function() {
    function a(a) {
        var b = /^[a-zA-Z]([a-zA-Z0-9_\-])+([\.][a-zA-Z0-9_]+)*\@((([a-zA-Z0-9\-])+\.){1,2})*([a-zA-Z0-9]{2,40})$/;
        return console.log(b.test(a)),
            b.test(a)
    }
    var b = $(".contact-form"),
        c = b.find(".submit-btn"),
        d = $(".room-form"),
        e = d.find(".submit-btn");
    c.on("click", function(c) {
            var d = $(this),
                e = !1,
                f = (b.find("#question"), b.find("#email"));
            d.blur(),
                c.preventDefault(),
                $(".form-control").each(function() {
                    var b = $(this);
                    if (b.hasClass("required")) {
                        var c = b.parent().parent().find(".error");
                        switch (b.attr("id")) {
                            case "email":
                                a(f.val()) ? (b.removeClass("error-field"), c.hide().text(""), e = !1) : (b.addClass("error-field"), c.show().text(errors.invalidEmail), e = !0);
                                break;
                            default:
                                "" === b.val() ? (b.addClass("error-field"), c.show().text(errors.requiredField), e = !0) : (b.removeClass("error-field"), c.hide().text(""), e = !1)
                        }
                        b.on("focus", function() {
                            b.on("keypress", function() {
                                b.removeClass("error-field"),
                                    c.hide().text("")
                            })
                        })
                    }
                }),
                e ? $(".error-field:first").focus() : b.submit()
        }),
        e.on("click", function(a) {
            var b = $(this),
                c = !1;
            d.find("#room");
            a.preventDefault(),
                b.blur(),
                $(".form-control").each(function() {
                    var a = $(this);
                    if (a.hasClass("required")) {
                        var b = a.parent().parent().find(".error");
                        switch (a.attr("id")) {
                            default:
                                "" === a.val() ? (a.addClass("error-field"), b.show().text(errors.requiredField), c = !0) : (a.removeClass("error-field"), b.hide().text(""), c = !1)
                        }
                        a.on("focus", function() {
                            a.on("keypress", function() {
                                a.removeClass("error-field"),
                                    b.hide().text("")
                            })
                        })
                    }
                }),
                c ? $(".error-field:first").focus() : d.submit()
        })
}), $(document).ready(function() {
    if (1 === settings.showMap) {
        var a,
            b = new google.maps.InfoWindow,
            c = new google.maps.LatLng(settings.mapLat, settings.mapLng),
            d = {
                zoom: 17,
                center: c,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            },
            e = settings.pageName + " " + settings.pagePlace,
            a = new google.maps.Map($(".home-map")[0], d),
            f = new google.maps.Marker({
                position: c,
                map: a,
                title: e
            }),
            g = "https://www.google.pl/maps/place/" + e.split(" ").join("+") + "/@" + settings.mapLat + "," + settings.mapLng,
            h = '<a href="' + g + '" target="_blank">' + texts.showBiggerMap + '<span class="sr-only">' + texts.opensInNewWindow + "</a>";
        google.maps.event.addListener(f, "click", function() {
            b.setContent('<div class="map-details-info main-text">' + h + "</div>"),
                b.open(a, f);
            var c = $(".map-details-info").parent().parent().parent().prev(),
                d = c.find("div").last(),
                e = d.prev().find("div div"),
                g = c.next().next();
            d.addClass("details-background"),
                e.addClass("arrow-background"),
                g.html('<a class="close-details" href="javascript: void();"><i class="icon-cancel icon" aria-hidden="true"></i><span class="sr-only">' + texts.closeDetails + "</span></a>").css({
                    height: "30px"
                })
        })
    }
}), $(document).ready(function() {
    if (1 === settings.showRooms) {
        var a = $(".floor"),
            b = a.find("polygon");
        a.scrollTo(b, 1e3)
    }
});