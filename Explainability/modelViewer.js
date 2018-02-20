$(function() {
  $("input").on("change", function() {
    $(this).parent().prev().prev().children().first().width(100 * +$(this).val());
  })
});