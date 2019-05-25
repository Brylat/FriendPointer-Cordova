jQuery(document).on("mobileinit", function () {
    jQuery.mobile.autoInitializePage = false;
});
$.mobile.autoInitializePage = false;


$(function  () {
    $("button").click(function () {
        var button = $(this)[0];
        console.log(button.innerHTML);
        if(button.innerHTML.indexOf("Google") !== -1){
            googleButtonColoring(button);
            singInWithGoogle();
        }
        else if(button.innerHTML.indexOf('Up') !== -1) {
            normalButtonColoring(button);
            signUp();
        }
        else{
            normalButtonColoring(button);
            signIn();
        }
    });

    $("input").focus( function() {
        $(this).parent().css("transition", "border-bottom-width 0.1s ease-in-out");
        $(this).parent().css("border-bottom-width","3px");
        $(this).css("transition", "font-weight 0.1s ease-in-out");
        $(this).css("font-weight", "bolder")
    });

    $("input").blur( function() {
        $(this).parent().css("border-bottom-width","1px");
        $(this).css("font-weight", "");
    });
});


function normalButtonColoring(button) {
    button.classList.add('grey-50');
    button.classList.remove('text-grey-50');
    button.classList.add('text-teal-700');
}

function googleButtonColoring(button) {
    button.classList.add('red-500');
}

function singInWithGoogle() {
    alert("I is a stub of google logging service")
}

function signIn() {
    alert("I is a stub of classic logging service")
}

function signUp() {
    alert("I is a stub of registration service")
}