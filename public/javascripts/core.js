$(document).ready(function(){
    
    profileMenu = function(el) {
        $('#profile-menu').toggle();
    };

    review = {};

    review.showForm = function(el) {
        $('#show-form-link').toggle();
        $("#review-form-container").toggle();
    };
});