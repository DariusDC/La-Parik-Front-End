const homeSection = document.getElementById("home");
const menuSection = document.getElementById("menu");
const recenziiSection = document.getElementById("recenzii");
const rezervariSection = document.getElementById("rezevare");


$(document).ready(function () {
    $(document).on("scroll", onScroll);
    
    //smoothscroll
    $('a[href^="#"]').on('click', function (e) {
        e.preventDefault();
        $(document).off("scroll");
        
        $('a').each(function () {
            $(this).removeClass('active');
        })
        $(this).addClass('active');
      
        var target = this.hash,
            menu = target;
        $target = $(target);
        $('html, body').stop().animate({
            'scrollTop': $target.offset().top+2
        }, 500, 'swing', function () {
            window.location.hash = target;
            $(document).on("scroll", onScroll);
        });
    });
});

function onScroll(event){
    var scrollPos = $(document).scrollTop();
    $('#navScroll a').each(function () {
        var currLink = $(this);
        var refElement = $(currLink.attr("href"));
        console.log(refElement.position)
        if (refElement.position() <= scrollPos && refElement.position() + refElement.height() > scrollPos) {
            $('#menu-center ul li a').removeClass("active");
            currLink.addClass("active");
        }
        else{
            currLink.removeClass("active");
        }
    });
}

var pret = 0;
var contor = 0;
$('.cantitate').on('change',function()
{
    pret = 0;
    contor = 0;
    var aux = 0;
    $(".cantitate").each(function() {
        ++contor;
        if (contor % 2 == 1)
        {
            aux = Number($(this).html());
        }
        else
        {
            pret = pret + $(this).val() * aux;
        }
    });
    $("#pret").html("" + pret);
});

function checkform(){
    return Number($("#pret").html()) > 0;
}